-- Streaks: a log of when stations were ticked off, so weeks of activity survive later edits.
-- Written only by the trigger below; people can read their own rows.
create table if not exists public.user_progress_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  skill_slug text not null,
  created_at timestamptz not null default now()
);
alter table public.user_progress_events enable row level security;
create policy "Users read own progress events" on public.user_progress_events
  for select to authenticated using ((select auth.uid()) = user_id);
create index if not exists user_progress_events_user_idx on public.user_progress_events (user_id, created_at desc);

-- Log a station each time a skill becomes "done" (not when it's edited while already done).
create or replace function public.log_progress_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'done' and (tg_op = 'INSERT' or old.status is distinct from 'done') then
    insert into user_progress_events (user_id, skill_slug) values (new.user_id, new.skill_slug);
  end if;
  return new;
end;
$$;
revoke all on function public.log_progress_event() from public, anon, authenticated;

drop trigger if exists user_skill_status_progress_event on public.user_skill_status;
create trigger user_skill_status_progress_event
  after insert or update of status on public.user_skill_status
  for each row execute function public.log_progress_event();

-- Backfill from progress made before the log existed.
insert into public.user_progress_events (user_id, skill_slug, created_at)
select user_id, skill_slug, updated_at from public.user_skill_status
where status = 'done'
  and not exists (select 1 from public.user_progress_events e where e.user_id = user_skill_status.user_id and e.skill_slug = user_skill_status.skill_slug);

-- Consecutive weeks (Monday to Sunday, UTC) with at least one station ticked off.
-- This week counts if it already has activity; if not, the streak is still alive from last week until Sunday ends.
create or replace function public.streak_weeks(p_user uuid)
returns int
language sql
stable
security definer
set search_path = public
as $$
  with weeks as (
    select distinct date_trunc('week', created_at)::date as w
    from user_progress_events
    where user_id = p_user and created_at > now() - interval '3 years'
  ),
  anchor as (
    select case
      when exists (select 1 from weeks where w = date_trunc('week', now())::date) then date_trunc('week', now())::date
      else (date_trunc('week', now()) - interval '7 days')::date
    end as a
  ),
  numbered as (
    select ((select a from anchor) - w) / 7 as k, row_number() over (order by w desc) - 1 as rn
    from weeks
    where w <= (select a from anchor)
  )
  select count(*)::int from numbered where k = rn;
$$;
revoke all on function public.streak_weeks(uuid) from public, anon, authenticated;

-- The signed-in person's streak, and whether this week already counts.
create or replace function public.my_streak()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'weeks', streak_weeks((select auth.uid())),
    'this_week', exists (
      select 1 from user_progress_events
      where user_id = (select auth.uid()) and created_at >= date_trunc('week', now())
    )
  );
$$;
revoke all on function public.my_streak() from public, anon;
grant execute on function public.my_streak() to authenticated;

-- Public path pages show the streak too.
create or replace function public.get_public_path(p_handle text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'handle', p.handle,
    'name', coalesce(nullif(btrim(p.public_name), ''), p.handle),
    'role', up.role_slug,
    'started_at', up.started_at,
    'statuses', coalesce((select jsonb_object_agg(s.skill_slug, s.status) from user_skill_status s where s.user_id = p.id), '{}'::jsonb),
    'updated_at', greatest(up.updated_at, (select max(s.updated_at) from user_skill_status s where s.user_id = p.id)),
    'streak', streak_weeks(p.id)
  )
  from profiles p
  left join user_paths up on up.user_id = p.id
  where p.handle = lower(p_handle) and p.path_public;
$$;

-- The weekly email mentions the streak. Adding a column changes the return type, so recreate.
drop function if exists public.weekly_email_batch(int, int);
create function public.weekly_email_batch(p_group int, p_limit int default 100)
returns table (
  user_id uuid,
  email text,
  name text,
  email_token uuid,
  role_slug text,
  statuses jsonb,
  done_this_week text[],
  streak int
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    u.email::text,
    coalesce(nullif(btrim(p.public_name), ''), nullif(split_part(btrim(p.full_name), ' ', 1), '')),
    p.email_token,
    up.role_slug,
    coalesce((select jsonb_object_agg(s.skill_slug, s.status) from user_skill_status s where s.user_id = p.id), '{}'::jsonb),
    coalesce(
      (select array_agg(s.skill_slug order by s.updated_at)
       from user_skill_status s
       where s.user_id = p.id and s.status = 'done' and s.updated_at > now() - interval '7 days'),
      '{}'
    ),
    streak_weeks(p.id)
  from profiles p
  join auth.users u on u.id = p.id
  join user_paths up on up.user_id = p.id
  where p.weekly_email
    and u.email is not null
    and u.email_confirmed_at is not null
    and mod(abs(hashtext(p.id::text)), 7) = p_group
    and (p.last_weekly_email_at is null or p.last_weekly_email_at < now() - interval '6 days')
  order by p.last_weekly_email_at nulls first, p.id
  limit least(greatest(p_limit, 1), 1000);
$$;
revoke all on function public.weekly_email_batch(int, int) from public, anon, authenticated;
grant execute on function public.weekly_email_batch(int, int) to service_role;

-- Weekly progress email. Opt-in only: weekly_email is false until a person switches it on.
-- email_token identifies a person in unsubscribe links without exposing their id or email.
alter table public.profiles
  add column if not exists weekly_email boolean not null default false,
  add column if not exists email_token uuid not null default gen_random_uuid(),
  add column if not exists last_weekly_email_at timestamptz;

create unique index if not exists profiles_email_token_key on public.profiles (email_token);
create index if not exists profiles_weekly_email_idx on public.profiles (id) where weekly_email;

-- Who to email today. People are split into 7 groups by id, one group per weekday, so sends
-- spread evenly across the week. Anyone emailed in the last 6 days is skipped, so a retry never doubles up.
-- Server-only: callable with the service role key, never from the browser.
create or replace function public.weekly_email_batch(p_group int, p_limit int default 100)
returns table (
  user_id uuid,
  email text,
  name text,
  email_token uuid,
  role_slug text,
  statuses jsonb,
  done_this_week text[]
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
    )
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

-- One-click unsubscribe from the email itself, no sign-in needed. Returns true if a subscription was turned off.
create or replace function public.unsubscribe_weekly_email(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  changed int;
begin
  update profiles set weekly_email = false where email_token = p_token and weekly_email;
  get diagnostics changed = row_count;
  return changed > 0;
end;
$$;

revoke all on function public.unsubscribe_weekly_email(uuid) from public;
grant execute on function public.unsubscribe_weekly_email(uuid) to anon, authenticated;

-- Streak weeks now start on Monday in the learner's own time zone, not in UTC.
-- Replaces streak_weeks() and my_streak() from 20261011000000_streaks.sql.
-- The browser sends its time zone once (set_my_time_zone); until then the zone is UTC, as before.
alter table public.profiles add column if not exists time_zone text not null default 'UTC';

create or replace function public.set_my_time_zone(p_tz text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is null then
    return;
  end if;
  -- Only real IANA names, such as Europe/London. Anything else is ignored.
  if not exists (select 1 from pg_timezone_names where name = p_tz) then
    return;
  end if;
  update profiles set time_zone = p_tz where id = (select auth.uid());
end;
$$;
revoke all on function public.set_my_time_zone(text) from public, anon;
grant execute on function public.set_my_time_zone(text) to authenticated;

create or replace function public.streak_weeks(p_user uuid)
returns int
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  tz text;
begin
  select coalesce((select time_zone from profiles where id = p_user), 'UTC') into tz;
  return (
    with weeks as (
      select distinct date_trunc('week', created_at at time zone tz)::date as w
      from user_progress_events
      where user_id = p_user and created_at > now() - interval '3 years'
    ),
    anchor as (
      select case
        when exists (select 1 from weeks where w = date_trunc('week', now() at time zone tz)::date) then date_trunc('week', now() at time zone tz)::date
        else (date_trunc('week', now() at time zone tz) - interval '7 days')::date
      end as a
    ),
    numbered as (
      select ((select a from anchor) - w) / 7 as k, row_number() over (order by w desc) - 1 as rn
      from weeks
      where w <= (select a from anchor)
    )
    select count(*)::int from numbered where k = rn
  );
end;
$$;
revoke all on function public.streak_weeks(uuid) from public, anon, authenticated;

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
      where user_id = (select auth.uid())
        and created_at >= (date_trunc('week', now() at time zone (select time_zone from profiles where id = (select auth.uid())))
                           at time zone (select time_zone from profiles where id = (select auth.uid())))
    )
  );
$$;
revoke all on function public.my_streak() from public, anon;
grant execute on function public.my_streak() to authenticated;

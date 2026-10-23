-- The dashboard's "limit hits" count now uses the daily limit it is given, not a fixed 40.
-- Replaces admin_stats() from 20261012000000_contact_and_admin.sql. The app passes CJ_DAILY_LIMIT.
drop function if exists public.admin_stats();

create or replace function public.admin_stats(p_daily_limit int default 40)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with days as (
    select generate_series((now() at time zone 'utc')::date - 29, (now() at time zone 'utc')::date, interval '1 day')::date as d
  )
  select jsonb_build_object(
    'users', jsonb_build_object(
      'total', (select count(*) from auth.users),
      'confirmed', (select count(*) from auth.users where email_confirmed_at is not null),
      'new_7d', (select count(*) from auth.users where created_at > now() - interval '7 days'),
      'new_30d', (select count(*) from auth.users where created_at > now() - interval '30 days'),
      'active_7d', (select count(*) from auth.users where last_sign_in_at > now() - interval '7 days'),
      'providers', (select coalesce(jsonb_object_agg(p, n), '{}') from (
        select coalesce(raw_app_meta_data->>'provider', 'email') as p, count(*) as n from auth.users group by 1) x),
      'signups_by_day', (select jsonb_agg(jsonb_build_object('d', d, 'n', (
        select count(*) from auth.users u where (u.created_at at time zone 'utc')::date = days.d)) order by d) from days)
    ),
    'paths', jsonb_build_object(
      'with_route', (select count(*) from user_paths),
      'by_role', (select coalesce(jsonb_agg(jsonb_build_object('role', role_slug, 'n', n) order by n desc), '[]') from (
        select role_slug, count(*) as n from user_paths group by 1) x),
      'skills_done', (select count(*) from user_skill_status where status = 'done'),
      'skills_learning', (select count(*) from user_skill_status where status = 'learning'),
      'top_done', (select coalesce(jsonb_agg(jsonb_build_object('skill', skill_slug, 'n', n) order by n desc), '[]') from (
        select skill_slug, count(*) as n from user_skill_status where status = 'done' group by 1 order by 2 desc limit 10) x),
      'stations_by_day', (select jsonb_agg(jsonb_build_object('d', d, 'n', (
        select count(*) from user_progress_events e where (e.created_at at time zone 'utc')::date = days.d)) order by d) from days),
      'active_learners_7d', (select count(distinct user_id) from user_progress_events where created_at > now() - interval '7 days'),
      'streaks_2plus', (select count(*) from (select user_id from user_paths) up where streak_weeks(up.user_id) >= 2)
    ),
    'sharing', jsonb_build_object(
      'public_pages', (select count(*) from profiles where path_public),
      'weekly_email_on', (select count(*) from profiles where weekly_email),
      'weekly_email_sent_7d', (select count(*) from profiles where last_weekly_email_at > now() - interval '7 days')
    ),
    'chat', jsonb_build_object(
      'today', (select coalesce(sum(messages), 0) from chat_usage where day = (now() at time zone 'utc')::date),
      'total_7d', (select coalesce(sum(messages), 0) from chat_usage where day > (now() at time zone 'utc')::date - 7),
      'total_30d', (select coalesce(sum(messages), 0) from chat_usage where day > (now() at time zone 'utc')::date - 30),
      'users_7d', (select count(distinct user_id) from chat_usage where day > (now() at time zone 'utc')::date - 7),
      'limit_hits_7d', (select count(*) from chat_usage where day > (now() at time zone 'utc')::date - 7 and messages >= p_daily_limit),
      'by_day', (select jsonb_agg(jsonb_build_object('d', d, 'n', (
        select coalesce(sum(messages), 0) from chat_usage c where c.day = days.d)) order by d) from days),
      'up', (select count(*) from chat_feedback where rating = 1),
      'down', (select count(*) from chat_feedback where rating = -1),
      'up_30d', (select count(*) from chat_feedback where rating = 1 and created_at > now() - interval '30 days'),
      'down_30d', (select count(*) from chat_feedback where rating = -1 and created_at > now() - interval '30 days'),
      'index_passages', (select count(*) from doc_chunks),
      'index_updated', (select max(updated_at) from doc_chunks)
    ),
    'resources', jsonb_build_object(
      'saved', (select count(*) from user_saved_resources),
      'top_saved', (select coalesce(jsonb_agg(jsonb_build_object('url', url, 'title', title, 'n', n) order by n desc), '[]') from (
        select url, max(title) as title, count(*) as n from user_saved_resources group by url order by 3 desc limit 10) x),
      'helpful', (select count(*) from resource_votes where vote = 1),
      'not_helpful', (select count(*) from resource_votes where vote = -1),
      'top_helpful', (select coalesce(jsonb_agg(jsonb_build_object('url', url, 'n', n) order by n desc), '[]') from (
        select url, count(*) as n from resource_votes where vote = 1 group by url order by 2 desc limit 10) x),
      'reported', (select coalesce(jsonb_agg(jsonb_build_object('url', url, 'skill', skill, 'down', down, 'up', up, 'last', last) order by down desc, last desc), '[]') from (
        select url, max(skill_slug) as skill, count(*) filter (where vote = -1) as down, count(*) filter (where vote = 1) as up, max(updated_at) as last
        from resource_votes group by url having count(*) filter (where vote = -1) > 0 order by 3 desc limit 50) x),
      'suggestions', (select coalesce(jsonb_object_agg(status, n), '{}') from (select status, count(*) as n from resource_suggestions group by 1) x)
    ),
    'contact', jsonb_build_object(
      'new', (select count(*) from contact_messages where status = 'new'),
      'total', (select count(*) from contact_messages)
    )
  );
$$;
revoke all on function public.admin_stats(int) from public, anon, authenticated;
grant execute on function public.admin_stats(int) to service_role;

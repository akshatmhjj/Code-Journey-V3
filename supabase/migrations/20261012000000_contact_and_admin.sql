-- Contact form messages, and the read-only stats behind the admin dashboard.
-- Nothing here is readable from the browser: the contact form posts through /api/contact,
-- and the dashboard reads with the service role key on the server.

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  name text check (char_length(name) <= 100),
  email text not null check (char_length(email) between 3 and 254 and email like '%_@_%'),
  topic text not null default 'question' check (topic in ('question', 'suggestion', 'bug', 'partnership', 'other')),
  message text not null check (char_length(message) between 10 and 3000),
  page text check (char_length(page) <= 300),
  ip_hash text,
  status text not null default 'new' check (status in ('new', 'done')),
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
-- No policies: only the service role (server) can read or write.
create index if not exists contact_messages_status_idx on public.contact_messages (status, created_at desc);
create index if not exists contact_messages_ip_idx on public.contact_messages (ip_hash, created_at desc);

-- Failed admin sign-ins, for throttling password guessing. Server-only.
create table if not exists public.admin_login_failures (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
alter table public.admin_login_failures enable row level security;
create index if not exists admin_login_failures_ip_idx on public.admin_login_failures (ip_hash, created_at desc);

-- Everything the dashboard's overview needs, in one round trip.
create or replace function public.admin_stats()
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
      'limit_hits_7d', (select count(*) from chat_usage where day > (now() at time zone 'utc')::date - 7 and messages >= 40),
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
revoke all on function public.admin_stats() from public, anon, authenticated;
grant execute on function public.admin_stats() to service_role;

-- One page of the users list: account basics, route and progress. No passwords, tokens or IPs.
create or replace function public.admin_users(p_search text default null, p_limit int default 50, p_offset int default 0)
returns table (
  id uuid,
  email text,
  name text,
  provider text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  confirmed boolean,
  role_slug text,
  done int,
  learning int,
  streak int,
  weekly_email boolean,
  handle text,
  path_public boolean,
  chat_7d int,
  total bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with matched as (
    select u.*
    from auth.users u
    left join profiles p on p.id = u.id
    where p_search is null or p_search = ''
      or u.email ilike '%' || p_search || '%'
      or p.full_name ilike '%' || p_search || '%'
      or p.handle ilike '%' || p_search || '%'
  )
  select
    u.id,
    u.email::text,
    coalesce(nullif(btrim(p.full_name), ''), nullif(btrim(p.public_name), ''), u.raw_user_meta_data->>'full_name'),
    coalesce(u.raw_app_meta_data->>'provider', 'email'),
    u.created_at,
    u.last_sign_in_at,
    u.email_confirmed_at is not null,
    up.role_slug,
    (select count(*)::int from user_skill_status s where s.user_id = u.id and s.status = 'done'),
    (select count(*)::int from user_skill_status s where s.user_id = u.id and s.status = 'learning'),
    streak_weeks(u.id),
    coalesce(p.weekly_email, false),
    p.handle,
    coalesce(p.path_public, false),
    (select coalesce(sum(c.messages), 0)::int from chat_usage c where c.user_id = u.id and c.day > (now() at time zone 'utc')::date - 7),
    (select count(*) from matched)
  from matched u
  left join profiles p on p.id = u.id
  left join user_paths up on up.user_id = u.id
  order by u.created_at desc
  limit least(greatest(p_limit, 1), 200) offset greatest(p_offset, 0);
$$;
revoke all on function public.admin_users(text, int, int) from public, anon, authenticated;
grant execute on function public.admin_users(text, int, int) to service_role;

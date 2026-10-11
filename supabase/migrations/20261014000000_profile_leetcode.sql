-- Optional LeetCode link on a public path page (/u/<handle>).
-- Only https links to leetcode.com profiles are accepted: leetcode.com/<name> or leetcode.com/u/<name>.
alter table public.profiles
  add column if not exists leetcode_url text;

alter table public.profiles drop constraint if exists profiles_leetcode_url_format;
alter table public.profiles add constraint profiles_leetcode_url_format
  check (leetcode_url is null or leetcode_url ~ '^https://leetcode\.com/(u/)?[A-Za-z0-9_-]{1,40}/?$');

-- Same function as the profile-links migration, with the LeetCode link added. Still never returns the email.
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
    'streak', streak_weeks(p.id),
    'github_url', p.github_url,
    'linkedin_url', p.linkedin_url,
    'leetcode_url', p.leetcode_url
  )
  from profiles p
  left join user_paths up on up.user_id = p.id
  where p.handle = lower(p_handle) and p.path_public;
$$;

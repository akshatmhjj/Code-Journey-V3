-- Optional GitHub and LinkedIn links on a public path page (/u/<handle>).
-- Only https links to those two sites are accepted, so the page can never link anywhere else.
alter table public.profiles
  add column if not exists github_url text,
  add column if not exists linkedin_url text;

alter table public.profiles drop constraint if exists profiles_github_url_format;
alter table public.profiles add constraint profiles_github_url_format
  check (github_url is null or github_url ~ '^https://github\.com/[A-Za-z0-9][A-Za-z0-9-]{0,38}/?$');

alter table public.profiles drop constraint if exists profiles_linkedin_url_format;
alter table public.profiles add constraint profiles_linkedin_url_format
  check (linkedin_url is null or linkedin_url ~ '^https://(www\.)?linkedin\.com/(in|company)/[A-Za-z0-9_%-]{3,100}/?$');

-- Same function as before, with the two links added. Still never returns the email.
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
    'linkedin_url', p.linkedin_url
  )
  from profiles p
  left join user_paths up on up.user_id = p.id
  where p.handle = lower(p_handle) and p.path_public;
$$;

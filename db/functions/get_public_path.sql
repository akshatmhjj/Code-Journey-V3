-- Current definition of get_public_path(). Source of truth for reading; the migrations are what the database runs.
-- tests/db/functions.test.ts fails if this file differs from the latest migration that defines it.
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
    'leetcode_url', p.leetcode_url,
    'projects', coalesce((
      select jsonb_agg(jsonb_build_object('stage', pr.stage_name, 'title', pr.title, 'url', pr.url) order by pr.created_at)
      from user_projects pr
      where pr.user_id = p.id and pr.role_slug = up.role_slug
    ), '[]'::jsonb)
  )
  from profiles p
  left join user_paths up on up.user_id = p.id
  where p.handle = lower(p_handle) and p.path_public;
$$;

-- Projects a person has built for a stage of their route. One project per stage, shown on their public path page.
-- Only https links are accepted. Stages are matched by name, as they appear in content/roles/<role>.md.
create table if not exists public.user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role_slug text not null check (role_slug ~ '^[a-z0-9-]{2,60}$'),
  stage_name text not null check (char_length(stage_name) between 1 and 80),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  url text not null check (url ~ '^https://[^[:space:]]{4,400}$'),
  created_at timestamptz not null default now(),
  unique (user_id, role_slug, stage_name)
);

alter table public.user_projects enable row level security;

drop policy if exists "Users manage own projects" on public.user_projects;
create policy "Users manage own projects" on public.user_projects
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Public path pages: the same fields as before, plus the projects for the current route.
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

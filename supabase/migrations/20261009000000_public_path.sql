-- Public path pages at /u/<handle>. Off by default: a person picks a handle and a display name,
-- then turns sharing on. The page shows their destination and skill progress - never their email.
alter table public.profiles
  add column if not exists handle text,
  add column if not exists public_name text,
  add column if not exists path_public boolean not null default false;

alter table public.profiles
  add constraint profiles_handle_format check (handle ~ '^[a-z0-9][a-z0-9_-]{2,29}$'),
  add constraint profiles_handle_reserved check (handle not in ('admin', 'administrator', 'codejourney', 'code-journey', 'support', 'help', 'team', 'official', 'staff', 'moderator', 'root', 'null', 'undefined', 'me', 'api')),
  add constraint profiles_public_name_length check (char_length(btrim(public_name)) between 1 and 60),
  add constraint profiles_public_needs_handle check (not path_public or handle is not null);

create unique index if not exists profiles_handle_key on public.profiles (handle);

-- Everything a public path page needs, only for people who turned sharing on.
-- security definer so anon visitors never need read access to profiles or progress tables.
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
    'updated_at', greatest(up.updated_at, (select max(s.updated_at) from user_skill_status s where s.user_id = p.id))
  )
  from profiles p
  left join user_paths up on up.user_id = p.id
  where p.handle = lower(p_handle) and p.path_public;
$$;

revoke all on function public.get_public_path(text) from public;
grant execute on function public.get_public_path(text) to anon, authenticated;

-- Lets the My Path form say "taken" before saving. Returns true if free or already yours.
create or replace function public.handle_available(p_handle text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (select 1 from profiles where handle = lower(p_handle) and id <> (select auth.uid()));
$$;

revoke all on function public.handle_available(text) from public;
grant execute on function public.handle_available(text) to authenticated;

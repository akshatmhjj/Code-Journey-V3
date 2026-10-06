-- Saved resources: links a person has bookmarked to come back to.
-- Resources live in the content files and have no id, so a bookmark is keyed by URL.
-- Title and skill are a snapshot, so a bookmark still reads well if the resource later leaves the catalogue.
create table if not exists public.user_saved_resources (
  user_id uuid not null references auth.users (id) on delete cascade,
  url text not null check (url ~ '^https?://' and char_length(url) <= 2048),
  title text not null check (char_length(title) between 1 and 300),
  skill_slug text check (skill_slug ~ '^[a-z0-9-]{2,60}$'),
  saved_at timestamptz not null default now(),
  primary key (user_id, url)
);
alter table public.user_saved_resources enable row level security;
create policy "Users manage own saved resources" on public.user_saved_resources
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists user_saved_resources_user_idx on public.user_saved_resources (user_id, saved_at desc);

-- Resource votes: "was this helpful?" on each resource, keyed by URL like saved resources.
-- People manage their own vote. Everyone can read the helpful count through resource_helpful_counts();
-- thumbs-down stay private to the team as a signal for dead or outdated links.
create table if not exists public.resource_votes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  url text not null check (url ~ '^https?://' and char_length(url) <= 2048),
  vote smallint not null check (vote in (-1, 1)),
  skill_slug text check (skill_slug ~ '^[a-z0-9-]{2,60}$'),
  updated_at timestamptz not null default now(),
  primary key (user_id, url)
);
alter table public.resource_votes enable row level security;
create policy "Users manage own resource votes" on public.resource_votes
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index if not exists resource_votes_url_idx on public.resource_votes (url) where vote = 1;

create or replace function public.resource_helpful_counts(urls text[])
returns table (url text, helpful bigint)
language sql
stable
security definer
set search_path = public
as $$
  select v.url, count(*) as helpful
  from resource_votes v
  where v.vote = 1
    and v.url = any (urls[1:500])
  group by v.url;
$$;

revoke all on function public.resource_helpful_counts(text[]) from public;
grant execute on function public.resource_helpful_counts(text[]) to anon, authenticated;

-- Resource suggestions: "know a better resource?" Reviewed by the team in the dashboard.
create table if not exists public.resource_suggestions (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  skill_slug text not null check (skill_slug ~ '^[a-z0-9-]{2,60}$'),
  url text not null check (url ~ '^https?://' and char_length(url) <= 2048),
  title text check (char_length(title) <= 300),
  note text check (char_length(note) <= 1000),
  status text not null default 'new' check (status in ('new', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);
alter table public.resource_suggestions enable row level security;
create policy "Users add own suggestions" on public.resource_suggestions
  for insert to authenticated
  with check ((select auth.uid()) = user_id and status = 'new');
create policy "Users read own suggestions" on public.resource_suggestions
  for select to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists resource_suggestions_user_idx on public.resource_suggestions (user_id, created_at desc);
create index if not exists resource_suggestions_status_idx on public.resource_suggestions (status, created_at desc);

-- At most 5 suggestions per person per day, so the review queue stays manageable.
create or replace function public.limit_resource_suggestions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from resource_suggestions
      where user_id = new.user_id and created_at > now() - interval '1 day') >= 5 then
    raise exception 'suggestion_limit' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

revoke all on function public.limit_resource_suggestions() from public, anon, authenticated;

create trigger resource_suggestions_limit
  before insert on public.resource_suggestions
  for each row execute function public.limit_resource_suggestions();

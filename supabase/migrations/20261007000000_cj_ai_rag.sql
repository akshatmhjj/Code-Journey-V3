-- CJ AI: retrieval over Code Journey's own content, usage limits and answer feedback.

create extension if not exists vector with schema extensions;

-- One row per retrievable passage. Written only by the ingestion script (service role).
create table if not exists public.doc_chunks (
  id bigint generated always as identity primary key,
  key text not null unique,            -- stable id: source + section, e.g. "role:frontend-engineer#stage-2"
  source_type text not null,           -- role | skill | term | post | faq | domain | guide
  url text not null,                   -- page the passage links to
  title text not null,                 -- page title
  heading text not null default '',    -- section within the page
  content text not null,               -- text sent to the model (includes title/heading prefix)
  content_hash text not null,          -- skip re-embedding unchanged passages
  embedding extensions.vector(768) not null,
  tsv tsvector generated always as (to_tsvector('english', title || ' ' || heading || ' ' || content)) stored,
  updated_at timestamptz not null default now()
);

create index if not exists doc_chunks_embedding_idx on public.doc_chunks using hnsw (embedding extensions.vector_cosine_ops);
create index if not exists doc_chunks_tsv_idx on public.doc_chunks using gin (tsv);

alter table public.doc_chunks enable row level security;
-- No policies: the table is reachable only through match_doc_chunks() below or the service role.

-- Hybrid search: vector similarity and full-text, merged with reciprocal rank fusion.
create or replace function public.match_doc_chunks(
  query_embedding extensions.vector(768),
  query_text text,
  match_count int default 8
)
returns table (key text, source_type text, url text, title text, heading text, content text, similarity float, score float)
language sql
stable
security definer
set search_path = public, extensions
as $$
  with vec as (
    select c.id, row_number() over (order by c.embedding <=> query_embedding) as r,
           1 - (c.embedding <=> query_embedding) as sim
    from doc_chunks c
    order by c.embedding <=> query_embedding
    limit 40
  ),
  kw as (
    select c.id, row_number() over (order by ts_rank_cd(c.tsv, q) desc) as r
    from doc_chunks c, websearch_to_tsquery('english', query_text) q
    where c.tsv @@ q
    order by ts_rank_cd(c.tsv, q) desc
    limit 40
  )
  select c.key, c.source_type, c.url, c.title, c.heading, c.content,
         coalesce(vec.sim, 1 - (c.embedding <=> query_embedding)) as similarity,
         coalesce(1.0 / (60 + vec.r), 0) + coalesce(1.0 / (60 + kw.r), 0) as score
  from doc_chunks c
  left join vec on vec.id = c.id
  left join kw on kw.id = c.id
  where vec.id is not null or kw.id is not null
  order by score desc
  limit least(match_count, 20);
$$;

revoke all on function public.match_doc_chunks(extensions.vector, text, int) from public;
grant execute on function public.match_doc_chunks(extensions.vector, text, int) to anon, authenticated, service_role;

-- Daily message counter per user, for rate limiting.
create table if not exists public.chat_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default (now() at time zone 'utc')::date,
  messages int not null default 0,
  primary key (user_id, day)
);
alter table public.chat_usage enable row level security;
create policy "Users read own chat usage" on public.chat_usage
  for select to authenticated using ((select auth.uid()) = user_id);

-- Atomically counts one message for the calling user; returns false once the daily limit is reached.
create or replace function public.consume_chat_message(daily_limit int default 40)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  used int;
begin
  if uid is null then
    return false;
  end if;
  insert into chat_usage (user_id, day, messages)
  values (uid, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, day) do update set messages = chat_usage.messages + 1
  returning messages into used;
  return used <= daily_limit;
end;
$$;

revoke all on function public.consume_chat_message(int) from public;
grant execute on function public.consume_chat_message(int) to authenticated;

-- Thumbs up/down on answers. Users can add and read their own; the team reads all via the dashboard.
create table if not exists public.chat_feedback (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  question text not null check (char_length(question) <= 2000),
  answer text not null check (char_length(answer) <= 8000),
  sources text[] not null default '{}',
  rating smallint not null check (rating in (-1, 1)),
  comment text check (char_length(comment) <= 1000),
  created_at timestamptz not null default now()
);
alter table public.chat_feedback enable row level security;
create policy "Users add own feedback" on public.chat_feedback
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users read own feedback" on public.chat_feedback
  for select to authenticated using ((select auth.uid()) = user_id);
create index if not exists chat_feedback_user_id_idx on public.chat_feedback (user_id);

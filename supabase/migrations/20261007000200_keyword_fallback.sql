-- Allow keyword-only search when no query embedding is available (e.g. embedding quota exhausted).
drop function if exists public.match_doc_chunks(extensions.vector, text, int);

create or replace function public.match_doc_chunks(
  query_embedding extensions.vector(768) default null,
  query_text text default '',
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
    where query_embedding is not null
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
         case when query_embedding is null then null else coalesce(vec.sim, 1 - (c.embedding <=> query_embedding)) end as similarity,
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

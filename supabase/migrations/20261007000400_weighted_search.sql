-- Keyword search quality: weight title/heading above body, and only fall back to
-- any-word matching when a strict (all words) match finds nothing.

alter table public.doc_chunks drop column tsv;
alter table public.doc_chunks add column tsv tsvector
  generated always as (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', heading), 'B') ||
    setweight(to_tsvector('english', content), 'C')
  ) stored;
create index doc_chunks_tsv_idx on public.doc_chunks using gin (tsv);

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
  with words as (
    select array_remove(array_agg(w), null) as ws
    from (
      select w from unnest(string_to_array(regexp_replace(lower(query_text), '[^a-z0-9#+ ]', ' ', 'g'), ' ')) as w
      where length(w) > 2
        and w not in ('the','and','for','what','how','should','want','does','with','that','this','are','you','your','can','get','good','need','about','from','into','like','its','job','jobs','role','roles')
    ) x
  ),
  strict_q as (select websearch_to_tsquery('english', query_text) as tsq),
  strict_kw as (
    select c.id, ts_rank_cd(c.tsv, s.tsq, 2) as rank
    from doc_chunks c, strict_q s
    where s.tsq is not null and c.tsv @@ s.tsq
    order by rank desc
    limit 40
  ),
  loose_q as (
    select case when (select count(*) from strict_kw) > 0 or coalesce(array_length((select ws from words), 1), 0) = 0
                then null
                else to_tsquery('english', array_to_string((select ws from words), ' | ')) end as tsq
  ),
  loose_kw as (
    select c.id, ts_rank_cd(c.tsv, l.tsq, 2) as rank
    from doc_chunks c, loose_q l
    where l.tsq is not null and c.tsv @@ l.tsq
    order by rank desc
    limit 40
  ),
  kw as (
    select id, row_number() over (order by rank desc) as r
    from (select * from strict_kw union all select * from loose_kw) k
  ),
  vec as (
    select c.id, row_number() over (order by c.embedding <=> query_embedding) as r,
           1 - (c.embedding <=> query_embedding) as sim
    from doc_chunks c
    where query_embedding is not null
    order by c.embedding <=> query_embedding
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

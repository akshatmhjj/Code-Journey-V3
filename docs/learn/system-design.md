# How the System Design section works

System Design is a set of reading paths for people at three levels: beginner, intermediate and advanced. Each path is an ordered list of articles. Each article gets its own page on Code Journey with a short summary, the key ideas, what to read first, the terms it uses, and a link to the full original.

The original threads and articles were written by **@Harry_The_Nerd**. Every page in this section credits them and links to their profile. The summaries, the reading order and the layout are Code Journey's own.

## The pieces

| Piece | Where it lives | What it does |
|---|---|---|
| Content files | `content/system-design/paths/*.yaml` | One file per path: its purpose, what it assumes, what you can do by the end, the ordered articles, and quick-check questions. |
| Glossary | `content/system-design/glossary.yaml` | Plain-English definitions. Articles point to them by id. |
| Loader | `src/lib/system-design.ts` | Reads the files, checks them, and fails the build if anything does not hold together. |
| Constants | `src/lib/system-design-meta.ts` | Levels, topics and the creator credit. No `server-only`, so client components can use it. |
| Pages | `src/app/(site)/system-design/` | The index, one page per path, one page per article, the article list and the glossary. |

## What the loader checks

A mistake in a YAML file should stop the build, not reach a reader. The loader checks that:

- every field is present and the level and topic are from the allowed lists;
- every article id is unique across all paths;
- every term an article uses exists in the glossary;
- every article an article needs exists, and when it is in the same path it comes **earlier** in the list.

That last rule is what makes "read this first" trustworthy. If you reorder a path and break a prerequisite, the build tells you which one.

## Adding or changing an article

1. Open the path file and add an entry to `articles`, in the place where it should be read.
2. Give it an `id` (lowercase, hyphens), the original `title`, a `topic`, a `level`, a `date`, and the `source` link.
3. Write `why` (why it sits here), a `summary`, and at least three `points`. Write these in your own words. Do not paste text from the original.
4. List `needs` (articles to read first) and `terms` (glossary ids).
5. Run `npm test` and `npm run lint`.

Keep to the house style: no em dashes or en dashes. Use a spaced hyphen. The tests fail if one slips in.

## The credit rule

The tests also check that the creator credit exists and that no text we wrote names the site where the list was first found. The `source` links are the only place that site can appear, because a few articles live only there.


## Why the order differs from the original list

The original list was close to publish order. Some articles depend on ones that come later, for example Redis and Kafka sit after designs that use them. Here each path is ordered by what you need to know first, and each step says why it is there.

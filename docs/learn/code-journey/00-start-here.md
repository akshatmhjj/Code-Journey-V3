# Code Journey: start here

This folder teaches you the whole of Code Journey: what it is, how it is built, what is clever about it, what is weak, and how to talk about it in an interview.

Every fact here was read from the code in the repo on 2026-10-22 (branch `Dev`, version 2.0.0). Where an older document in `docs/` disagrees with the code, the code wins. The differences are listed in [12-known-gaps-and-improvements.md](12-known-gaps-and-improvements.md).

---

## Reading order by goal

| Your goal | Read these, in order | Time |
|---|---|---|
| **Explain the project to someone in 2 minutes** | 01 (pitch), 03 (features, top 5 section) | 20 min |
| **Prepare for a technical interview** | 01, 02 (Q&A bank), 04 (system design), 06 (AI), 07 (security) | 2 to 3 hours |
| **Draw the whole system on a whiteboard** | 04 (system design), 05 (data model) | 1 hour |
| **Understand the code well enough to change it** | 09 (frontend), 08 (My Path), 13 (file map), then the rest | 1 day |
| **Answer "what would you do differently?"** | 11 (decisions), 12 (gaps) | 45 min |

---

## The files

| File | What you get |
|---|---|
| [01-pitch-and-talking-points.md](01-pitch-and-talking-points.md) | The problem, the idea, a 30-second, 2-minute and 5-minute pitch, the numbers to quote, and what to claim carefully |
| [02-interview-qa-bank.md](02-interview-qa-bank.md) | About 45 likely questions with model answers and the file to point at |
| [03-interesting-features.md](03-interesting-features.md) | Every feature, what it does for a visitor, what is technically interesting, and a demo path |
| [04-system-design.md](04-system-design.md) | The whole system: components, diagrams, request flows, failure modes, scaling |
| [05-content-and-data-model.md](05-content-and-data-model.md) | How content becomes pages (files, not a CMS), and every database table with its access rules |
| [06-cj-ai-rag.md](06-cj-ai-rag.md) | The chatbot end to end: indexing, hybrid search, grounding, streaming, limits, evaluation |
| [07-security-and-privacy.md](07-security-and-privacy.md) | The three levels of database access, row-level security, admin login, rate limits, privacy choices |
| [08-my-path-and-progress.md](08-my-path-and-progress.md) | Progress maths, optimistic updates, milestones, streaks in SQL, the weekly email |
| [09-frontend-and-ui.md](09-frontend-and-ui.md) | Next.js App Router structure, the server and client split, themes, the metro map, SEO |
| [10-delivery-ci-and-operations.md](10-delivery-ci-and-operations.md) | Build gates, CI workflows, cron, migrations, service-worker releases, a runbook for incidents |
| [11-decisions-and-history.md](11-decisions-and-history.md) | The timeline from git and the decisions behind the big choices, with trade-offs |
| [12-known-gaps-and-improvements.md](12-known-gaps-and-improvements.md) | Honest weaknesses, stale docs, and the improvements in priority order |
| [13-file-map-and-glossary.md](13-file-map-and-glossary.md) | Where to find each thing in the code, and the vocabulary (domain, station, RLS, RRF, SSE...) |

---

## Quick facts

| Thing | Number | Where it comes from |
|---|---|---|
| Career roles | 26 | `content/roles/*.md` |
| Skills | 99 | `content/skills/*.md` |
| Domains ("lines" on the map) | 10 | `content/catalog.yaml` |
| Blog posts | 13 | `content/blog/*.md` |
| Compass quiz questions | 8 | `content/compass.yaml` |
| Database migrations | 19 | `supabase/migrations/` |
| TypeScript and TSX lines in `src/` and `scripts/` | about 12,300 | counted with `wc -l` |
| Git commits | 166 (from 2026-03-31 to 2026-10-20) | `git log` |
| Automated tests | 0 (quality gates instead: content check, lint, typecheck, build, RAG eval) | `package.json` |
| Daily CJ AI messages per signed-in user | 40 | `CJ_DAILY_LIMIT` in `src/app/api/chat/route.ts` |
| Embedding size for CJ AI | 768 dimensions | `src/lib/gemini.ts` |
| Colour themes | 4, each in light and dark | `src/lib/site.ts` |

---

## One paragraph, if you read nothing else

Code Journey is a free, mostly static website that draws tech careers as a metro map. Every role is a destination, every skill is a station, and every station links to the best official docs. The written content lives in Markdown and YAML files, checked and built into static pages by Next.js. Accounts, progress, votes and bookmarks live in Supabase Postgres, and the browser talks to the database directly, protected by row-level security. The features that need a server-side secret or heavy logic are few: a streaming RAG chatbot (CJ AI, which answers only from the site's own content, with citations), a contact form, a password-protected admin dashboard, a daily cron that sends opt-in weekly progress emails, and one-click unsubscribe. The app installs as a PWA and works offline for pages you have already seen.

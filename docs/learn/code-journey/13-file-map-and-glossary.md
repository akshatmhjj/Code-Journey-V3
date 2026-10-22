# File map and glossary

Two reference lists: where each thing lives in the repo, and what each word means. Keep this open while you read the code.

---

## 1. The repo at a glance

```text
Code-Journey-V3/
├── content/                   All written content (see 05-content-and-data-model.md)
│   ├── catalog.yaml           The map: domains, roles, skills
│   ├── roles/                 26 career routes (Markdown)
│   ├── skills/                99 skill pages (Markdown)
│   ├── blog/                  13 articles (Markdown)
│   ├── compass.yaml           The role-finder quiz
│   ├── market.yaml            Pay data with sources
│   ├── skill-aliases.yaml     Words the job post checker recognises
│   ├── glossary.yaml, faq.yaml, changelog.yaml, snippets.json
│   └── ...
├── docs/
│   ├── user-guide.md          What the product is, for a visitor
│   ├── developer-guide.md     The developer's first read
│   ├── developer-setup.md     Getting it running, level by level
│   ├── technical-notes.md     Owner's quick reference (partly stale)
│   ├── learn/pwa.md           How the installable app works
│   └── learn/code-journey/    This folder
├── public/sw.js               The service worker (plain JavaScript)
├── scripts/
│   ├── check-content.ts       Content relationships, runs before every build
│   ├── check-links.ts         External link check
│   └── rag/                   CJ AI indexing and evaluation
├── src/
│   ├── app/                   Pages, route handlers and metadata
│   ├── components/            UI, grouped by feature
│   └── lib/                   Logic, data access and shared types
├── supabase/
│   ├── config.toml            Local Supabase settings
│   └── migrations/            19 SQL files, applied in order
├── .github/workflows/         link-check.yml, cj-ai-index.yml
├── next.config.ts             Redirects, headers, traced content for runtime routes
├── vercel.json                The daily cron
├── AGENTS.md, CLAUDE.md       Instructions for AI coding tools
└── package.json               Scripts and dependencies
```

Git-ignored and not part of the app: `.env`, `.next/`, `node_modules/`, `.ig-scratch/` (social graphics and Lighthouse reports).

---

## 2. Where to find each thing

### Pages (`src/app/`)

| Thing you want | File |
|---|---|
| The home page and the map | `src/app/(site)/page.tsx` |
| A role page | `src/app/(site)/roles/[slug]/page.tsx` |
| A skill page | `src/app/(site)/skills/[slug]/page.tsx` |
| The role comparison | `src/app/(site)/roles/compare/` |
| Compass | `src/app/(site)/compass/` |
| The job post checker | `src/app/(site)/gap/` |
| Pay by role | `src/app/(site)/market/` |
| My Path | `src/app/(site)/me/` (sections in `me-sections.tsx`) |
| The public path page | `src/app/(site)/u/[handle]/` |
| Sign in | `src/app/(auth)/login/` |
| The admin dashboard | `src/app/(admin)/admin/` |
| The FAQ and contact form | `src/app/(site)/faq/` |
| Privacy and terms | `src/app/(site)/(legal)/` |
| The unsubscribe page | `src/app/(site)/email/unsubscribe/` |
| The offline page | `src/app/offline/` |

### Route handlers (`src/app/api/`)

| Route | Purpose |
|---|---|
| `/api/chat` | CJ AI: auth, quota, retrieval, streamed answer |
| `/api/contact` | Contact form: honeypot, rate limit, insert |
| `/api/cron/weekly-email` | Daily email batch |
| `/api/email/unsubscribe` | One-click unsubscribe |

### Crawlers and PWA files (`src/app/`)

| File | Purpose |
|---|---|
| `manifest.ts` | Web app manifest, with shortcuts |
| `sitemap.ts`, `robots.ts` | Search and crawler rules |
| `llms.txt/route.ts` | Plain-text description for AI assistants |
| `search-index.json/route.ts` | Data for the command palette |
| `opengraph-image.tsx`, `apple-icon.tsx`, `icons/[name]/route.tsx` | Images and icons |
| `error.tsx`, `not-found.tsx` | Error and 404 pages |

### Components (`src/components/`)

| Folder | Key files |
|---|---|
| `shell/` | `UIProvider.tsx` (shared UI state), `CommandPalette.tsx`, `ChatPanel.tsx`, `ThemeSettings.tsx`, `Header.tsx`, `PhoneHeader.tsx`, `Footer.tsx`, `Consent.tsx`, `InstallApp.tsx`, `ServiceWorker.tsx`, `Sheet.tsx` |
| `map/` | `NetworkMap.tsx`, `Line.tsx`, `RouteStages.tsx`, `NetworkList.tsx` |
| `path/` | `PathProvider.tsx` (state), `SaveRoute.tsx`, `SkillProgress.tsx`, `SaveResource.tsx`, `ResourceVotes.tsx`, `SuggestResource.tsx`, `StreakMilestones.tsx`, `CelebrationToast.tsx`, `ProfileLinks.tsx` |
| `ui/` | `Trail.tsx`, `Station.tsx`, `Disclosure.tsx`, `RoleToc.tsx`, `JsonLd.tsx`, `Mapping.tsx`, `bits.tsx` |
| `market/` | `PayBlock.tsx` |
| `brand/` | `Logo.tsx` |

### Logic (`src/lib/`)

| File | Purpose | Runs on |
|---|---|---|
| `content.ts` | Loads and validates all content, builds the network, compare data and path index | Server only |
| `path.ts` | Progress maths, hours and weeks estimates | Both |
| `milestones.ts` | Milestones and celebration rules | Both |
| `compass.ts` | Quiz scoring | Both |
| `gap.ts` | Job post matching, role fit, learning order | Both |
| `money.ts` | Currency formatting | Both |
| `lines.ts` | Line styles for the map | Both |
| `supabase.ts` | Browser client and `useUser()` | Browser |
| `admin.ts` | Admin password, signed cookie, rate limit, `adminDb()` | Server only |
| `gemini.ts` | Gemini REST: embeddings, streaming, quick generation | Server and scripts |
| `rag.ts` | Exact entity lookup and re-exports | Server only |
| `rag-prompt.ts` | System prompt and source formatting | Both (scripts use it) |
| `markdown.ts` | Markdown to HTML and syntax highlighting | Server |
| `public-path.ts` | Reads the public path page | Server |
| `email/weekly.ts` | Builds the weekly email | Server (pure function) |
| `og.tsx`, `app-icon.tsx` | Share and app icons | Server |
| `site.ts` | Name, URL, themes, the default theme | Both |
| `gap-examples.ts` | Sample job adverts for the job checker | Browser |

### Styles

| File | Purpose |
|---|---|
| `src/app/globals.css` | Tailwind import, the four palettes and their dark modes, sheet animations, shared utility classes |
| `postcss.config.mjs` | Connects Tailwind 4 |

### Database (`supabase/migrations/`)

| Topic | Migration |
|---|---|
| Baseline schema | `20261005000000_baseline.sql` |
| Profile trigger | `20261006000000_profile_on_signup.sql` |
| RLS fix and indexes | `20261006000100_profiles_rls_and_indexes.sql` |
| CJ AI search, quota, feedback | `20261007000000_cj_ai_rag.sql` |
| CJ AI grants | `20261007000100_cj_ai_grants.sql` |
| Keyword fallback | `20261007000200_keyword_fallback.sql` |
| Any-word matching | `20261007000300_keyword_any_word.sql` |
| Weighted search | `20261007000400_weighted_search.sql` |
| Saved theme | `20261007000500_profile_theme.sql` |
| My Path tables | `20261007000600_my_path.sql` |
| Saved resources | `20261008000000_saved_resources.sql` |
| Votes and suggestions | `20261008000100_resource_votes_and_suggestions.sql` |
| Public path | `20261009000000_public_path.sql` |
| Weekly email | `20261010000000_weekly_email.sql` |
| Streaks and event log | `20261011000000_streaks.sql` |
| Contact form and admin | `20261012000000_contact_and_admin.sql` |
| GitHub and LinkedIn links | `20261013000000_profile_links.sql` |
| LeetCode link | `20261014000000_profile_leetcode.sql` |
| Project showcase | `20261020000000_project_showcase.sql` |

### Scripts and CI

| File | Purpose |
|---|---|
| `scripts/check-content.ts` | Relationship checks (prebuild) |
| `scripts/check-links.ts` | External link checks |
| `scripts/rag/chunks.ts` | Turns content into passages |
| `scripts/rag/ingest.ts` | Embeds changed passages and syncs the table |
| `scripts/rag/eval.ts` | Retrieval quality and off-topic similarity |
| `scripts/rag/ask.ts` | Ask CJ AI from the terminal |
| `.github/workflows/link-check.yml` | Weekly and PR link and content checks |
| `.github/workflows/cj-ai-index.yml` | Index sync and evaluation on content changes |

### Configuration

| File | Purpose |
|---|---|
| `next.config.ts` | Environment mapping, traced content for runtime routes, redirects, security headers |
| `vercel.json` | Daily cron for the weekly email |
| `tsconfig.json` | Strict mode, the `@/` path alias |
| `eslint.config.mjs` | Lint rules |
| `.claude/launch.json` | Dev server for the Claude desktop app (port 3100) |

---

## 3. Tracing a feature through the code

Use this recipe when you want to understand or change something. It is the same for every feature.

1. **Find the page.** Search `src/app` for the route name.
2. **Find the data.** Look at what the page calls: `getRole()`, `getSkill()`, `getNetwork()` from `content.ts`, or a Supabase call.
3. **Find the rules.** Look for the validation (Zod schema, a `check` constraint, or a check in the route).
4. **Find the state.** If it is in `PathProvider` or `UIProvider`, the state is shared.
5. **Find the tests.** There are none, so read the migration or the schema for the expected behaviour, and the content checker for the content rules.

Worked example, "where does a streak come from?":

1. The My Path page (`me/MeView.tsx`) shows `StreakMilestones.tsx`.
2. That calls the `my_streak()` RPC (or reads the streak from the public path).
3. `my_streak()` is in `supabase/migrations/20261011000000_streaks.sql`, and calls `streak_weeks()`.
4. The rows come from `user_progress_events`, which a trigger writes from `user_skill_status`.

---

## 4. Glossary

### Product words

| Term | Meaning |
|---|---|
| **Code Journey** | The free map of tech careers |
| **Domain** | A field of tech, drawn as a line on the map (Web, Mobile, Data, AI, Cloud & DevOps, Quality, Security, Customer-facing, Specialist, Foundations) |
| **Line** | The map's word for a domain. Each line has a style |
| **Role** | A job, drawn as a destination (for example Frontend Engineer). There are 26 |
| **Skill** | One thing to learn, drawn as a station. There are 99 |
| **Station** | The map's word for a skill, also used in My Path for "tick this off" |
| **Stage** | One part of a route: Foundations, Core, Job-ready or Senior |
| **Route** | A role's stages and skills, in order |
| **Destination** | The role a person has chosen to work towards (My Path) |
| **My Path** | A signed-in person's route and progress |
| **Compass** | The eight-question role-finder quiz |
| **Compare** | Side-by-side view of two roles |
| **Job post checker (Gap)** | Paste a job advert to see which skills it asks for. The route is `/gap` |
| **CJ AI** | The chatbot that answers only from the site's content |
| **Wave** | A launch group in the catalogue. Wave 1 roles appear in the header |
| **Live** | A role or skill that has its own page. Others show as "being mapped" |
| **Curate, don't teach** | The principle: link to the best official and free material, and sell nothing |
| **Stations ticked** | Skills marked "done" |
| **Streak** | Consecutive weeks with at least one station ticked |
| **Milestone** | A marker on a route: first station, halfway, a stage complete, or the route complete |
| **Celebration** | The toast that appears when a tick completes a stage or route |
| **Public path page** | An opt-in page at `/u/handle` that shows someone's route and progress |
| **Proof of work (projects)** | A project link for each stage, shown on the public page |
| **Hours left** | A range of hours still needed, from the skill estimates |

### Technical words

| Term | Meaning |
|---|---|
| **App Router** | Next.js's file-based router in `src/app`, with server components by default |
| **Route group** | A folder in parentheses, such as `(site)`, that groups routes without changing the URL |
| **Server component** | A component that runs on the server or at build time and sends HTML |
| **Client component** | A component marked `"use client"`, which runs in the browser |
| **`server-only`** | A package import that makes the build fail if a client file imports the module |
| **`generateStaticParams`** | Lists the slugs a dynamic route should build at build time |
| **Static generation** | Building pages to HTML in advance, so they need no server at request time |
| **Zod** | A library that checks the shape of data at runtime |
| **Front matter** | YAML at the top of a Markdown file, between `---` lines |
| **Slug** | The lowercase, hyphenated identifier for a page, such as `frontend-engineer` |
| **Supabase** | Hosted Postgres, with authentication, row-level security and an API |
| **Postgres** | The database engine behind Supabase |
| **RLS (row-level security)** | Database rules that decide which rows each user may read or write |
| **Policy** | One RLS rule, for example "users manage their own rows" |
| **Anon key** | The public key that identifies the project. Safe in the browser, limited by RLS |
| **Service role key** | The secret key that bypasses RLS. Server only |
| **`security definer`** | A function that runs with its owner's rights, not the caller's |
| **`search_path`** | The list of schemas Postgres searches for names. Fixed on sensitive functions to prevent shadowing |
| **Trigger** | A database rule that runs a function on insert, update or delete |
| **Migration** | A SQL file that changes the schema, applied in order |
| **`db push` / `db reset`** | Supabase CLI commands: apply new migrations to a project, or rebuild a local database from all of them |
| **RPC** | A database function called over the API, such as `rpc('match_doc_chunks', ...)` |
| **pgvector** | The Postgres extension that stores and searches vectors |
| **Embedding** | A list of numbers (here 768) that represents the meaning of a text |
| **Cosine distance** | A measure of how close two embeddings point in the same direction |
| **HNSW** | A fast index structure for nearest-neighbour vector search |
| **Full-text search, `tsvector`** | Postgres's word search, with ranked matches |
| **RAG (retrieval-augmented generation)** | Find relevant passages first, then have the model answer from them |
| **Passage (chunk)** | A piece of content small enough to be retrieved and shown to the model |
| **Hybrid search** | Combining vector search and keyword search |
| **RRF (reciprocal rank fusion)** | Combining ranked lists by summing `1/(k + rank)`, with k = 60 here |
| **Grounding** | Forcing an answer to rely only on the supplied sources |
| **Similarity threshold** | The minimum similarity of the top result before the model is asked to answer (`CJ_MIN_SIMILARITY`) |
| **Hit rate** | The share of evaluation questions whose right page appeared in the top results |
| **SSE (server-sent events)** | A one-way stream from server to browser, with `event:` and `data:` lines |
| **Streaming** | Sending an answer as it is generated, rather than all at once |
| **Gemini** | Google's model family, used for embeddings and chat |
| **Thinking level** | A setting on Gemini 3.x models for how much the model reasons before answering |
| **Optimistic update** | Showing a change in the UI before the server confirms it, and undoing it if the save fails |
| **Rollback** | Restoring the previous state after a failed write |
| **Event log** | An append-only table of things that happened, used to derive history such as streaks |
| **Consent Mode** | Google's way of setting analytics and ad storage by the visitor's consent |
| **GA4** | Google Analytics 4 |
| **PWA (progressive web app)** | A website that can be installed and can work offline |
| **Web app manifest** | The JSON file that describes an installable app |
| **Service worker** | A background script that intercepts requests, to cache them or to serve them offline |
| **Caching strategy** | How a request is answered: network first, cache first, or stale-while-revalidate |
| **Stale-while-revalidate** | Answer from the cache now, refresh it in the background |
| **Precache** | Saving files during the service worker's install step |
| **Honeypot** | A hidden form field that people never fill in, but bots do |
| **HMAC** | A keyed signature that proves a value was made by someone who knows the key |
| **Constant-time comparison** | A comparison whose duration does not reveal how many characters matched |
| **JSON-LD** | Structured data in a script tag that helps search engines understand a page |
| **Open Graph** | Metadata that controls how a link looks when shared |
| **Sitemap** | A list of pages for search engines |
| **`robots.txt`** | Rules that tell crawlers which paths they may visit |
| **`llms.txt`** | A plain-text file describing a site for AI assistants |
| **noindex** | A page-level instruction telling search engines not to list the page |
| **CSP (Content-Security-Policy)** | A header that limits where a page may load scripts and other resources from. Not yet set in this project |
| **Vercel Cron** | A scheduler that calls a URL on a timetable |
| **Resend** | The transactional email service used for the weekly email |
| **CI** | Continuous integration: automatic checks run on each change, here with GitHub Actions |
| **Prebuild** | A script that runs before `npm run build` (here, the content check) |
| **Lint and typecheck** | Static checks for code style and types |

### Words the codebase uses that may surprise you

| Word | What it means here |
|---|---|
| **`live`** | A catalogue entry that has its own page |
| **`wave`** | A launch group, from 1 upward |
| **`exact`** | In pay data, whether the published title matches the role exactly |
| **`doneWhen`** | The checkable statement at the end of each stage |
| **`must`, `should`, `nice`** | Skill priority in a role |
| **`cj-` prefix** | The naming prefix for the service worker's caches |
| **`cj-consent`, `cj-theme`, `cj-mode`** | The `localStorage` keys for consent, theme and mode |
| **`data-cj`** | The `<html>` attribute that selects the palette |
| **`ig-scratch`** | A git-ignored folder for social graphics, not part of the app |

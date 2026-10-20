# Developer Guide: read this before you change anything

This is the document a new developer should read first. It explains what Code Journey is, how the code is organised, the ideas that are not obvious from the files, the rules the project follows, and step-by-step recipes for the common jobs.

- To get the project running, use `docs/developer-setup.md`.
- For a plain description of the product, use `docs/user-guide.md`.
- For a shorter owner's reference (stack, tables, workflows), use `docs/technical-notes.md`.
- For how the installable app and offline mode work, use `docs/learn/pwa.md`.

Facts here were checked against the repo on 2026-10-09 (version 2.0.0, Next.js 16.3.8, React 19, TypeScript 6). Line numbers are avoided on purpose because they go stale. Search for the names instead.

---

## 1. What this project is, in one minute

Code Journey is a free **map of tech careers**. A visitor picks a job role, sees the skills it takes in the order to learn them, and gets links to the best official docs and free resources for each skill. It does **not** host courses. It curates.

The site is drawn like a metro map, and the code uses the same words:

| Word in the code and content | Metro word | Meaning | How many |
|---|---|---|---|
| **domain** | Line | A field: Web, Mobile, Data, AI, Cloud & DevOps, Quality, Security, Customer-facing, Specialist, Foundations | 10 |
| **role** | Destination | A job, such as Frontend Engineer | 26 |
| **skill** | Station | One thing to learn, such as Git | 99 |
| **stage** | Section of a route | Foundations, Core, Job-ready, Senior, each with a project and a "done when" | 4 per role |
| **route** | The whole journey | A role's stages and skills in order | |
| **path** or **My Path** | The visitor's own progress | Their chosen role plus a status per skill | |

Other names you will meet:

| Name | Meaning |
|---|---|
| **Compass** | The 8-question quiz that suggests roles |
| **Gap** (`/gap`) | The job post checker. Paste a job ad, see which skills it mentions |
| **CJ AI** | The chatbot that answers only from the site's own content |
| **Passage** or **chunk** | A small piece of content stored for CJ AI to search |
| **live** | A role or skill that has its own written page. Everything else in the catalog shows as "being mapped" |
| **wave** | A launch group on each role in `catalog.yaml`. Wave 1 roles (the first 10) are the ones featured in the header and on the home page |
| **Harbor, Juniper, Tangerine, Orchard** | The four colour themes. Tangerine is the default |

---

## 2. The one big idea: content is data, separate from code

Almost everything a visitor reads lives in **plain files in `content/`**, not in components. Adding a skill or fixing a salary figure is an edit to a Markdown or YAML file, not a code change.

```
content/ (Markdown + YAML)         src/lib/content.ts            pages in src/app
 catalog.yaml          ───────►   read from disk, validated  ───►  rendered at build time
 roles/*.md                       with Zod, cached                 (static pages)
 skills/*.md
 blog/*.md, *.yaml, ...
```

Two layers of checking protect this:

1. **`scripts/check-content.ts`** runs before every build (`prebuild`). It catches broken *links between files*: an unknown skill slug, a role missing from the catalog, a duplicate resource URL, a compass answer pointing at a role that does not exist.
2. **`src/lib/content.ts`** validates the *shape* of each file with Zod when pages are built. A file with a missing required field fails the build.

So **a typo in content fails the build**, not production. That is deliberate. Trust it, and run `npm run content:check` after every content edit.

---

## 3. How the system fits together

```
                        ┌──────────────────────────────┐
   Visitor's browser    │          Vercel              │         Supabase
 ┌───────────────────┐  │  ┌────────────────────────┐  │  ┌───────────────────┐
 │ React pages       │◄─┼──┤ Next.js (App Router)   │  │  │ Postgres          │
 │ + client state    │  │  │  • static pages from   │  │  │  profiles, paths, │
 │ (PathProvider,    │  │  │    content/ files      │  │  │  progress, votes, │
 │  UIProvider)      │  │  │  • /api/chat           │──┼─►│  doc_chunks (AI)  │
 │                   │  │  │  • /api/contact        │  │  │ Auth              │
 │ Talks to Supabase │──┼──┼─►• /api/cron/...       │  │  │ Row-level security│
 │ DIRECTLY for the  │  │  │  • /admin (server)     │  │  └───────────────────┘
 │ visitor's own data│  │  └────────────────────────┘  │
 └───────────────────┘  └──────────────────────────────┘      Gemini (embeddings + chat)
                                                               Resend (weekly email)
```

Three rules explain most of the design:

1. **Public content is rendered on the server from files.** No database is involved in showing a role or skill page.
2. **A signed-in visitor's own data (progress, bookmarks, votes) is read and written straight from the browser to Supabase**, using the public "anon" key. Safety comes from **row-level security (RLS)** rules in the database, not from API routes. See `PathProvider.tsx` for the pattern.
3. **API routes exist only where the browser must not be trusted or must not hold a secret:** the chatbot (Gemini key, rate limit), the contact form (spam protection), the weekly email (secrets), and unsubscribe.

---

## 4. Repository map

```
content/             All written content. See section 5.
docs/                These guides. docs/learn/ holds teaching guides (pwa.md).
public/sw.js         The service worker (offline support). Plain JS, not bundled.
scripts/             Command-line tools: content check, link check, CJ AI indexing.
supabase/            Database: config.toml and numbered SQL migrations.
.github/workflows/   Two automated jobs (link check, CJ AI index).
.claude/launch.json  Dev-server config for the Claude desktop app (port 3100).
.ig-scratch/         Git-ignored scratch files for social graphics. Not the app.
src/
  app/               Pages and routes (Next.js App Router)
    (site)/          Public site, wrapped in header, footer, PathProvider, chat
    (auth)/login/    Sign in and sign up
    (admin)/admin/   Password-protected dashboard
    api/             chat, contact, cron/weekly-email, email/unsubscribe
    offline/         Page shown when offline
    manifest.ts, icons/, apple-icon.tsx   Installable-app files
    sitemap.ts, robots.ts, llms.txt/, search-index.json/   SEO and crawler files
  components/
    shell/           Header, footer, search palette, chat panel, theme settings, install button
    map/             The metro map drawing
    path/            Progress, bookmarks, votes, streaks, celebrations
    market/, ui/, brand/   Pay block, small shared pieces, logo
  lib/               Logic and data access. See section 6.
```

Parentheses in a folder name, like `(site)`, are **route groups**: they organise code and share a layout but do **not** appear in the URL. `src/app/(site)/roles/page.tsx` is served at `/roles`.

---

## 5. The content model

Everything is keyed by a **slug**: lowercase words with hyphens, such as `frontend-engineer` or `how-the-internet-works`. The slug is the file name without `.md`, and it appears in URLs, in the database and in cross-references. **Never rename a slug casually.** Users' saved progress in the database stores skill and role slugs, and renaming breaks it.

| File | Holds | Key rules |
|---|---|---|
| `catalog.yaml` | The master list of domains, roles, skills | Every role and skill must be listed here, with a domain that exists. Role entries have a `wave` and a one-line `oneLiner` |
| `roles/<slug>.md` | One role: summary, day in the life, 4 stages, must/should/nice skills, tools, interview, AI impact, market notes, adjacent roles | All stage and skill slugs must exist in the catalog |
| `skills/<slug>.md` | One skill: brief, level, hours, prereqs, learning checklist, resources | At least one resource. An official one is expected (a warning, not an error, if missing). No duplicate URLs |
| `blog/<slug>.md` | An article. Front matter: title, date, tag, excerpt, readTime | |
| `compass.yaml` | Quiz questions, and weights linking answers to roles | Every role named must exist. A role no answer reaches triggers a warning |
| `market.yaml` | Pay data. `india` and `us` source tables, then a `roles` map linking each role to a source row | Every number is copied from a public source with a date. Never estimate. `exact: false` marks a nearest-title match |
| `skill-aliases.yaml` | Words the job post checker looks for | A leading `=` makes an alias case-sensitive |
| `glossary.yaml`, `faq.yaml` | Glossary terms, FAQ groups | |
| `changelog.yaml` | Release notes, shown only in the admin dashboard | |
| `snippets.json` | Short code samples shown on skill pages | Matched to a skill by its slug |

How "live" works: `getNetwork()` in `content.ts` compares the catalog against the files that exist. A catalog entry with no file still shows on the map, marked "being mapped". Adding the file makes it live. That is how the whole map could be drawn before every page was written.

---

## 6. The code you will work in most

### `src/lib`

| File | Job | Runs where |
|---|---|---|
| `content.ts` | Loads and validates every content file. All `get...()` functions are cached. The Zod schemas live here, so this file defines what valid content is | Server only |
| `path.ts`, `gap.ts`, `compass.ts`, `milestones.ts`, `money.ts`, `lines.ts` | Pure logic: progress maths, job-post matching, quiz scoring, milestones, currency formatting, map line styles | Anywhere |
| `supabase.ts` | Browser Supabase client, and the `useUser()` hook (undefined while loading, null when signed out) | Browser only |
| `admin.ts` | Admin password check, signed cookie, rate limiting, and `adminDb()`, a client that **bypasses RLS** | Server only |
| `gemini.ts` | Calls the Gemini REST API: embeddings, one-shot generate, streaming | Server and scripts |
| `rag.ts`, `rag-prompt.ts` | CJ AI: exact role/skill lookups, the system prompt, source formatting | Server (`rag-prompt.ts` is script-safe) |
| `site.ts` | Site name, URL, contact email, analytics ID, theme list and default | Anywhere |
| `markdown.ts` | Markdown to HTML (`marked`) and code highlighting (`shiki`) | Server |
| `public-path.ts`, `email/weekly.ts` | Public path pages; the weekly email builder | Server |
| `app-icon.tsx`, `og.tsx` | Drawing the app icon and social share images | Server |

**The server/client boundary matters.** Files that start with `import "server-only"` (like `content.ts` and `admin.ts`) will cause a build error if a client component imports them. That is the safety net that stops secrets and file-system code leaking to the browser. Files that must run in both places (`path.ts`, `gap.ts`) deliberately avoid server-only imports, and a comment at the top says so. Keep it that way.

How data crosses the boundary: a server component (for example `(site)/layout.tsx`) calls `getPathIndex()` and passes a small, plain object down as props to client components. The client never reads `content/` itself.

### Where each feature lives

| Feature | Pages | Components and logic | Data |
|---|---|---|---|
| Metro map | `(site)/page.tsx`, `domains/` | `components/map/*`, `lib/lines.ts` | `catalog.yaml` |
| Role and skill pages | `(site)/roles/[slug]`, `skills/[slug]` | `components/ui/*`, `Station`, `Trail` | `roles/*.md`, `skills/*.md` |
| Compare roles | `(site)/roles/compare` | `Compare.tsx`, `getCompareRoles()` | role files |
| Compass quiz | `(site)/compass` | `Compass.tsx`, `lib/compass.ts` | `compass.yaml` |
| Job post checker | `(site)/gap` | `GapAnalyser.tsx`, `lib/gap.ts` | `skill-aliases.yaml`, catalog |
| Pay by role | `(site)/market` | `MarketTable.tsx`, `components/market/PayBlock.tsx` | `market.yaml` |
| My Path | `(site)/me` | `components/path/*`, `PathProvider` | tables `user_paths`, `user_skill_status`, `user_progress_events` |
| Bookmarks, votes, suggestions | skill pages | `SaveResource`, `ResourceVotes`, `SuggestResource` | `user_saved_resources`, `resource_votes`, `resource_suggestions` |
| Public path page | `(site)/u/[handle]` | `lib/public-path.ts` | `get_public_path()` SQL function |
| CJ AI | chat panel on every page | `shell/ChatPanel.tsx`, `api/chat/route.ts`, `lib/rag.ts` | `doc_chunks` |
| Themes | settings sheet | `shell/UIProvider.tsx`, `ThemeSettings.tsx`, `globals.css` | `profiles.theme`, `profiles.mode`, `localStorage` |
| Search palette | any page | `shell/CommandPalette.tsx`, `search-index.json/` | built from content |
| Installable app | footer | `ServiceWorker.tsx`, `InstallApp.tsx`, `public/sw.js` | see `docs/learn/pwa.md` |
| Contact form | FAQ | `faq/ContactForm.tsx`, `api/contact/route.ts` | `contact_messages` |
| Admin | `/admin` | `(admin)/admin/*`, `lib/admin.ts` | SQL functions `admin_stats`, `admin_users` |
| Weekly email | none | `api/cron/weekly-email`, `lib/email/weekly.ts` | `weekly_email_batch()` |

---

## 7. Accounts, keys and security: the rules

There are **three different levels of database access**. Mixing them up is the most dangerous mistake in this codebase.

| Access | Key | Used by | Can it bypass RLS? |
|---|---|---|---|
| **The visitor** | `anon` key plus their own login token | Browser code (`PathProvider`, votes, saving) | No. RLS limits them to their own rows |
| **The visitor, via the server** | `anon` key plus the visitor's token passed as a bearer header | `/api/chat` (to check who is asking and count their messages) | No |
| **The server itself** | `SUPABASE_SERVICE_ROLE_KEY` | `adminDb()`, cron route, contact route, indexing scripts | **Yes. Full access** |

Rules to follow:

1. **Every new table gets row-level security enabled in the same migration.** A table without RLS is readable by anyone with the public key.
2. Policies use `(select auth.uid()) = user_id`, wrapped in a `select` for performance. Copy the pattern in `20261007000600_my_path.sql`.
3. SQL functions that run with elevated rights use `security definer` and `set search_path = ''`, as `handle_new_user()` does. Functions meant only for the server get `revoke all ... from public, anon, authenticated` and `grant execute ... to service_role`, as in `20261012000000_contact_and_admin.sql`.
4. Text columns that hold slugs carry a check such as `role_slug ~ '^[a-z0-9-]{2,60}$'`.
5. **Never import `admin.ts` or use the service role key in a client component.** Never put it in a `NEXT_PUBLIC_` variable.
6. **Private pages must never be cached by the service worker:** `/me`, `/admin`, `/login`, `/u/`, `/email/`, `/api/*`. If you add a private route, add it to the never-cache list in `public/sw.js` and to `PRIVATE` in `src/app/robots.ts`.
7. User-facing inputs are validated and length-limited server-side (see `api/contact/route.ts`: honeypot field, hashed-IP rate limit, trimmed lengths). Copy that approach for new forms.
8. The profile row is created by a **database trigger** when someone signs up (`handle_new_user`), not by browser code. Do not add client code that inserts into `profiles` at sign-up.
9. Auth: email and password, plus Google and GitHub through Supabase. The login form only shows a provider if Supabase has it enabled.

---

## 8. How CJ AI works (so you can change it safely)

1. **Indexing** (`npm run rag:ingest`, also run by CI when content reaches `main`): `scripts/rag/chunks.ts` turns roles, skills, blog posts, glossary, FAQ and pay data into passages. Each passage starts with its page and section so it makes sense alone. Each gets a content hash. `ingest.ts` embeds only new or changed passages with Gemini and stores them in `doc_chunks`. Passages for deleted content are removed.
2. **Asking** (`POST /api/chat`): requires a signed-in user. It validates input (max 12 turns, 2000 characters), checks and increments the user's daily count (`consume_chat_message`, default 40), rewrites follow-up questions into a standalone search query, looks for roles and skills named in the question, then runs a hybrid vector and keyword search (`match_doc_chunks`). Anything under the similarity threshold (`CJ_MIN_SIMILARITY`, default 0.55) is dropped. The answer streams back as server-sent events: `sources`, `delta`, `done`, `error`.
3. **Grounding:** the system prompt in `rag-prompt.ts` tells the model to answer only from the supplied passages and cite them. Do not weaken this. It is the product promise ("answers only from Code Journey's own pages").
4. **Quality gate:** `npm run rag:eval` checks that the right page comes back in the top results for generated questions. CI fails the index job if the hit rate is under 0.85.

If you change content structure (new front-matter fields, a new content type), update `scripts/rag/chunks.ts` too, or the new material will not be searchable.

---

## 9. Conventions

**Branches.** Current practice: all work happens on `Dev`; the owner merges to `main`, which is the release branch. Ask the owner before introducing a different flow.

**Commit messages.** Start with one prefix, then a short subject in plain words that says what changed *for the person using the site*:

| Prefix | For |
|---|---|
| `feat:` | A new feature or page |
| `fix:` | A bug fix, saying what was broken and what changed |
| `ui:` | A visual or layout change that is neither a feature nor a fix |
| `content:` | Roles, skills, resources, guides, glossary, pay |
| `refactor:` | Code reorganised with no visible change |

**Writing style (this applies to all copy, content, comments and docs):**

- **No em dashes.** Use a spaced hyphen ( - ) instead. This is a project rule. Search new text for the long dash before committing.
- Plain, friendly words. Explain a term the first time it appears.
- **Every number has a source.** No invented salaries, hours, or statistics. Pay figures go in `market.yaml` with a link and a date.
- **Official documentation first**, then the best free material. Paid resources only if clearly worth it, and always labelled.
- Dates in content are ISO (`2026-10-09`). Update a skill's `checked` date when you verify its links.

**Code style:**

- TypeScript strict mode. Use the `@/` alias for `src/` imports.
- Zod defines the content schemas. Add new fields there first.
- Comments explain *why*, not what. Look at the header comment on any script in `scripts/` for the house style: one short paragraph saying what it does and how to run it.
- Accessibility is a requirement, not polish. The header has a skip link, controls have `aria-label`s, and tap targets are at least 44px on touch screens. Match that.
- Pages are mobile-first. Check every change at phone width as well as desktop.
- Theme colours come from CSS variables (`bg-canvas`, `text-ink`, `text-muted`, and so on) so all four themes and dark mode work. Do not hard-code hex colours in components.

**Content quality bar.** A skill page needs a one-sentence brief a beginner understands, a checklist of topics, and resources including an official one. A role page needs a real project and a testable "done when" for every stage.

---

## 10. Recipes

### Add a skill

1. Add a line to `skills:` in `content/catalog.yaml`: `slug`, `title`, `domain`.
2. Create `content/skills/<slug>.md` with the same front-matter fields as an existing skill (copy `git.md`). Required: `title`, `domain`, `level` (beginner, intermediate or advanced), `brief`, `learn`, `resources` (at least one), `checked`. Optional: `hours`, `prereqs`.
3. Add it to the relevant role stages in `content/roles/*.md` (stage `skills` and the `must`/`should`/`nice` lists).
4. Add search words in `content/skill-aliases.yaml` so the job post checker finds it.
5. Run `npm run content:check`.
6. Optionally add a code sample to `content/snippets.json`.

### Add a role

1. Add to `roles:` in `catalog.yaml` with `slug`, `title`, `domain`, `wave` and `oneLiner`. If any value contains a comma, **wrap it in quotes** (an unquoted comma silently splits the entry into extra keys; the checker catches this).
2. Create `content/roles/<slug>.md`, copying `frontend-engineer.md`. Every skill slug in it must already exist in the catalog.
3. Add a line under `roles:` in `content/market.yaml` linking the role to a pay source row (or an empty `{}` if there is no source, as `developer-advocate` has).
4. Add the role to some answers in `content/compass.yaml`, or it can never be suggested (the checker warns).
5. Run `npm run content:check`. Compare pages for the new role are generated automatically.

### Add or edit a blog post

Create `content/blog/<slug>.md` with front matter `title`, `date`, `tag`, `excerpt`, `readTime`, then a Markdown body using `##` headings.

### Update pay data

Edit `content/market.yaml`. Copy the number from the public source, set its `updated` date and URL, and bump the top-level `checked` date. Never round or estimate.

### Add a quiz question

Add to `questions:` in `content/compass.yaml`. Each option needs a `label`, a `why` that completes the sentence "Because you...", and `weights` of 1 to 3 per role. Run the checker.

### Add a database change

1. Create `supabase/migrations/<timestamp>_<short_name>.sql`.
2. **Timestamp rule:** the latest migration is `20261014000000_profile_leetcode.sql`. The names are *ahead of the real calendar date*. If you run `supabase migration new`, it stamps today's date, which sorts **before** the existing files, and `supabase db push` will refuse it as out of order. Rename your file so its timestamp is greater than the highest existing one (for example `20261015000000_...`), and keep counting up.
3. Make it re-runnable (`create table if not exists`, `add column if not exists`, `create or replace function`), as the existing files do.
4. Enable RLS and add policies (section 7).
5. Test locally: `supabase db reset` rebuilds from all migrations.
6. The owner applies it to production with `supabase db push`. Do not run that yourself without asking.
7. Never edit a migration that has already been applied. Add a new one.

### Add an API route

Create `src/app/api/<name>/route.ts` exporting `GET` or `POST`. Validate and length-limit all input, return JSON with a clear status code, and use `adminDb()` only if you truly need to bypass RLS. If it reads `content/` at runtime, add it to `outputFileTracingIncludes` in `next.config.ts` (as `/api/chat` is), or it will not find the files on Vercel.

### Add a theme

1. Add an entry to `THEMES` in `src/lib/site.ts` (id, name, four colours).
2. Add `[data-cj="<id>"]`, its dark-mode block, and its `:not([data-mode])` system-dark block in `src/app/globals.css`, matching the existing four.
3. Add the id to the check constraint on `profiles.theme` with a **new migration** (the current constraint lists the four ids). Without this, saving the theme for a signed-in user fails.
4. The pre-paint script reads `THEMES`, so it needs no edit.

### Add a page

Create a folder under `src/app/(site)/` with a `page.tsx`. For pages built from content, export `generateStaticParams` (see `roles/[slug]/page.tsx`) so they are generated at build time. Add the route to `sitemap.ts` if it should be indexed, and to the header or footer if it should be linked. If it shows personal data, treat it as private (section 7, rule 6).

### Ship a service worker change

Bump `VERSION` in `public/sw.js`. Never let `/sw.js` be cached (`next.config.ts` already sets this). Read `docs/learn/pwa.md` first.

### Write a changelog entry

Add to the top of `content/changelog.yaml` with a `date`, a `version` (current pattern `2.0.0-beta.N`, counting up), a `title`, and `changes` each with a `type` (`added`, `changed`, `fixed`, `removed`) and `text` written for visitors, not developers. It is shown in the admin dashboard only.

### Refresh CJ AI after content changes

Merging content to `main` triggers `cj-ai-index.yml` automatically. To do it by hand: `npm run rag:ingest`, then `npm run rag:eval`.

---

## 11. Automation

| What | When | Why you care |
|---|---|---|
| `link-check.yml` | Pull requests touching `content/`, Mondays 04:00 UTC, manual | Runs the content check and checks every external URL. A dead link fails it. Sites that block bots (401, 403, 429) are warnings only |
| `cj-ai-index.yml` | Push to `main` touching `content/`, `scripts/rag/` or `gemini.ts`; manual | Re-indexes changed passages and fails if retrieval quality drops below 0.85 |
| Vercel cron | Daily 03:30 UTC | Sends one group of weekly progress emails |
| `prebuild` | Every `npm run build` | The content check. It is why a bad content edit cannot be deployed |

---

## 12. Gotchas

These cost people time. Read them once.

1. **This is Next.js 16, not the Next.js most tutorials show.** APIs and conventions have changed. For example, page props use typed helpers like `PageProps<"/skills/[slug]">`, and `params` is a promise you must `await`. Before using a Next.js feature, read the matching guide in `node_modules/next/dist/docs/` (the package's own `AGENTS.md` says the same). Do not rely on memory or old blog posts.
2. **Scripts run TypeScript directly with `node`.** That needs Node 24. Imports inside `scripts/` use explicit `.ts` extensions, and the scripts cannot use the `@/` alias.
3. **Unquoted commas in `catalog.yaml`** break entries silently. Quote any value containing a comma.
4. **Slugs are permanent.** Saved user progress references them.
5. **Dated-ahead migrations** (section 10, "Add a database change").
6. **The service worker only runs in production builds.** To test offline or install, use `npm run build && npm start`, not `npm run dev`.
7. **Gemini model limits.** `gemini-2.5-*` is closed to new keys. 3.x models need a low thinking level or return 503. The free embedding tier has a daily cap. Details are in comments at the top of `gemini.ts` and `scripts/rag/ingest.ts`.
8. **Content reads happen at build time for static pages.** After changing content you must rebuild or redeploy for pages to update. Runtime routes (`/api/chat`, the cron route) read `content/` from disk, which is why they are listed in `outputFileTracingIncludes`.
9. **`notes` and `tasks` tables** come from the original app's baseline migration. Nothing in the current code appeared to use them when this was written, but check before removing.
10. **`npm run lint` reports errors from `.ig-scratch/`**, a git-ignored scratch folder. They are not from the app.
11. **`next dev` generates `AGENTS.md` and `CLAUDE.md`** in the repo root if they are missing.
12. **No test framework.** The safety net is the content check, lint, typecheck, build, and `rag:eval`. If you add logic to the pure files (`path.ts`, `gap.ts`, `compass.ts`, `milestones.ts`), they are written to be testable from plain scripts.
13. **`VITE_` environment names** still work for Supabase for historical reasons. Use `NEXT_PUBLIC_` in anything new.

---

## 13. Your first day

1. Follow `docs/developer-setup.md` to Level 1 and open the site.
2. Click through: home map, a role, a skill, Compass, the job post checker. Notice that none of it touches a database.
3. Open `content/roles/frontend-engineer.md` and `src/app/(site)/roles/[slug]/page.tsx` side by side. See how the file's fields appear on the page.
4. Read `src/lib/content.ts` top to bottom (about 370 lines). It is the spine of the app.
5. Make a harmless content edit, break it on purpose (use a skill slug that does not exist), and run `npm run content:check` to see the error.
6. Set up Level 2 locally, create a test account, mark a skill done, and watch the row appear in Supabase Studio at http://127.0.0.1:54323. Then read `PathProvider.tsx`.
7. Read `docs/learn/pwa.md` if you will touch the shell, caching or install flow.

---

## 14. Who to ask and what is still open

- The project owner approves database pushes to production, merges to `main`, and holds the production keys.
- **Open item:** CJ AI's similarity threshold (`CJ_MIN_SIMILARITY`) is meant to be tuned from `npm run rag:eval` results once the Gemini embedding quota allows a full evaluation. Check with the owner whether that has been done.
- **Documentation gap:** there is no `.env.example` file in the repo. Adding one (names only, no values) would remove the guesswork in `docs/developer-setup.md` section 4.

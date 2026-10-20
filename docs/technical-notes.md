# Code Journey: Technical Notes

A quick reference for the owner. Plain-language product description is in `docs/user-guide.md`. To run the project, see `docs/developer-setup.md`. For new developers, see `docs/developer-guide.md`, which covers the same ground in more depth. Facts here were read from the code on 2026-10-09 (version 2.0.0, `Dev` branch).

---

## 1. The markdown files, sorted

130 tracked `.md` files. Only two are documentation. The other 128 are the site's content, which the app reads and displays.

| Group | Count | Where | What it is |
|---|---|---|---|
| **Project docs** | 1 | `README.md` | Product pitch, feature list, principles, stack table, commit conventions |
| **Learning guide** | 1 | `docs/learn/pwa.md` | How the installable app (PWA) works: manifest, icons, service worker, testing, common mistakes |
| **Role pages** | 26 | `content/roles/*.md` | One per career. Front matter holds the whole route (stages, skills, interview, AI impact, market notes, adjacent roles) |
| **Skill pages** | 99 | `content/skills/*.md` | One per skill. Front matter holds the brief, learning checklist, prereqs and resources |
| **Blog posts** | 13 | `content/blog/*.md` | Short articles with front matter (title, date, tag, excerpt, readTime) and a markdown body |

The role and skill files are almost entirely front matter (data), not prose.

### The non-markdown content files (also important)

| File | Purpose |
|---|---|
| `content/catalog.yaml` | Master list of 10 domains (lines), roles and skills. The map is built from this. Items with no `.md` yet show as "being mapped" |
| `content/compass.yaml` | Quiz questions, and which roles each answer adds weight to |
| `content/market.yaml` | Pay data (PayScale India, US BLS). Each number copied from a public source with a date |
| `content/skill-aliases.yaml` | Names the job post checker recognises for each skill. A leading `=` means case-sensitive |
| `content/glossary.yaml`, `faq.yaml` | Glossary terms, FAQ groups |
| `content/changelog.yaml` | Release notes (versions 2.0.0-beta.x). Shown only in the admin dashboard |
| `content/snippets.json` | Short code samples, matched to a skill page by slug |

---

## 2. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | `src/app`, route groups `(site)`, `(auth)`, `(admin)` |
| UI | **React 19**, **TypeScript 6** | Strict, path alias `@/` |
| Styling | **Tailwind CSS 4** via PostCSS | Themes are CSS variables set by `data-cj` and `data-mode` on `<html>` (see `globals.css`) |
| Icons and fonts | `lucide-react`; Familjen Grotesk, IBM Plex Sans and Mono | Loaded with `next/font` |
| Content parsing | `gray-matter` (front matter), `yaml`, `marked` (markdown to HTML), `shiki` (code highlighting) | |
| Validation | **Zod 4** | Schemas for every content type live in `src/lib/content.ts` |
| Backend | **Supabase**: Postgres, Auth, Row-Level Security, pgvector | Client: `@supabase/supabase-js`. Email/password plus Google and GitHub OAuth |
| AI | **Google Gemini** over plain REST (`src/lib/gemini.ts`) | Chat model `gemini-3.8-flash`, fallback `gemini-flash-lite-latest`, embeddings `gemini-embedding-2` at 768 dimensions. All overridable by env vars |
| Email | **Resend** | Weekly progress email |
| Hosting | **Vercel** | One cron job in `vercel.json` |
| CI | **GitHub Actions** | Two workflows (below) |
| Node | 24 in CI | Scripts run TypeScript directly with `node` |

No test framework is installed. Quality gates are `lint`, `typecheck`, the content checker and the RAG evaluation.

---

## 3. Code layout

About 10,750 lines of TypeScript in `src/`.

```
content/                  all written content (see section 1)
docs/                     user-guide.md, technical-notes.md, learn/pwa.md
public/sw.js              service worker (offline support)
scripts/
  check-content.ts        cross-checks references between content files (runs before every build)
  check-links.ts          checks every external resource URL
  rag/                    ingest.ts, chunks.ts, eval.ts, ask.ts (CJ AI search index tooling)
supabase/
  config.toml
  migrations/             18 SQL files, 2026-10-05 onward
src/
  app/
    (site)/               public pages: home, roles, skills, domains, resources, compass,
                          gap, market, glossary, blog, faq, about, me, u/[handle], email, legal
    (auth)/login          sign in / sign up / OAuth callback
    (admin)/admin         password-protected dashboard
    api/                  chat, contact, cron/weekly-email, email/unsubscribe
    offline/              offline page and saved-pages list
    manifest.ts, icons/, apple-icon.tsx, opengraph-image.tsx, sitemap.ts, robots.ts,
    llms.txt/, search-index.json/    PWA, SEO and crawler endpoints
  components/
    shell/                header, footer, search palette, chat panel, themes, install button, consent
    map/                  the metro map (NetworkMap, Line, RouteStages, NetworkList)
    path/                 My Path state (PathProvider), save/progress/votes/suggest, streak, milestones
    market/, ui/, brand/  pay block, shared bits, logo
  lib/
    content.ts            loads and validates all content (server-only, cached)
    path.ts, gap.ts, compass.ts, milestones.ts   pure logic (browser-safe)
    rag.ts, rag-prompt.ts, gemini.ts             CJ AI
    supabase.ts, admin.ts, public-path.ts, email/weekly.ts
    app-icon.tsx, og.tsx, money.ts, lines.ts, site.ts
```

### Scripts (`package.json`)

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (the Claude launch config uses port 3100) |
| `npm run build` | Runs `prebuild` (content check) then `next build` |
| `npm run content:check` | Reference check across content files |
| `npm run links:check` | External link check |
| `npm run lint`, `npm run typecheck` | ESLint; `next typegen` then `tsc --noEmit` |
| `npm run rag:ingest` / `rag:eval` / `rag:ask` | Build, test and try the CJ AI index |

---

## 4. How the main parts work

### Content pipeline
Markdown and YAML in `content/` are read from disk at build time by `src/lib/content.ts`, validated with Zod, and cached. A bad file fails the build. `check-content.ts` adds checks Zod cannot do: unknown skill or role slugs, bad prereqs, duplicate URLs, files missing from the catalog, and unquoted commas in catalog entries. Adding a role or skill means: add it to `catalog.yaml`, add the `.md` file, and run the checker.

### My Path (progress tracking)
`PathProvider` is a client context holding the signed-in user, saved route and per-skill status (`learning` or `done`). Maths for percentages, current stage, next stations and hours left is in `lib/path.ts`. Data lives in `user_paths`, `user_skill_status` and `user_progress_events`. Streaks (`my_streak`, `streak_weeks`) and milestones are computed in SQL and `lib/milestones.ts`. The public page `/u/[handle]` is opt-in and `noindex`.

### Compass, Compare and the job post checker
- **Compass:** weights from `compass.yaml`, ranked as score divided by the square root of the maximum possible.
- **Compare:** `/roles/compare/[pair]`, built from role data.
- **Job post checker (`/gap`):** runs fully in the browser (no AI, no upload). It matches phrases from `skill-aliases.yaml` plus catalog titles with whole-word matching, then compares with the route.

### CJ AI (retrieval-augmented chat)
1. `scripts/rag/ingest.ts` splits `content/` into passages, embeds only the new or changed ones (hash compare) with Gemini, and stores them in `doc_chunks` (pgvector plus a weighted text-search column).
2. `POST /api/chat` requires a Supabase bearer token. It rewrites follow-ups into a standalone query, finds exact role or skill mentions (`lib/rag.ts`), runs hybrid search (`match_doc_chunks`, with keyword fallbacks), and drops anything below `CJ_MIN_SIMILARITY` (default 0.55).
3. It streams a cited answer as server-sent events (`sources`, `delta`, `done`, `error`). Limits: 12 turns, 2000 characters, 40 messages a day per user (`consume_chat_message`).
4. Thumbs feedback goes to `chat_feedback`; usage to `chat_usage`.

### Weekly email
`vercel.json` calls `/api/cron/weekly-email` daily at 03:30 UTC. Users are split into seven groups, one group per day, so each opted-in user gets one email a week. Protected by `CRON_SECRET`. Capped at 100 a day by default (Resend free plan). Supports `?group=` and `?dry=1` for manual runs. Unsubscribe is token-based (`unsubscribe_weekly_email`).

### Admin dashboard
`/admin` uses a separate password check (`lib/admin.ts`) with failed-login tracking (`admin_login_failures`). Server actions manage suggestions and contact messages. It reads stats through SQL functions (`admin_stats`, `admin_users`) and shows the changelog.

### PWA
Fully described in `docs/learn/pwa.md`. Key rule: bump `VERSION` in `public/sw.js` to ship a service worker change, and keep `/sw.js` served with `no-cache`. Private paths (`/me`, `/admin`, `/login`, `/u/`, `/email/`, `/api/*`) are never cached.

### Security and headers
`next.config.ts` sets `nosniff`, a strict referrer policy, `SAMEORIGIN` framing and a deny-all `Permissions-Policy` for camera, microphone and location. It also holds about 15 legacy redirects (`/tracks`, `/roadmap`, `/profile`, and so on). Row-Level Security protects user tables. `/api/chat` and the cron route are explicitly traced to bundle `content/**`, because they read it from disk at runtime.

Analytics are Google Analytics 4 with Consent Mode (`components/shell/Consent.tsx`): ad storage is always denied; analytics default to denied for EEA/UK/CH and granted elsewhere, and the choice is stored in `localStorage` as `cj-consent`.

### SEO and crawlers
Per-page Open Graph images (roles, skills, public paths), `sitemap.ts`, `robots.ts` (search and AI crawlers allowed), JSON-LD, `/llms.txt` and `/search-index.json`.

---

## 5. Database (Supabase)

18 migrations, applied in filename order. Tables: `profiles`, `user_paths`, `user_skill_status`, `user_progress_events`, `user_saved_resources`, `resource_votes`, `resource_suggestions`, `doc_chunks`, `chat_usage`, `chat_feedback`, `contact_messages`, `admin_login_failures`, `activity_logs`, plus `notes` and `tasks` from the baseline (they look like leftovers from the old app; worth checking whether anything still uses them).

---

## 6. Automation

| Workflow | Trigger | Does |
|---|---|---|
| `link-check.yml` | Mondays 04:00 UTC, pull requests touching `content/`, manual | Content reference check, then external link check. A failure emails the owner |
| `cj-ai-index.yml` | Push to `main` touching `content/`, `scripts/rag/`, `gemini.ts`; manual | Re-indexes changed passages, then runs retrieval evaluation (fails under a 0.85 hit rate) |

CI secrets needed: `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Environment variables
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the old `VITE_` names still work via `next.config.ts`), `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `GEMINI_API_KEY`, `CRON_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`. Optional: `CJ_DAILY_LIMIT`, `CJ_MIN_SIMILARITY`, `GEMINI_MODEL`, `GEMINI_FAST_MODEL`, `GEMINI_EMBED_MODEL`, `WEEKLY_EMAIL_DAILY_CAP`. The local `.env` is git-ignored.

---

## 7. Conventions

- Work happens on the `Dev` branch. `main` is the release branch.
- Commit prefixes: `feat:`, `fix:`, `ui:`, `content:`, `refactor:`. Subjects are short and describe what changed for the person using the site.
- Copy uses spaced hyphens, never em dashes.
- Every figure needs a public source and a date. No invented numbers.

---

## 8. Things worth knowing or checking

- **Default theme is Tangerine** (`data-cj="tangerine"` in `layout.tsx`).
- **Pending item from earlier notes:** run `npm run rag:eval` once the Gemini embedding quota allows, then set `CJ_MIN_SIMILARITY` from the results. I did not run it, so I can't say where this stands now.
- **`gemini-2.5-*` is closed to new API keys.** The code comments say 3.x models need a low thinking level or they return 503s.
- **`.ig-scratch/`** holds working files for social-media graphics (carousels, a resume template, Lighthouse reports). It is git-ignored and not part of the app.
- **Docs gap closed:** developer setup is now in `docs/developer-setup.md`. Still missing: a `.env.example` file.
- **README says "99 skill pages", "26 career routes"**, and both match the files on disk.

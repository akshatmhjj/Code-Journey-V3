# Developer Setup Guide

How to get Code Journey running on your machine, from a fresh clone to a working site. Read `docs/developer-guide.md` afterwards for how the code is organised and how to work in it.

Everything here was checked against the repo on 2026-10-09 (Next.js 16.3.8, Node 24). Where something could not be checked, it says so.

---

## Pick your setup level

You do not need every service to start. Choose how far to go:

| Level | You get | You need | Time |
|---|---|---|---|
| **1. Content only** | Every public page: map, roles, skills, Compass, job post checker, pay, glossary, blog, FAQ | Node and npm | 5 min |
| **2. Plus accounts** | Sign in, My Path, saved resources, votes, public path page, contact form, admin dashboard | Level 1 plus a Supabase project (local or hosted) | 20 min |
| **3. Plus CJ AI** | The chatbot | Level 2 plus a Gemini API key and a one-time index build | 15 min |
| **4. Plus email** | Weekly progress email | Level 2 plus a Resend key | 10 min |

Level 1 was tested with every key blank: the home page, roles, skills, Compass, job post checker, market, login and FAQ pages all returned 200. The chat endpoint answered `500 "CJ AI is not configured."`, which is the expected behaviour without a Gemini key.

---

## 1. Prerequisites

| Tool | Version | Why |
|---|---|---|
| **Node.js** | 24 (CI uses 24; local was 24.18) | The scripts in `scripts/` are run as `node file.ts`, which needs a Node that can run TypeScript directly. Older versions will fail |
| **npm** | Comes with Node | The repo uses `package-lock.json`. Do not use pnpm or yarn |
| **Git** | Any recent | |
| **Supabase CLI** | Latest (Level 2 only) | Applies the database migrations. `brew install supabase/tap/supabase` on macOS |
| **Docker Desktop** | Latest (only for a *local* Supabase) | The local Supabase stack runs in containers |

There is no `.nvmrc` or `engines` field, so nothing enforces the Node version. Check yours with `node -v`.

---

## 2. Get the code

```bash
git clone https://github.com/akshatmhjj/Code-Journey-V3.git
cd Code-Journey-V3
git switch Dev
```

Day-to-day work happens on the `Dev` branch. `main` is the release branch (see "Branches" in the developer guide).

```bash
npm ci
```

Use `npm ci` rather than `npm install`. It installs exactly what the lockfile says and never rewrites it.

---

## 3. Level 1: run it with no keys

```bash
npm run dev
```

Open <http://localhost:3000>. If port 3000 is taken, Next.js picks another and prints it.

Notes:

- The Claude desktop app launch config (`.claude/launch.json`) starts the same command on port 3100 with auto-port.
- The first visit to each page compiles it, so it feels slow once.
- The service worker (offline support) is **only registered in production builds**. You will not see it in `npm run dev`. See `docs/learn/pwa.md`.
- The first `next dev` run creates `AGENTS.md` and `CLAUDE.md` in the repo root. This is Next.js 16 behaviour, not a project file (see Troubleshooting).

---

## 4. Environment variables

Create a file named `.env` in the project root. It is git-ignored. There is no `.env.example` in the repo, so use this table.

| Variable | Needed for | Where it comes from | Safe in the browser? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Anything using accounts | Supabase project settings, API | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anything using accounts | Supabase project settings, API | Yes (protected by row-level security) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin dashboard, weekly email, CJ AI indexing, contact form | Supabase project settings, API | **No. Server only. Bypasses all security rules** |
| `ADMIN_PASSWORD` | Admin dashboard (`/admin`) | You choose it | No |
| `GEMINI_API_KEY` | CJ AI chat and indexing | Google AI Studio | No |
| `RESEND_API_KEY` | Weekly email | resend.com | No |
| `EMAIL_FROM` | Weekly email sender address | You choose it | No |
| `CRON_SECRET` | Calling the weekly email route | You choose it | No |

Optional tuning (all have defaults):

| Variable | Default | Effect |
|---|---|---|
| `CJ_DAILY_LIMIT` | 40 | CJ AI messages per user per day |
| `CJ_MIN_SIMILARITY` | 0.55 | Minimum match score for a passage to be used |
| `GEMINI_MODEL` | `gemini-3.8-flash` | Chat model |
| `GEMINI_FAST_MODEL` | `gemini-flash-lite-latest` | Fallback model |
| `GEMINI_EMBED_MODEL` | `gemini-embedding-2` | Embedding model (768 dimensions is hardcoded) |
| `WEEKLY_EMAIL_DAILY_CAP` | 100 | Emails sent per day |

Legacy names `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` still work. They exist because the production environment was set up for the old Vite app. Use the `NEXT_PUBLIC_` names in new setups.

**Never commit `.env`, and never put the service role key in a `NEXT_PUBLIC_` variable.** Anything with that prefix is sent to every visitor's browser.

---

## 5. Level 2: set up Supabase

Choose **A (local)** or **B (hosted)**. A is safer for experiments because it cannot touch real users.

### A. Local Supabase (recommended for development)

```bash
supabase start
```

Docker must be running. The first start downloads several images. When it finishes it prints local URLs and keys. Print them again any time with:

```bash
supabase status
```

Put these in `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<the "anon key" from supabase status>
SUPABASE_SERVICE_ROLE_KEY=<the "service_role key" from supabase status>
ADMIN_PASSWORD=<anything you like>
```

`supabase start` applies all 18 migrations in `supabase/migrations/` automatically. To wipe the local database and rebuild it from the migrations:

```bash
supabase db reset
```

Useful local addresses (from `supabase/config.toml`):

| What | Address |
|---|---|
| API | http://127.0.0.1:54321 |
| Database | port 54322 |
| **Studio** (browse tables, edit rows) | http://127.0.0.1:54323 |
| **Inbucket** (catches emails the local stack "sends") | http://127.0.0.1:54324 |

Local sign-in behaviour:

- **Email and password works.** Email confirmation is off locally (`enable_confirmations = false`), so a new account can sign in straight away.
- **Google and GitHub buttons do not appear.** The login form only shows a provider if it is switched on in Supabase, and none are configured in `config.toml`.
- `config.toml` sets the auth `site_url` to `http://127.0.0.1:3000`. If your dev server runs on another port, social sign-in redirects will not match. Email and password is unaffected.
- There is no `supabase/seed.sql`, so the local database starts empty. Create your own test account on the login page.

### B. Hosted Supabase

1. Create a project at supabase.com. The free tier is enough.
2. In the project settings, copy the URL, the anon key and the service role key into `.env`.
3. Link and apply the migrations:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

The migration `20261007000000_cj_ai_rag.sql` enables the `vector` extension itself, so you do not need to switch it on by hand.

**Important for the real production project:** the first migration (`baseline`) was marked as already applied on production with `supabase migration repair --status applied 20261005000000`, because the tables existed before migrations were tracked. On a brand-new project you do not need that. Run `db push` normally.

**Note for AI assistants and teammates:** `supabase db push` against the production project changes live data. The project owner runs those. Do not run it against production without their say-so.

### Turning on Google and GitHub sign-in (hosted only)

Enable each provider in the Supabase dashboard under Authentication, Providers, and add `http://localhost:3000` (and the production URL) to the redirect URLs. The buttons then appear automatically with no code change.

---

## 6. The admin dashboard

1. Set `ADMIN_PASSWORD` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`, and restart the dev server.
2. Open `/admin` and enter the password.

If either variable is missing, the page tells you the dashboard is not set up. Sessions last 7 days, and changing `ADMIN_PASSWORD` signs everyone out. After 8 failed attempts from one network in 15 minutes, further attempts are blocked.

---

## 7. Level 3: CJ AI

CJ AI answers from passages of `content/` that are stored in the database as vectors. You must build that index once.

1. Get a key from Google AI Studio and set `GEMINI_API_KEY` in `.env`.
2. Make sure Level 2 is working (the index lives in the `doc_chunks` table).
3. Build the index:

```bash
npm run rag:ingest
```

Add `-- --dry-run` to preview without calling Gemini:

```bash
npm run rag:ingest -- --dry-run
```

4. Check retrieval quality:

```bash
npm run rag:eval
```

5. Try a question from the terminal, no sign-in needed:

```bash
npm run rag:ask -- "How do I become a data engineer?"
```

6. In the browser, the chat requires a signed-in user.

Things to know:

- **Only changed passages are embedded.** Each passage has a content hash, so re-running ingest after a small edit is cheap. Passages for deleted content are removed.
- **The free embedding tier is limited** (about 1,000 embedding calls a day at the time of writing). The first full build of roughly 900 passages can use most of it. If you see `429` messages, the script waits and retries; if the quota is gone, wait for the reset and run it again.
- **Model names matter.** `gemini-2.5-*` models are closed to new API keys. The code uses 3.x models, which need a low "thinking level" or they return 503 errors. This is already handled in `src/lib/gemini.ts`; do not change the model without reading the comment at the top of that file.
- `rag:eval` and `rag:ask` read the same `.env` through `--env-file-if-exists=.env`.

---

## 8. Level 4: weekly email

1. Set `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`.
2. Test a build **without sending anything**:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" "http://localhost:3000/api/cron/weekly-email?dry=1&group=0"
```

`group` is 0 to 6. Each day of the week handles one group of users, so everyone who opted in gets one email a week. In production, Vercel calls this route daily at 03:30 UTC (`vercel.json`) and supplies the secret itself.

The Resend free plan allows 100 emails a day, which is why `WEEKLY_EMAIL_DAILY_CAP` defaults to 100.

---

## 9. Daily commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Content check, then a production build |
| `npm start` | Serve the production build (use this to test the service worker and offline mode) |
| `npm run content:check` | Check that content files agree with each other. Fast. Run it after every content edit |
| `npm run links:check` | Check every external URL in `content/`. Slow, makes real web requests |
| `npm run lint` | ESLint (see the lint note below) |
| `npm run typecheck` | Generate route types, then run the TypeScript compiler |
| `npm run rag:ingest` / `rag:eval` / `rag:ask` | CJ AI index tools |

Current state on 2026-10-09:

- `content:check` passes: 26 roles, 99 skills, 125 written pages, with 7 warnings that a skill has no official resource (ab-testing, data-storytelling, data-structures-algorithms, deep-learning, interviewing, math-for-ml, working-with-customers). Warnings do not fail the build.
- `typecheck` passes.
- `lint` run on `src/` and `scripts/` passes. Running plain `npm run lint` reports 11 errors, **all inside `.ig-scratch/`**. That folder is git-ignored scratch work (social media graphics) but ESLint does not skip it. Ignore those errors, or add `.ig-scratch/**` to `globalIgnores` in `eslint.config.mjs`.

There is no automated test suite. The checks above, plus the CJ AI evaluation, are the safety net.

---

## 10. Before you push

Run these in order. All should pass:

```bash
npm run content:check
npx eslint src scripts
npm run typecheck
npm run build
```

Then commit with a prefix: `feat:`, `fix:`, `ui:`, `content:` or `refactor:`, followed by a short plain-words subject.

If you changed anything in `content/`, the CI will also check external links on your pull request. If it reaches `main`, CI re-indexes CJ AI.

---

## 11. Deployment (for reference)

The site is hosted on **Vercel** at www.codejourney.space (DNS on Cloudflare).

- Set every variable from section 4 in the Vercel project settings, including `ADMIN_PASSWORD` and `CRON_SECRET`.
- `vercel.json` registers the one cron job. Vercel sends `CRON_SECRET` as a bearer token to it.
- The build runs `npm run build`, which runs the content check first. A broken cross-reference fails the deploy before it goes live.
- GitHub repository secrets needed by the CJ AI index workflow: `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Database changes are applied by a person running `supabase db push`. Deploying the site does not do it.

---

## 12. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `node scripts/...ts` fails with an unknown file extension or syntax error | Your Node is too old. Use Node 24 |
| Build stops at the content check with `error: ...` | A content file references something that does not exist (an unknown skill slug, a missing catalog entry, an unquoted comma in `catalog.yaml`). The message names the file |
| `/api/chat` returns `CJ AI is not configured.` | `GEMINI_API_KEY` is missing. Restart the dev server after editing `.env` |
| Chat says `Sign in to use CJ AI.` | The chat needs a signed-in user. Create an account first |
| Chat finds nothing useful | The index is empty. Run `npm run rag:ingest` |
| `rag:ingest` prints rate-limit messages | Free embedding quota. It retries on its own. If it gives up, wait for the daily reset and rerun |
| Login form shows no Google or GitHub buttons | Expected locally. Those providers must be enabled in a hosted Supabase project |
| Account created but cannot sign in on a hosted project | Email confirmation is probably on there. Check the email, or turn it off in the Supabase dashboard for testing |
| Admin page says it is not set up | `ADMIN_PASSWORD` or `SUPABASE_SERVICE_ROLE_KEY` is missing |
| `supabase start` fails | Docker is not running, or ports 54321 to 54324 are in use |
| `supabase db push` complains about migration order | A new migration file has a timestamp *earlier* than one already applied. See the migration rules in the developer guide |
| Changes to `.env` have no effect | Restart `npm run dev`. Env files are read once at startup |
| Offline mode or install button not showing | The service worker only runs in production. Use `npm run build && npm start` |
| `AGENTS.md` and `CLAUDE.md` appear as untracked files | Next.js 16 generates them when you run `next dev`. They tell AI coding tools to read the docs bundled in `node_modules/next/dist/docs/`. Either commit them or leave them untracked, but be aware they come back if deleted |
| Lint shows errors in `.ig-scratch/` | See section 9. Not part of the app |

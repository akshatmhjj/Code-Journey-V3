# Known gaps and improvements

An honest list of what is weak, stale or missing in Code Journey, with the evidence for each point and a suggested fix. Interviewers often ask "what would you improve?", and a clear, ranked answer is more convincing than a claim that nothing needs work.

Each item says where it was found. Items marked **verified** were checked in the code or migrations. Items marked **from notes** come from the owner's notes or the older docs, and were not re-run.

---

## 1. The short answer, if you are asked for three

1. **Add tests for the things that can break silently**: the streak SQL, the quota, the RLS rules, and the pure logic in `path.ts`, `gap.ts` and `compass.ts`.
2. **Make the AI answers safer to trust**: calibrate the similarity threshold, refund the quota on failure, and check that the citations point at the passages that were given.
3. **Reduce the maintenance cost of the database**: one definition for each function, a list of tables in the docs that matches the schema, and an `.env.example`.

---

## 2. Priority list

Priority reflects risk to users and to the team, then effort. P0 is do first.

| Priority | Item | Area | Effort |
|---|---|---|---|
| P0 | No automated tests of any kind | Quality | Medium |
| P0 | Chat quota is spent before retrieval, and not refunded on failure | AI cost and fairness | Small |
| P0 | Similarity threshold (`CJ_MIN_SIMILARITY`) not calibrated from evaluation data | AI quality | Small |
| P0 | No Content-Security-Policy header | Security | Medium |
| P1 | Citations in answers are not checked against the sources given | AI trust | Small |
| P1 | `get_public_path()` is defined in five migrations | Maintainability | Small |
| P1 | Docs disagree with the code in places (migration count, latest migration, missing table) | Onboarding | Small |
| P1 | No `.env.example` | Onboarding | Small |
| P1 | Lint reports errors from the git-ignored `.ig-scratch/` folder | Developer experience | Tiny |
| P1 | No error alerting, only logs | Operations | Medium |
| P2 | Unused tables (`notes`, `tasks`, `activity_logs`) still in the schema | Clean-up | Small |
| P2 | Admin dashboard uses one shared password, with no record of who acted | Security and audit | Medium |
| P2 | `admin_stats()` hard-codes the limit of 40 instead of reading `CJ_DAILY_LIMIT` | Correctness | Tiny |
| P2 | Streak weeks use UTC, not the person's time zone | Product | Small |
| P2 | Rollback in `PathProvider` can restore a stale state when two writes race | Client state | Small |
| P2 | No formal accessibility audit recorded | Accessibility | Medium |
| P3 | Compare pages are generated for every adjacent pair, which grows quickly | Build time | Small |
| P3 | Chat calls `auth.getUser()` over the network on each message | Latency | Small |

---

## 3. The gaps, one by one

### 3.1 No automated tests (P0, verified)

`package.json` has no test runner. The safety net is the content check, lint, typecheck, the build, the link check and the retrieval evaluation. None of these tests logic.

**Why it matters.** The streak SQL, the milestone and celebration rules, the quota, and the RLS policies can all be wrong without any build failing. Some are subtle: a streak that is off by one week would look fine.

**Fix, in order:**
1. Unit tests with Vitest for `src/lib/path.ts`, `gap.ts`, `compass.ts`, `milestones.ts` and `formatWeeks()`. The notes say these files were written to be testable.
2. Database tests with pgTAP or plain SQL scripts run by `supabase db reset` followed by assertions. Start with the streak function (with known weeks), `consume_chat_message` (the 40th succeeds, the 41st fails), and one cross-user RLS check per table.
3. An end-to-end smoke test with Playwright on a few pages (home, a role, Compass, the job checker).

### 3.2 The chat quota is spent before retrieval (P0, verified)

In `src/app/api/chat/route.ts`, `consume_chat_message` runs at step 3. Retrieval runs at step 4. If retrieval fails, the route returns a 503, and the message has already been counted.

**Fix.** Either move the count after the first successful retrieval, or call a `refund_chat_message()` function in the catch block. The second is simpler and keeps the atomic check.

### 3.3 The similarity threshold is not calibrated (P0, from notes)

The owner's notes say `CJ_MIN_SIMILARITY` should be set from the results of `npm run rag:eval`, and that the evaluation was waiting on the embedding quota. The default is 0.55. The eval script already records the similarity of off-topic questions, so the data exists once the evaluation runs.

**Fix.** Run the evaluation, plot the similarity of on-topic hits against off-topic questions, and choose a value that separates them with a margin. Record the result in the eval report, not only in the notes.

### 3.4 No Content-Security-Policy (P0, verified)

`next.config.ts` sets four headers, but no CSP. The site loads Google Analytics, Google Fonts (through `next/font`, so self-hosted), and uses inline scripts for the theme and consent setup.

**Fix.** Start with a report-only policy, which logs violations without blocking. Allow the Google Analytics domains by name, and use hashes for the two inline scripts. Move to enforcement once the reports are clean.

### 3.5 Citations are not checked (P1, verified)

The system prompt tells the model to cite numbered sources and use only links from the sources. The route does not check either. A model that writes `[7]` when only three sources were given would show a citation that points nowhere.

**Fix.** Parse the citation markers after the answer. Drop any that point to a source that does not exist, and count how often that happens in the feedback data. Optionally, check that each URL in the answer appears in the sources.

### 3.6 The database function is defined five times (P1, verified)

`get_public_path()` is created or replaced in `20261009000000_public_path.sql`, `20261011000000_streaks.sql`, `20261013000000_profile_links.sql`, `20261014000000_profile_leetcode.sql` and `20261020000000_project_showcase.sql`. Each version copies the whole function and adds one field.

**Why it matters.** A reviewer must read five files to know the current definition, and a copy mistake in a later version silently drops a field. `weekly_email_batch` is also defined twice (in `20261010` and again in `20261011`), where the later file drops and recreates it because its return type changed.

**Fix.** Keep one authoritative definition in a new migration when a function changes, and say in its comment which earlier version it replaces. Or keep a `db/functions/` folder with the current source of each function and a check that the migrations match it.

### 3.7 The docs are stale in places (P1, verified)

| Document | Says | The code says |
|---|---|---|
| `docs/technical-notes.md` sections 1, 5 and `docs/developer-guide.md` section 10 | 18 migrations | 19 migrations |
| `docs/developer-guide.md` section 10 | The latest migration is `20261014000000_profile_leetcode.sql` | `20261020000000_project_showcase.sql` is newer |
| `docs/developer-setup.md` section 5 | `supabase start` applies all 18 migrations | 19 migrations |
| `docs/technical-notes.md` section 5 | Lists the tables | Omits `user_projects` (added 19 October) |
| `docs/technical-notes.md` section 3 | About 10,750 lines of TypeScript in `src/` | About 11,700 lines in `src/` today |
| `docs/technical-notes.md` section 4 and `docs/developer-guide.md` section 8 | Chat "drops anything under the similarity threshold" | The threshold only decides whether the top result is confident. Lower-ranked passages are not filtered out, up to seven sources |

**Fix.** Make the table counts and migration counts generated, or at least check them in the link-check workflow. The simplest step is to update the three rows above.

### 3.8 No `.env.example` (P1, from notes)

`docs/developer-setup.md` says the file is missing and recommends adding one with names only. The variable list is in the setup doc and the technical notes, so it can be copied.

**Fix.** Add `.env.example` with every variable from the setup doc, empty values, and a comment for each. Also check that it is listed in `.gitignore` as an exception (the current rule is `.env*.local` and `.env`).

### 3.9 Lint reports errors from a git-ignored folder (P1, from notes)

The developer guide says `npm run lint` reports errors from `.ig-scratch/`. The folder is ignored by Git, but ESLint still reads it.

**Fix.** Add `.ig-scratch/` to the ignore list in `eslint.config.mjs`. This is a one-line change that makes lint meaningful.

### 3.10 Only logs for errors (P1, verified)

Route errors are logged with `console.error`. There is no error tracking service and no alert. A broken `/api/chat` for an hour would be visible only to someone reading the logs.

**Fix.** Add an error tracker (for example Sentry, or Vercel's own tools if they fit), and alert on a rise in 5xx responses from `/api/chat` and on any non-zero `failed` count from the weekly email.

### 3.11 Unused tables (P2, verified)

The baseline migration creates `notes`, `tasks` and `activity_logs`, with policies. A search of `src/` and `scripts/` finds no query against these tables, which matches the developer guide's note that nothing appeared to use them. They take up schema space and suggest features that do not exist.

**Fix.** Search again to confirm, then add a migration that drops them. Keep a note in the decisions file, because the baseline is the record of what existed.

### 3.12 One shared admin password (P2, verified)

Every admin action is attributed to nobody. A rotated password signs everyone out, and there is no second factor.

**Fix.** Move the dashboard to Supabase Auth with an `admin` role in the user's app metadata, checked in the database functions. Log admin reads and actions in an audit table.

### 3.13 A hard-coded limit in the dashboard (P2, verified)

`admin_stats()` counts `messages >= 40` for "limit hits", while the route reads `CJ_DAILY_LIMIT`. If the limit is changed, the dashboard's number becomes wrong.

**Fix.** Pass the limit into the function as a parameter, or store it in a settings table.

### 3.14 Streaks use UTC weeks (P2, verified)

`date_trunc('week', ...)` uses the database's time zone, which is UTC by default. A student in another time zone who studies late on Sunday may see the streak end at a different moment than they expect.

**Fix.** Store a time zone on the profile, and compute weeks in that zone. The change is small: pass the zone into `streak_weeks()`.

### 3.15 Rollback can restore a stale state (P2, verified)

`setStatus` keeps the state it saw before its own change, and restores that copy on failure. If two ticks are sent close together and the first one fails, its rollback restores a state from before both ticks. The second tick then disappears from the screen, even though its write may have succeeded.

**Fix.** Keep a queue of pending writes, and derive the displayed state from the confirmed state plus the queue. A reducer is the usual shape. Until then, a reload restores the true state.

### 3.16 No accessibility audit (P2, verified)

The developer guide makes accessibility a requirement, and the code includes skip links, labels and touch targets. The repo records no audit with a screen reader or an automated scanner.

**Fix.** Run an automated scan (axe) on the main pages in both themes, and test the chat and the sheets with a keyboard and a screen reader.

### 3.17 Compare pages grow quickly (P3, verified)

`getComparePairs()` creates a page for every pair of related roles. The count grows with each role's adjacency list, and each page is generated at build time.

**Fix.** Watch the build time as roles are added, and generate only pairs with real content (for example, at least two shared skills). The count is small today, so this is a future problem.

### 3.18 Network call on every chat message (P3, verified)

`/api/chat` calls `auth.getUser(token)`, which asks Supabase Auth to check the token each time. The token is a signed JWT, so the check could be done locally with the project's public key, saving one round trip per question.

**Fix.** Verify the JWT locally (for example with `jose` and the project's JWKS), keeping the database call for the quota.

---

## 4. Things that are fine, which you might be asked about

These look like gaps at first, but are deliberate:

- **No CMS.** Content in files is a choice (see ADR-02). The cost is that editors need Git.
- **The browser talks to Postgres.** It is safe because of RLS, and the rules are documented (see [07-security-and-privacy.md](07-security-and-privacy.md)).
- **`match_doc_chunks` is callable with the anon key.** The search returns only public passages, and the expensive step, the model call, is behind sign-in and the quota.
- **Chat history comes from the browser.** The sources come from the database, so forged history cannot add outside sources.
- **Analytics only loads on the production domain.** The script checks the hostname, so preview deployments send no data.
- **Ads are never loaded.** Ad storage is always denied in Consent Mode.

---

## 5. A plan for the next month

| Week | Work | Outcome |
|---|---|---|
| 1 | Refund quota on failure. Add `.env.example`. Fix the stale docs rows. Ignore `.ig-scratch` in lint. Drop unused tables | Quick wins, all small |
| 2 | Vitest for the pure logic files. A database test script for the streak, the quota and one RLS check per table | The most fragile logic is covered |
| 3 | Run the retrieval evaluation. Set the threshold from data. Add citation checks | The AI answers are measured and checked |
| 4 | Report-only CSP, then enforce. Error tracking and one alert. A time-zone field for streaks | Safer and observable |

---

## 6. What I checked and ruled out

These were looked for and not found, so they are not on the list:

- **Secrets in the browser bundle.** The only `NEXT_PUBLIC_` variables are the project URL, the anon key and the consent setting. The service-role key is used only in server modules.
- **Client code importing server modules.** The `server-only` markers make this a build error.
- **Unprotected user tables.** Every user table in the migrations enables RLS.
- **A forged progress event.** The event log has no client write policy.
- **Open redirects.** The redirects in `next.config.ts` are fixed paths.
- **Duplicate emails in one run.** The batch is selected by group and the six-day rule, and marked after each send.

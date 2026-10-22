# Interview Q&A bank

About 45 questions an interviewer might ask about Code Journey, with model answers you can say in your own words. Each answer ends with where to look in the code. Read the answer, then open the file and check it yourself, so the detail is really yours.

Sections: [Product](#product) · [Architecture](#architecture) · [Next.js](#nextjs) · [Data and Supabase](#data-and-supabase) · [Security](#security) · [AI and retrieval](#ai-and-retrieval) · [Frontend and UX](#frontend-and-ux) · [Offline and performance](#offline-and-performance) · [Quality and testing](#quality-and-testing) · [Operations](#operations) · [Trade-offs and reflection](#trade-offs-and-reflection)

---

## Product

**1. What problem does Code Journey solve?**
People who want to switch into tech don't know what to learn next, or in what order. Courses are abundant, but nothing says "to become a data analyst, learn these 12 things in this order, and here is the best free place to learn each". Code Journey gives that answer for 26 roles and shows it as a metro map.
*Look at:* `content/roles/data-analyst.md`, `content/catalog.yaml`.

**2. Why a metro map?**
The metaphor fits the data. Domains are lines, roles are destinations, and skills are stations, and routes are naturally sequences with transfer points (shared skills). Non-technical visitors understand "the route to a destination" without any explanation. The map is generated from the catalog, so it works even before every page is written.
*Look at:* `src/components/map/`, `src/lib/lines.ts`.

**3. Why do you not sell courses?**
It keeps the incentive honest. The product is judged on whether its links are the right ones, not on whether the visitor buys something. It also means every resource is an external link that can break, which is why there is a weekly link check.
*Look at:* `.github/workflows/link-check.yml`.

**4. Who is the user, and what does success look like?**
The user is someone at the start of a career change, or a student who wants a plan. Success is a visitor who picks a route, gets to a first project, and comes back to tick off stations. The My Path streak and milestones are the measurable part of that.

**5. How do you make sure the information is trustworthy?**
Every number has a public source and a date (pay data in `market.yaml`). Every skill needs at least one resource, and an official one is expected (a warning if missing). Resource URLs must be unique per skill. The content checker runs before every build, and the link checker runs weekly.
*Look at:* `scripts/check-content.ts`, `scripts/check-links.ts`.

**6. What did you deliberately leave out?**
Accounts are not needed to read. There are no ads and no data sales. Email is opt-in. The job post checker does not use AI and does not upload the text. There are no courses, certificates or job listings.

**7. How would you measure whether it works?**
Today: the admin dashboard shows signups, active learners (learners who ticked a station in the last 7 days), route choices by role, top completed skills, streaks, chat usage, and thumbs up and down on answers. Next: funnel metrics from Compass to a saved route, and whether people return in week two.
*Look at:* `admin_stats()` in `supabase/migrations/20261012000000_contact_and_admin.sql`.

---

## Architecture

**8. Walk me through the architecture in two minutes.**
The site is a Next.js 16 App Router app deployed on Vercel. Public pages are rendered at build time from Markdown and YAML files in `content/`, validated with Zod. The browser also talks directly to Supabase for signed-in users' data, using the public anon key, and row-level security limits each user to their own rows. Three server routes exist: `/api/chat` (the AI, which needs the Gemini key), `/api/contact` (spam protection and a service-role insert), and `/api/cron/weekly-email` (a daily Vercel cron). See [04-system-design.md](04-system-design.md).

**9. Why is most of the site static?**
Almost everything a visitor reads is content that changes only when someone edits a file. Static pages are fast, cheap to serve from a CDN, and cannot be broken by a database outage. Only the things that need per-user data or secrets are dynamic.

**10. Why does the browser talk straight to the database?**
A separate API for "my progress", "my bookmarks" and "my votes" would be a lot of code that does nothing but pass data through. With row-level security, the database itself is the access control, so the browser can use the same client library as anywhere else. The trade-off is that every table needs correct RLS, so the rules are written down and checked in review (see [07-security-and-privacy.md](07-security-and-privacy.md)).
*Look at:* `src/components/path/PathProvider.tsx`.

**11. Where is the boundary between server and client code?**
Files that import `server-only` (for example `content.ts`, `admin.ts`, `rag.ts`) fail the build if a client component imports them. Server components pass small plain objects as props to client components, so the client never reads `content/` or holds a secret. Pure logic files (`path.ts`, `gap.ts`, `compass.ts`, `milestones.ts`) are written to run in both places.
*Look at:* `src/lib/content.ts` (first line), `src/app/(site)/layout.tsx`.

**12. What happens when a visitor opens `/roles/frontend-engineer`?**
At build time, `generateStaticParams` lists every role slug and Next.js renders each page to HTML. At request time, the CDN serves the HTML. The client then hydrates, and if the visitor is signed in, the PathProvider loads their saved route and statuses. The page itself does not query the database.
*Look at:* `src/app/(site)/roles/[slug]/page.tsx`.

**13. How does the app behave when Supabase is down?**
Everything public still works, because it is static. Sign-in, progress and CJ AI fail gracefully: the PathProvider rolls back optimistic changes when a write fails, and CJ AI returns a clear "unavailable" message. The offline cache keeps pages the visitor has already seen.

**14. Why Vercel?**
The app is Next.js, Vercel builds it natively, and it supports the cron jobs in `vercel.json` and the environment variables that the app needs. The trade-off is platform coupling; the code is standard Next.js, so moving is possible but not free.

---

## Next.js

**15. Which version, and what is special about it?**
Next.js 16 with the App Router, React 19 and TypeScript 6. The project's own `AGENTS.md` warns that this version has breaking changes, so developers must read the guide in `node_modules/next/dist/docs/` rather than rely on memory. An example: page `params` is a promise and must be awaited.
*Look at:* `AGENTS.md`, `src/app/(site)/skills/[slug]/page.tsx`.

**16. What are route groups, and why use them?**
Folders in parentheses, such as `(site)`, `(auth)` and `(admin)`, group routes that share a layout without changing the URL. The public site gets the header, footer, command palette, chat panel and PathProvider. The login and admin pages get their own layouts.
*Look at:* `src/app/(site)/layout.tsx`, `src/app/(admin)/admin/layout.tsx`.

**17. Why is `/api/chat` a route and not a server action?**
It streams. The route returns a `ReadableStream` of server-sent events, which the client reads with `fetch` and a reader. Server actions are for form-style mutations. Streaming a long answer token by token needs a route that returns a stream.
*Look at:* `src/app/api/chat/route.ts`, `readEvents()` in `src/components/shell/ChatPanel.tsx`.

**18. How do you ensure a content typo does not reach production?**
Three layers. Zod validates the shape of every file when it is loaded, so a missing field fails the build. `check-content.ts` checks references across files (unknown skills, prerequisites, adjacent roles, duplicate URLs, catalog mismatches), and it runs as `prebuild`. The CI link check finds dead URLs weekly.
*Look at:* `src/lib/content.ts` (schemas), `scripts/check-content.ts`.

**19. What is `generateStaticParams` and where do you use it?**
It tells Next.js which dynamic route segments to render at build time. For `/roles/[slug]`, `/skills/[slug]`, `/glossary/[slug]`, `/blog/[slug]` and compare pairs, it returns one entry per content file. Pages whose data is per-user (My Path, the public path page) are not static.

**20. How does the metadata for social sharing work?**
Each role, skill and public path has an `opengraph-image.tsx` that renders a share image with `ImageResponse`. Metadata sets canonical URLs, Open Graph and Twitter cards. JSON-LD (`WebSite` and `Organization`) is in the root layout. `sitemap.ts`, `robots.ts`, `/llms.txt` and `/search-index.json` cover crawlers.
*Look at:* `src/lib/og.tsx`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`.

---

## Data and Supabase

**21. Describe your data model.**
Content is not in the database. The database holds user state and operational data. Core tables are `profiles` (one row per user, created by a trigger), `user_paths` (one destination per user), `user_skill_status` (learning or done, per skill), `user_progress_events` (an append-only log that powers streaks), `user_saved_resources`, `resource_votes`, `resource_suggestions`, `user_projects`, `doc_chunks` (the AI index), `chat_usage`, `chat_feedback`, `contact_messages` and `admin_login_failures`. Full table in [05-content-and-data-model.md](05-content-and-data-model.md).

**22. Why keep content in files and not a CMS?**
Content changes through pull requests, so it gets review, history, diffs and the build-time checks for free. There is no admin UI to build, no content API to secure, and no runtime database query for a page. The cost is that non-developers need Git to edit content. For a small team of curators, that trade is worth it.

**23. How do you record progress without a lot of writes?**
A row is written only when a station changes. Progress percentages, stage completion and hours left are computed in the browser from the route data and the statuses. The streak uses the event log, which a trigger writes when a skill becomes done (not when it is edited while already done).
*Look at:* `lib/path.ts`, `supabase/migrations/20261011000000_streaks.sql`.

**24. How does the streak SQL work?**
It collects the distinct Monday dates (UTC weeks) that have at least one event. It picks an anchor: this week if it has activity, otherwise last week, so a streak survives until Sunday ends. It computes `k = (anchor - week) / 7`, which is how many weeks back each week is, and numbers the weeks from 0 in descending order. The streak is the count of weeks where `k` equals the row number. Once there is a gap, `k` is ahead of the row number for every later week, so the count stops at the first gap.
*Look at:* `streak_weeks()` in `supabase/migrations/20261011000000_streaks.sql`.

**25. Why use a trigger to write the progress log?**
The log is written whenever a skill becomes `done`, however the status is changed, so the application code cannot forget it. A trigger on `user_skill_status` writes to `user_progress_events` in the same transaction. A backfill inserted events for progress made before the log existed.

**26. What is `security definer`, and why does your code set `search_path`?**
A `security definer` function runs with its owner's rights, which can bypass RLS. This is useful for functions like `handle_new_user()` or `get_public_path()`. Without a fixed `search_path`, a malicious object in another schema could shadow a table name. The project sets `search_path = ''` or `public` on these functions, and it revokes execute from `public`, `anon` and `authenticated` where a function is for the server only.
*Look at:* `supabase/migrations/20261006000000_profile_on_signup.sql`, `20261012000000_contact_and_admin.sql`.

**27. How do you handle a profile row at sign-up?**
A database trigger, `handle_new_user()`, inserts into `profiles` when a row is added to `auth.users`. The browser never inserts it. The first attempt used a browser insert, which failed under RLS when email confirmation was on, because there was no session yet. Moving it to a trigger fixed that.
*Look at:* `supabase/migrations/20261006000000_profile_on_signup.sql`.

**28. Why use `(select auth.uid()) = user_id` in policies?**
Wrapping `auth.uid()` in a `select` lets Postgres evaluate it once per statement, not once per row. On tables with many rows, that is a real performance difference. The project's policies all use this pattern.
*Look at:* `supabase/migrations/20261006000100_profiles_rls_and_indexes.sql`.

**29. How is the public path page (`/u/handle`) safe if it is public?**
It is opt-in (`path_public`), it is `noindex`, and it is read through `get_public_path()`, a security-definer function that returns only chosen fields. The function never returns the email, the user id or the token. Links to GitHub, LinkedIn and LeetCode are checked by database constraints, so the only URLs that can appear are of those sites.
*Look at:* `supabase/migrations/20261013000000_profile_links.sql`, `20261014000000_profile_leetcode.sql`.

**30. How do you change the schema safely?**
Each change is a new, re-runnable migration (`create ... if not exists`, `add column if not exists`, `create or replace function`). An applied migration is never edited. The owner runs `supabase db push` on production. Migration timestamps must sort after the existing ones (the developer guide explains why this matters).
*Look at:* `docs/developer-guide.md` section 10.

---

## Security

**31. What are the three levels of database access?**
(1) The visitor, using the anon key and their own login token, restricted by RLS. (2) The server acting for the visitor, for example `/api/chat` checks who is asking with the visitor's token. (3) The server acting as itself, using the service-role key, which bypasses RLS and is used only in server code (`adminDb()`, the cron route, the contact route and the indexing scripts). Mixing up levels 1 and 3 is the most dangerous mistake in this codebase.
*Look at:* the table in `docs/developer-guide.md` section 7.

**32. Why is the anon key safe to expose?**
It is designed to be public. It only grants what the `anon` and `authenticated` roles can do, which is what RLS and grants allow. The service-role key is different, and it must never reach the browser. The project keeps it out of any `NEXT_PUBLIC_` variable, and `admin.ts` is `server-only`.

**33. How does the admin dashboard authenticate?**
One shared password, `ADMIN_PASSWORD`, set in the environment. Signing in sets an HttpOnly, SameSite=Strict cookie, scoped to `/admin`, with the expiry and an HMAC signature. The HMAC key is derived from the password, so changing the password signs everyone out. The check uses a constant-time comparison on SHA-256 hashes. Failed attempts are stored per salted IP hash, and after 8 failures in 15 minutes the form refuses. Each failure waits 600 ms.
*Look at:* `src/lib/admin.ts`.

**34. Why hash the IP address?**
Rate limiting needs a stable key, but storing raw IPs is personal data. The code stores a truncated SHA-256 of the service-role key plus the IP. The salt means the hash cannot be reversed by someone who only has the table. Note the consequence: rotating the service-role key resets the rate-limit history.

**35. How do you stop spam on the contact form?**
A honeypot field (`website`) that people never see: bots fill it, and the server pretends the message was sent. Per-IP-hash limit of 5 messages an hour. Length limits on every field. An email format check. The message is stored for the admin inbox, and nothing is emailed automatically.
*Look at:* `src/app/api/contact/route.ts`.

**36. What security headers do you send?**
`X-Content-Type-Options: nosniff`, a strict referrer policy, `X-Frame-Options: SAMEORIGIN`, and a `Permissions-Policy` that turns off camera, microphone and geolocation. The service worker is served with `no-cache` so it can never get stuck. There is no Content-Security-Policy yet, which is listed as a gap.
*Look at:* `next.config.ts`.

**37. How do you handle sign-in with Google and GitHub?**
Supabase Auth handles the OAuth flow. The login form shows a provider only when it is enabled in Supabase. The profile row is created by the same trigger for every provider.

**38. What personal data do you hold, and what can a user do about it?**
Name, email, progress, bookmarks, votes, suggestions, messages to the team, and CJ AI usage counts. Users control their own data, can unsubscribe from email with one click (a token-based link, plus the `List-Unsubscribe` header), and can make their public page private at any time. The privacy page and the consent banner explain the rest.
*Look at:* `src/app/(site)/(legal)/privacy/page.tsx`, `src/components/shell/Consent.tsx`.

---

## AI and retrieval

**39. What is CJ AI?**
A chatbot on every page that answers questions about tech careers, using only Code Journey's pages, and cites them with numbers. It is retrieval-augmented generation (RAG): the system finds relevant passages first, then asks the language model to write the answer from those passages only. Full detail in [06-cj-ai-rag.md](06-cj-ai-rag.md).

**40. Why RAG and not fine-tuning?**
The content changes often. With RAG, an edit to a Markdown file becomes a new answer after re-indexing, with no training run. It also makes citations possible, because each answer points at passages that exist. Fine-tuning would bake facts into weights, where they are hard to update or cite.

**41. How is the index built?**
`scripts/rag/chunks.ts` splits roles, skills, glossary, FAQ, blog posts and pay data into passages, one per section, each starting with its page title and section heading so it makes sense alone. Each passage gets a content hash. `ingest.ts` embeds only new or changed passages, and deletes passages whose source was removed. CI runs it on every push to `main` that touches content.

**42. Why hybrid search?**
Vector search finds passages that mean the same thing, which handles paraphrases like "a job that keeps websites running at 3am". Keyword search finds exact terms, which handles names and jargon. The SQL function combines both with reciprocal rank fusion, `1/(60+rank)` for each list, and returns the top results by combined score. Keyword search also works when the embedding quota is exhausted.
*Look at:* `match_doc_chunks()` in `supabase/migrations/20261007000400_weighted_search.sql`.

**43. What is reciprocal rank fusion and why 60?**
RRF combines ranked lists without needing their scores to be comparable. Each item scores `1/(k + rank)` in each list, and the scores are summed. The constant 60 is the value from the original RRF paper, which reduces the influence of the very top ranks, so one list cannot dominate.

**44. Why check exact role and skill names as well?**
Vector search is good at meaning but can miss a direct question like "what is Terraform?" if another passage is slightly closer. `findEntities()` checks the question for role and skill names, including aliases like "SRE", "golang" and "c#", and adds those pages first as sources. Longer phrases win ("data engineer" beats "data").
*Look at:* `src/lib/rag.ts`.

**45. How do you stop the model from making things up?**
Four layers. The system prompt says to answer only from the numbered sources and to say "Code Journey doesn't cover that yet" otherwise. The similarity threshold decides whether the top result is strong enough to answer at all. Lower-ranked passages are not filtered one by one, which is a point to be ready to explain. If no passage is confident, the app answers with a fixed sentence and links the closest pages, without calling the model at all. The model is also told never to invent URLs, numbers or salaries, and to use only links that appear in the sources. The code does not re-check the links in the answer, which is a gap worth knowing.
*Look at:* `src/lib/rag-prompt.ts`, the `confident` logic in `src/app/api/chat/route.ts`.

**46. How do you know retrieval works?**
`scripts/rag/eval.ts` generates questions for every role, skill and glossary term, adds hand-written paraphrases, and checks that the right page is in the top results. It also measures similarity on off-topic questions to tune the threshold. CI fails the index job below a 0.85 hit rate.

**47. What happens when the model is overloaded?**
Retrieval uses the embedding model, and generation uses the chat model. If the chat model returns 429, 500 or 503 before streaming starts, the code retries on a faster fallback model. If the embedding call fails, search falls back to keyword-only. If the answer stream fails mid-way, the client gets an `error` event and shows a message.
*Look at:* `streamAnswer()` and `embedQuery()` in `src/lib/gemini.ts`.

**48. How do you control cost?**
Per-user daily quota, counted atomically in the database (`consume_chat_message`, which upserts the row and returns whether the count is within the limit). Capped history (12 turns), capped input (2000 characters), capped output (1200 tokens), a capped number of sources (7), and embedding only changed passages at index time. Reasoning is set to a low level for the chat model.

**49. What is the weakness of that quota check?**
It runs before retrieval, so a request that fails after the count is incremented still uses a message. A fix is to refund the count on failure or move the count after the first successful token. This is listed in [12-known-gaps-and-improvements.md](12-known-gaps-and-improvements.md).

**50. Why does the chat trust the conversation history from the browser?**
The server cannot store history without a chat table, and history only shapes the search query and the prompt. The sources always come from the database, and the system prompt limits answers to them, so a forged history cannot make it cite other pages. It can still make the model say odd things about a forged turn, which is a known limit.

**51. What would you change about the AI feature?**
Calibrate the similarity threshold from evaluation data, cache answers to repeated questions, refund quota on failure, and log questions that get no confident answer, so the team can see which pages are missing. Feedback already stores the sources shown (`chat_feedback.sources`), which means real questions can feed the evaluation.

---

## Frontend and UX

**52. How does theming work?**
Four palettes (Tangerine, Harbor, Juniper, Orchard) are defined as CSS variables on `data-cj` and `data-mode` attributes on `<html>`. Components use tokens like `bg-canvas` and `text-ink`, never hard-coded colours, so all eight combinations work. A small inline script in the head sets the saved theme before the first paint, so there is no flash. Signed-in users save their choice to `profiles`.
*Look at:* `src/app/layout.tsx`, `THEME_SCRIPT` in `src/components/shell/UIProvider.tsx`, `src/app/globals.css`.

**53. Why an inline script for the theme?**
React renders after the first paint, so a theme applied in an effect would flash the wrong colours. An inline script in the head runs before the body is parsed. Its list of theme ids comes from the same `THEMES` constant, so the script and the React code cannot drift apart.

**54. How does the command palette work?**
Ctrl or Cmd+K, or `/` (when not typing in a field), opens a search overlay. It searches `search-index.json`, a list built from the content, and the arrow keys move through the results.
*Look at:* `src/components/shell/CommandPalette.tsx`, `src/app/search-index.json/route.ts`.

**55. How do you handle the phone and desktop layouts?**
Two headers, `PhoneHeader` and `Header`, rendered by the same layout. The layout is mobile-first, tap targets are at least 44 px on touch screens, and there is a skip link. Each change is checked at phone width as well as desktop, per the developer guide.

**56. How do you handle accessibility?**
A skip link, `aria-label`s on icon-only controls, focus states, and tap-target sizes. The developer guide makes accessibility a requirement, not polish. The repo does not record a formal accessibility audit, so say so if asked.

**57. How do you update state on the client?**
React context. `UIProvider` holds the panel, chat and theme state. `PathProvider` holds the signed-in user's route and statuses. Both expose small functions, and the write methods use optimistic updates with rollback (see question 58).

**58. Explain the optimistic update in My Path.**
When a station is ticked, the UI updates first, then the write goes to Supabase. The previous state is kept, and if the write fails, the state rolls back and any celebration is cleared. A celebration is decided by comparing progress before and after the change, so re-ticking a finished station never celebrates twice.
*Look at:* `setStatus` in `src/components/path/PathProvider.tsx`, `celebrationFor()` in `src/lib/milestones.ts`.

---

## Offline and performance

**59. How does the app work offline?**
It is a PWA. The service worker uses different strategies by request type: network first for pages (with the last saved copy as fallback), cache first for hashed build files, stale-while-revalidate for images and fonts, and never cache for private paths and APIs. On install it saves the offline page and the home page along with the scripts they need, because a saved page without its JavaScript cannot start.
*Look at:* `public/sw.js`, `docs/learn/pwa.md`.

**60. How do you release a change to the service worker?**
Bump `VERSION` in `public/sw.js`. The new worker installs, takes over, and deletes the caches of older versions. `/sw.js` is served with `no-cache` so browsers always check for it. A stale service worker can otherwise keep old visitors on old code for days.

**61. Why never cache private pages?**
A shared device could show one person's progress to another. The service worker explicitly skips `/me`, `/admin`, `/login`, `/u/`, `/email/` and `/api/`. If an offline visitor opens a private page, they get the offline screen, not the stored copy.

**62. What is the performance strategy?**
Static generation for almost every page, so there is no per-request rendering. Syntax highlighting (`shiki`) runs at build time, not in the browser. Images and icons are served from the CDN with caching. The data layer uses `cache()` from React so content files are read once per build or request. Fonts load through `next/font`, which avoids layout shift.

**63. Where would it be slow?**
The home map and the command palette index grow with content. The `/roles/compare` pages are generated for every adjacent pair of roles, which grows fast as roles are added. The chat route waits for an embedding and a database call before the first token. There are no performance budgets or Lighthouse checks in CI. The `.ig-scratch` folder holds Lighthouse reports from a manual check, not from the pipeline.

---

## Quality and testing

**64. What tests do you have?**
None automated. The gates are the content checker (before every build), lint, typecheck, the production build, the weekly link check, and the RAG retrieval evaluation in CI. The pure logic files were written so they could be tested from plain scripts. Be honest about this, and say that adding a test runner (Vitest on `path.ts`, `gap.ts`, `compass.ts`, `milestones.ts`) is the next step.

**65. How do you catch a broken content reference?**
`check-content.ts` runs as `prebuild`, so `npm run build` stops if a skill slug is unknown, a prerequisite is missing, a role is not in the catalog, a Compass answer points at a role that does not exist, or two resources share a URL. It also warns when a role can never be suggested by the quiz.

**66. What does the link checker do?**
It checks every external resource URL weekly, and on pull requests that touch `content/`. Sites that block bots (401, 403, 429) are warnings, not failures, so they do not cause false alarms.
*Look at:* `scripts/check-links.ts`.

**67. How would you test the chatbot?**
Unit-test `findEntities()` and `formatSources()` with fixed inputs. Run the retrieval evaluation against a staging index and track the hit rate and the off-topic similarity over time. Test the streaming route with a fake Gemini server that returns 429 and 503, to check the fallback. Add a test for the quota: 40 successes, then a refusal.

---

## Operations

**68. How is the weekly email sent?**
A Vercel cron calls `/api/cron/weekly-email` every day at 03:30 UTC. The day of the week chooses one of seven groups, and the database picks users whose id hashes to that group, so each opted-in user gets roughly one email a week. A user is skipped if they were emailed in the last 6 days. Messages go to Resend in batches of 100, and the daily cap is 100 by default. Each user's email is marked sent only after its batch succeeds.
*Look at:* `src/app/api/cron/weekly-email/route.ts`, `weekly_email_batch()` in `supabase/migrations/20261011000000_streaks.sql`.

**69. Why is the cron protected?**
It needs `CRON_SECRET` in the `Authorization` header. Without the header, it returns 401. Vercel sends the header for scheduled runs. A manual run can add `?group=` to pick a group or `?dry=1` to build the emails without sending.

**70. What do you monitor?**
The admin dashboard shows usage and health counts, such as signups, chat messages per day, weekly emails sent and the size of the search index. Error logging is `console.error` in route handlers, visible in the Vercel logs. There is no error tracking service yet.

**71. How do you deploy a database change?**
Write a migration, test it locally with `supabase db reset`, and have the owner run `supabase db push` against production. Nothing pushes schema changes to production automatically.

**72. What is the runbook for CJ AI being down?**
Check the `/api/chat` response: 500 with "not configured" means `GEMINI_API_KEY` is missing. A 503 means the quota function or the search function failed. A 429 from the embedding call is handled by falling back to keyword search. A 429 from the chat model is retried on the fast model, and if that fails too, the visitor sees "CJ AI is busy". See [10-delivery-ci-and-operations.md](10-delivery-ci-and-operations.md) for the full steps.

---

## Trade-offs and reflection

**73. What was the biggest technical decision?**
Moving from a Vite single-page app to Next.js App Router with static content. A client-only app would have needed every page's content in the bundle, or a fetch for each page. The static approach gave search engines real HTML, a sitemap, per-page share images and no loading spinners. The cost was a bigger framework and some learning curve on Next.js 16 changes. See [11-decisions-and-history.md](11-decisions-and-history.md).

**74. What would you do differently?**
Add tests before the features that carry risk, such as the streak SQL and the quota. Move migrations toward fewer redefinitions of the same function (`get_public_path()` is defined five times). Refund chat quota on failure. Add a Content-Security-Policy. Write `.env.example`. Remove unused tables (`notes`, `tasks`, `activity_logs`) after checking nothing uses them.

**75. What is the riskiest part of the system?**
Row-level security. One missing policy on a new table exposes data to everyone with the public key. The mitigation is the rule in the developer guide (enable RLS in the same migration), a pattern to copy, and review. Automated RLS tests would be the next step.

**76. What was hard about working with Gemini?**
The model family changed under the project. `gemini-2.5-*` models were closed to new API keys, so the code moved to 3.x models, which return 503 errors unless the thinking level is set low. The embedding free tier has a daily cap, so the retrieval evaluation had to wait for the quota to reset. The response was to make every model name an environment variable, add the fallback model, and document the limits in comments at the top of `gemini.ts`.

**77. Why did you choose the weekly email over daily?**
The repo sets the schedule but not the reason, so confirm the rationale with the owner before you give it in an interview. A reasonable answer: a weekly digest with the streak and the next station gives a reason to return without the noise of daily email, and it is opt-in, so people receive it by choice.

**78. How did you keep the scope under control?**
The project followed phases, with a stated order in the owner's notes: secure and unlock, Next.js foundation, content and launch, the AI guide, the personal layer, job tools, then growth. The commits cluster between 6 and 20 October 2026, when most of the rebuild landed.

**79. What does "curate, not teach" mean for your engineering?**
Content is the product, so the engineering goes into making content safe to change: schemas, checkers, link checks, and a build that fails loudly. The site should never need a code change to add a skill.

**80. Tell me about a bug you fixed that taught you something.**
Good candidates, all in the repo history or docs: the service worker that saved pages without their JavaScript, so offline pages showed an error (fixed by precaching the scripts a page references); the `profiles` table that had RLS disabled, which let the public anon key read every email (fixed in `20261006000100_profiles_rls_and_indexes.sql`); and the profile insert that failed when email confirmation was on (fixed with a database trigger). Pick one and explain the cause, the fix and the rule you took from it.

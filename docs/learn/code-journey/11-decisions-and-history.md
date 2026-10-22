# Decisions and history

How Code Journey got to its current shape: the timeline from the git history, the phases the owner worked through, and the big decisions written up as short records. Each record says what was decided, why, what it cost, and what was the alternative. Where the reason is not written down, the record says so, so you do not repeat a guess as a fact in an interview.

---

## 1. Timeline

The git history has 166 commits, from 31 March 2026 to 20 October 2026. Most of the current product was built in October 2026.

### Phase 0: the first version (March to April 2026)

- **31 March to 5 April:** the first app. Commit messages mention an "IDE UI", a logs page, legal pages and a `vercel.json`. A `trial-IDE` folder was added and later removed.
- **19 to 28 April:** backend and auth on Supabase, and an in-page chatbot. Its commit subject says "with api key", which suggests the key was used from the app. The commit alone does not show where it was stored, but it matters for the security story in ADR-04.
- **Late April to early May:** UI fixes, a README with commit conventions, and chatbot layout fixes.

### Phase 1: the rebuild (6 October 2026)

The single biggest day in the history is 6 October, with 38 commits. The owner's notes describe the rebuild as a move from a Vite single-page app to Next.js with TypeScript, a new content model, and a role-based map.

Key commits, in order:

| Commit subject (shortened) | What it established |
|---|---|
| Track Supabase schema in migrations, enable RLS on profiles | Schema under version control, and a security fix |
| Move CJ AI Gemini call server-side, open content routes, add GA4 | The AI key left the browser |
| Rebuild Code Journey on Next.js with the transit-map design system | The new framework and the metro-map design |
| Migrate track, blog, glossary and snippet content into `content/` | Content became files |
| Role one-liners and skill titles were cut off at the first comma | A YAML bug that led to the unquoted-comma check |
| Wave 2 and Wave 3 routes, the whole map written | All 26 roles and 99 skills |
| Build the CJ AI index and make search work without embeddings | The RAG pipeline, with keyword fallback |
| Tangerine default theme, and save your theme to your account | Themes with a profile setting |
| My Path, Compass, side-by-side role comparison, job post checker | The personal and decision tools |
| Save resources, helpful votes, suggest new ones | Bookmarks and feedback |
| Optional public path page, Google and GitHub sign-in | Public profiles and OAuth |
| CJ AI crashed the page after sending a question in newer Chrome | A bug fix (an example for interviews) |

### Phase 2: the features (7 to 9 October 2026)

- **7 October:** opt-in weekly email, streaks, route milestones and a stage-complete celebration, a FAQ contact form and a password-protected admin dashboard, the installable app with offline reading, a header redesign for phones, and an indexable page for each role comparison. The owner also replaced every em dash in the copy with a spaced hyphen.
- **9 October:** a theme settings panel, a service worker update and an offline page, and a footer rework. The owner's notes mark the job-tools phase as finished on this date.

### Phase 3: the polish and the profile (10 to 14 October 2026)

- **10 to 11 October:** GitHub, LinkedIn and LeetCode links on profiles, each with a database constraint.
- **12 to 14 October:** UI work: collapsible sections, a not-found page, a metro line visualisation for streaks, a printable checklist page, and an `introChat` feature removed.

### Phase 4: projects and final checks (19 to 20 October 2026)

- **19 October:** the project showcase (`user_projects`), a flashcard practice page for the glossary, and a continue card. The printable checklist page added on 14 October was removed the same day.
- **20 October:** documentation (developer setup, user guide), resource re-verification and a changelog entry. The last commit is on this day.

### What reversed

Some work was added and then taken out. That is normal, and good to mention:

- The printable **checklist** page was added on 14 October and removed on 19 October.
- The **snippets** page was removed on 6 October, and `/snippets` now redirects to `/skills`.
- Route names changed: `/tracks` became `/domains`, and `/roadmap` became `/roles`, with permanent redirects so old links still work.

---

## 2. The phases in the owner's plan

The owner's notes describe the work in phases, and each phase had to be working before the next began:

| Phase | Goal | Status in the notes |
|---|---|---|
| 0 | Secure and unlock | Done |
| 1 | Next.js foundation | Done |
| 2 | Content and launch: all 26 roles and 99 skills, ten launch roles | Done |
| 3 | CJ AI: retrieval over the site's content | Built. The threshold tuning was waiting on the embedding quota |
| 4 | Personal layer: My Path, progress, theme saved to the account | Done |
| 5 | Job tools: Compass, compare, the job post checker, saved resources, votes, suggestions, public pages, sign-in | Done on 9 October |
| 6 | Growth: weekly email, streaks, PWA, admin, and the rest | Largely done |

---

## 3. Decision records

Each record follows the same pattern: **Context**, **Decision**, **Consequences**, and **Alternatives or notes**. "Reason not recorded" means the repo does not say why, and the record gives the most likely reason, marked as such.

### ADR-01: Rebuild on Next.js App Router, with static pages

**Context.** The first version was a Vite single-page app. Every page needed the browser to run JavaScript before it showed content, which is poor for search engines, and each content change needed client code. The owner wanted a platform that looked serious and could be found. The memory notes say the old UI was "considered too simple".

**Decision.** Use Next.js 16 with the App Router and TypeScript. Generate almost every page at build time from files in `content/`. Keep only the data-driven and secret-holding parts as server routes.

**Consequences.**
- Good: real HTML for every page, per-page metadata and share images, a sitemap, and no loading spinners for public content.
- Good: content changes need a build, which is checked before deploy.
- Cost: Next.js 16 has breaking changes compared with older tutorials, so the project asks developers to read the bundled docs.
- Cost: a rebuild on every content change.

**Alternatives.** Keep the Vite app with a client-side fetch for content. Or use a different static framework. The notes do not record a comparison, so the reason was most likely the SEO and the App Router's server components, which fit the content-heavy site. That is an inference.

### ADR-02: Content in Markdown and YAML files, not a database or CMS

**Context.** The content is large and changes often: 26 roles with four stages each, 99 skills with resources, pay tables, a quiz and a glossary. Most of it is structured. The owner edits it by hand.

**Decision.** Keep all content in `content/` as Markdown with YAML front matter, and YAML or JSON for the rest. Validate with Zod at load time. Check relationships in `check-content.ts` at build time.

**Consequences.**
- Good: review through Git, history, diffs, and a build that fails on bad content.
- Good: no content admin to build or secure, and no runtime query to render a page.
- Cost: non-developers need Git to edit content.
- Cost: the front matter is dense, so a content edit can be fiddly (the unquoted-comma problem).

**Alternatives.** A headless CMS. Not chosen, according to the notes, because the content is curated in one place and reviewed as code. Reason partly inferred.

### ADR-03: The browser writes user data straight to Postgres, protected by row-level security

**Context.** The site needs per-user data: progress, bookmarks, votes, projects. The alternative was an API layer for each of these.

**Decision.** Use the Supabase client in the browser with the public anon key and the user's token. Make every user table RLS-protected in the same migration that creates it. Keep the server-side routes for things that need secrets or heavy logic.

**Consequences.**
- Good: fewer moving parts, and no API code to keep in step with the database.
- Good: the database is the single place where access rules live.
- Cost: every table must have correct policies. A missed policy is a data leak, and this was found in the first RLS migration, where `profiles` had RLS disabled and was readable with the public key.
- Cost: the rules are harder to test than an API's code.

**Alternatives.** A Next.js API route for every write. Not chosen, according to the notes, but the reason is not recorded.

### ADR-04: Move the AI call to the server, behind sign-in and a quota

**Context.** The early chatbot commit (27 April) is titled "with api key", which suggests the key was used from the app. The 6 October commit "move CJ AI Gemini call server-side" moved the call to a route. A key in browser code can be read by anyone who opens the page.

**Decision.** The chat calls `/api/chat`, which needs a signed-in user, counts messages in the database, and holds the Gemini key. The browser never sees the key.

**Consequences.**
- Good: the key is private, and usage is limited per person.
- Cost: every question takes a server round trip, and sign-in is required to ask.

**Notes.** This is a good interview story: the first version put the key where it could be read, and the fix was to move the call and add a quota at the same time.

### ADR-05: Retrieval-augmented generation, not fine-tuning

**Context.** CJ AI must answer about the site's own content, with citations, and the content changes weekly.

**Decision.** Build a passage index from the content and embed it. Retrieve passages for each question and give them to the model with the instruction to answer only from them.

**Consequences.**
- Good: an edit becomes part of the answers after re-indexing, with no training.
- Good: citations are real, because each answer points at passages.
- Cost: answer quality depends on retrieval, so the evaluation script and its threshold matter a lot (see [06-cj-ai-rag.md](06-cj-ai-rag.md)).

### ADR-06: Hybrid retrieval, with exact entity lookup first

**Context.** The owner's notes record that the embedding quota blocked a full evaluation, so the answers needed to keep working when the quota ran out. Keyword search alone misses paraphrases, so vector search was needed as well. The reason for the exact-name lookup is inferred from the design: a direct question should not depend on a near miss in the vector ranking.

**Decision.** Combine vector and keyword results with reciprocal rank fusion, in one SQL function. Add exact role and skill name matches before the search. Let the search run on keywords alone when no embedding is available.

**Consequences.**
- Good: paraphrases and exact names both work, and the app still answers when the embedding quota is gone.
- Cost: more SQL, and the function has been rewritten four times (its migration history shows the steps).

**Alternatives.** A reranking model. Not in the repo.

### ADR-07: The job post checker runs in the browser, with no AI and no upload

**Context.** Users paste job adverts, which may contain details they do not want sent anywhere. The feature needs to be fast and free to run.

**Decision.** Match skills by whole-word phrases from `skill-aliases.yaml`, in `gap.ts`, which has no network calls. No AI.

**Consequences.**
- Good: the privacy claim is simple to verify, and the feature costs nothing to run.
- Good: the matching is explainable and testable.
- Cost: it understands only the phrases the owner has added. It cannot read meaning.

### ADR-08: Milestones and streaks are derived, and streaks use an event log

**Context.** Progress data changes often. A stored percentage or a stored streak could go out of date.

**Decision.** Store only choices (the route and each skill's status) and an append-only log of completions. Compute percentages, stages, milestones and streaks from them, in the browser or in SQL.

**Consequences.**
- Good: nothing drifts. A change to the route file updates every person's progress.
- Good: editing a finished skill does not change the streak, because only new completions are logged.
- Cost: the streak is calculated on each request, which is cheap at this scale.

### ADR-09: Opt-in weekly email, sent in seven groups

**Context.** The email is a retention tool, and it must not feel like spam. The email provider's free plan allows 100 emails a day.

**Decision.** Email only people who opted in and have a route. Split them into seven groups by a stable hash, and send one group a day. Skip anyone emailed in the last six days.

**Consequences.**
- Good: each person gets at most one email a week, on a fixed weekday, and the daily cap is respected.
- Good: unsubscribe is one click, with a token.
- Cost: the send depends on the database function and the cron, so a failed run needs a manual retry. The reason for the seven-group design is partly inferred from the 100-a-day limit.

### ADR-10: One shared password for the admin dashboard

**Context.** One owner, and a small team. The dashboard exists to read numbers and handle messages.

**Decision.** A single `ADMIN_PASSWORD`, checked on the server, with a signed cookie, a per-network failure limit and slowed failures.

**Consequences.**
- Good: simple, and no admin accounts to manage.
- Cost: no record of who did what, and no second factor. The next step is per-person sign-in with a role.

### ADR-11: An installable, offline-capable app with explicit cache rules

**Context.** People study on phones, often on patchy connections, and on shared devices.

**Decision.** A service worker with different strategies for pages, build files, images and private paths. Private paths are never stored. The offline page is saved on install, with the scripts it needs.

**Consequences.**
- Good: reading works offline for pages already seen, and the app can be installed.
- Good: private data never stays on a shared device.
- Cost: releasing a service worker change needs a version bump, and the team must remember the cache rules whenever a private route is added.

### ADR-12: Themes as CSS variables, applied before the first paint

**Context.** Four palettes, each in light and dark, plus the system setting, and a saved choice for signed-in users.

**Decision.** Define palettes as CSS variables on attributes of `<html>`. Apply the saved choice with a small inline script in the head.

**Consequences.**
- Good: no flash, no hard-coded colours in components, and a new theme needs CSS and one constant.
- Cost: the theme list appears in three places (the constant, the CSS and the database check), so it must be kept in step.

### ADR-13: Curate, do not teach or sell

**Context.** Many learning sites sell courses, so their incentive is to keep learners inside their own material.

**Decision.** The product links to official documentation first, then to the best free material. It sells nothing and issues no certificates.

**Consequences.**
- Good: the advice is easier to trust, and the product has no reason to hide the best free option.
- Cost: links break, so a weekly check is needed. Content is never as complete as a course.

This is the product's central principle, and it is also the answer to the question "why isn't this a course platform?".

### ADR-14: Analytics only with consent, and ads never

**Context.** Analytics helps the owner see which pages help. Consent rules in Europe apply to most analytics cookies, so consent has to come first there.

**Decision.** Google Analytics 4 with Consent Mode. Ads storage is always denied. Analytics is denied by default for European and UK visitors until they accept the banner, and granted elsewhere.

**Consequences.**
- Good: a clear privacy story, with no advertising.
- Cost: analytics data is incomplete for European visitors, which is the intended trade-off.

---

## 4. What the decisions have in common

Read the records together and four themes come out:

1. **Keep the product's truth in files that are reviewed.** Content, pay data, quiz weights and the aliases are all files, with checks.
2. **Put the secret and the expensive work on the server, and everything else in the browser.** The AI key, the service role and the email are server-side. Progress, bookmarks and the job checker are not.
3. **Derive, do not store, what can be recomputed.** Percentages, milestones and streaks come from choices and a log.
4. **Choose the privacy-preserving option, and say so.** Opt-in email, no ads, consent for analytics, no upload in the job checker.

---

## 5. What the history teaches

- **Early security mistakes are common.** The first AI key was in the browser, and `profiles` had no RLS. Both were found and fixed within weeks, and the repo now has rules to prevent a repeat.
- **Bugs can come from data, not code.** An unquoted comma in YAML silently split catalogue entries. The fix was a check, not only a fix.
- **Scope grows fast.** The map, the AI, the personal layer and the tools all landed between 6 and 20 October. The phase plan is what kept it coherent.
- **Reversals are normal.** The checklist page and the chat intro came and went. Note them honestly.

---

## 6. How to talk about this in an interview

Pick one decision, and use the four parts: **context, decision, cost, and what you would change**. Good choices:

- ADR-04 (moving the AI key server-side): a clear before and after, with a security reason.
- ADR-03 (RLS instead of an API): a real trade-off, and a real incident (the `profiles` table).
- ADR-06 (hybrid search): an engineering judgement with measurable behaviour.
- ADR-13 (curate, do not sell): the product reason behind the architecture.

For each, say what you would do differently, using [12-known-gaps-and-improvements.md](12-known-gaps-and-improvements.md).

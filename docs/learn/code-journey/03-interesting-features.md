# Interesting features

Every feature of Code Journey, written for someone you are about to explain it to. Each entry has four parts: what a visitor sees, why it is interesting, how it works in one or two lines, and where it lives in the code.

For a live demo, use the [top five](#top-five-to-demo-in-five-minutes) first.

---

## Top five to demo in five minutes

1. **The metro map and a role route.** Shows the core idea. Open the map on the home page, pick Frontend Engineer, and walk the four stages. *Why it impresses:* the whole route, with projects and "done when" checks, is one Markdown file.
2. **Compass.** Answer the 8 questions and read the ranked roles and the "because you..." reasons. *Why it impresses:* a small, explainable scoring model, not a black box, and the scoring avoids favouring roles that merely appear often.
3. **Job post checker.** Paste a real job ad. *Why it impresses:* it works entirely in the browser, uses no AI, uploads nothing, and still puts the skills in learning order with prerequisites first.
4. **My Path with streaks and milestones.** Sign in, save a route, tick a station, and show the celebration and the streak. *Why it impresses:* the write is instant (optimistic), and the streak is computed by a SQL function from an event log.
5. **CJ AI with citations.** Ask a question, then open the sources. Ask something off-topic to show that it refuses instead of guessing. *Why it impresses:* grounded answers with numbered citations, and a clear refusal path.

---

## Exploring careers

### The metro map
- **Sees:** a network drawing of 10 lines (fields of tech) and their destinations (roles). Tapping a stop opens the role. Routes not yet written show as "being mapped".
- **Interesting because:** the map is generated from `catalog.yaml`, so adding a role adds a stop, and the "being mapped" state lets the product ship a complete map before every page is written. Each line has its own stroke style (solid, double, dashed, dotted and so on), so the lines can be told apart without relying on colour.
- **How it works:** `getNetwork()` compares the catalog with the files that exist, and marks each entry live or not. The map components draw SVG lines from the line styles in `lines.ts`.
- **Code:** `src/components/map/`, `src/lib/content.ts` (`getNetwork`), `src/lib/lines.ts`.

### Role pages (career routes)
- **Sees:** what the job is, a typical day, where people work, four stages (Foundations, Core, Job-ready, Senior), each with skills, a project, a "you're done when" check and rough weeks. Then the skills by priority (must, should, nice), tools, interview rounds, how AI is changing the role, pay, and adjacent roles.
- **Interesting because:** one Markdown file holds an entire career route. The Zod schema enforces that every stage has a project and a "done when", so a role cannot ship half-written.
- **Code:** `content/roles/*.md`, `src/app/(site)/roles/[slug]/page.tsx`, `RoleToc` and `Trail` components.

### Skill pages
- **Sees:** a one-minute brief, the level, the hours, prerequisites, a learning checklist, and resources. Each resource shows its type, cost (free, freemium or paid), whether it is official, and a note. A code snippet appears where one exists. A "last checked" date is shown.
- **Interesting because:** resource quality is a rule, not a hope. Every skill needs at least one resource, an official one is expected, and duplicate URLs fail the build.
- **Code:** `content/skills/*.md`, `src/app/(site)/skills/[slug]/page.tsx`, `content/snippets.json`.

### Compass (the role-finder quiz)
- **Sees:** 8 questions, each with several answer options (29 in total). The result is a ranked list of roles with a match percentage and up to three reasons, phrased "Because you...".
- **Interesting because:** the scoring is explainable and fair. Each option adds weights (1 to 3) to some roles. Roles are ranked by score divided by the square root of their maximum possible score. That stops a role from winning just because many options mention it, and stops a role from winning on one unusual answer.
- **Code:** `content/compass.yaml`, `src/lib/compass.ts` (`scoreCompass`, `maxScores`), `src/app/(site)/compass/Compass.tsx`. The content checker warns if a role can never be suggested.

### Compare roles
- **Sees:** two roles side by side: shared skills, job-ready time (computed from the first three stages), pay in India and the US, interview rounds, and AI impact. Pair pages exist for every pair of related roles, so each comparison can be found by search.
- **Interesting because:** the pair pages are generated from the adjacency data, so new related roles create new indexable comparisons without any new code.
- **Code:** `src/app/(site)/roles/compare/`, `getCompareRoles()` and `getComparePairs()` in `src/lib/content.ts`.

### Pay by role
- **Sees:** a table of pay for roles in India and the US, each figure with its source, the date it was published, and whether the matched job title is exact or the closest published one.
- **Interesting because:** the rule is "every number has a source". The data file marks non-exact matches honestly, and the content checker makes sure every role points at a real source row.
- **Code:** `content/market.yaml`, `src/app/(site)/market/`, `getMarket()` in `src/lib/content.ts`.

### Job post checker (`/gap`)
- **Sees:** paste a job advert. It lists the skills it mentions, the ones it does not cover (for example, "not covered yet" tools), the roles it looks like, and the order to learn the skills in.
- **Interesting because:** it runs entirely in the browser. The text never leaves the device, and no AI is used. Matching is whole-word, so "sql" does not match "mysql", and longest match wins, so "React Native" does not count as "React". Learning order puts prerequisites first, using a depth calculation over the prerequisite graph.
- **How the role fit works:** the share of the route the post mentions (cosine-style overlap), plus a bonus when the post names the role. A route needs at least two shared skills to appear.
- **Code:** `src/lib/gap.ts`, `content/skill-aliases.yaml`, `src/app/(site)/gap/GapAnalyser.tsx`.

### Glossary and practice deck
- **Sees:** plain-English definitions of tech terms, with a flashcard practice page.
- **Code:** `content/glossary.yaml`, `src/app/(site)/glossary/`, `FlashDeck.tsx`.

### Blog and guides
- **Sees:** 13 short articles, such as roadmaps for 2026 and "why people quit".
- **Code:** `content/blog/*.md`, `src/app/(site)/blog/`.

---

## Learning and tracking (needs a free account)

### Sign-in
- **Sees:** email and password, or Google and GitHub. The sign-in form shows a provider only if it is enabled.
- **Code:** `src/app/(auth)/login/`, `src/lib/supabase.ts` (`useUser`).

### Save a route and tick stations
- **Sees:** a "Save route" button on each role page. On each skill page, three choices: To do, Learning, Done.
- **Interesting because:** the update is applied in the interface first and written to the database after. If the write fails, the change is undone. Ticking a station is a single upsert, and the RLS policy means the browser cannot write to another person's rows.
- **Code:** `src/components/path/PathProvider.tsx`, `SaveRoute.tsx`, `SkillProgress.tsx`.

### My Path dashboard
- **Sees:** overall percentage, the current stage, the next four stations, hours left as a range, the weeks estimate at 10 hours a week, the stage-by-stage breakdown, a streak and a milestone list.
- **Interesting because:** almost all of it is computed in the browser from the route data, so the database stores only choices and statuses. The hours estimate is a range (low and high), not a single guess.
- **Code:** `src/app/(site)/me/`, `src/lib/path.ts` (`computeProgress`, `formatHours`, `formatWeeks`).

### Milestones and celebrations
- **Sees:** a list of milestones: first station, halfway, each stage complete, and the whole route complete. When a tick finishes a stage or a route, a toast appears with what is next.
- **Interesting because:** a celebration is decided by comparing progress before and after the tick. The route beats the stage when both happen. Re-ticking a finished station never celebrates again.
- **Code:** `src/lib/milestones.ts` (`milestones`, `celebrationFor`), `CelebrationToast.tsx`, `StreakMilestones.tsx`.

### Weekly streak
- **Sees:** the number of consecutive weeks with at least one station ticked. A week counts Monday to Sunday (UTC). A streak stays alive through the current week until it ends.
- **Interesting because:** the streak is calculated in SQL from an append-only event log that a trigger writes. It survives later edits, and it handles the "this week hasn't happened yet" case with an anchor. The algorithm is explained in [08-my-path-and-progress.md](08-my-path-and-progress.md).
- **Code:** `supabase/migrations/20261011000000_streaks.sql`.

### Saved resources
- **Sees:** a bookmark icon on each resource link. Saved resources are listed on My Path, newest first, with the skill they came from.
- **Interesting because:** a bookmark is keyed by URL, not by an ID the content does not have. It keeps a title snapshot, so the bookmark still reads well if the resource is later removed from the catalogue.
- **Code:** `src/components/path/SaveResource.tsx`, `user_saved_resources` table.

### Helpful votes and suggestions
- **Sees:** "Was this helpful?" on resources, and a form to suggest a better resource for a skill. Helpful counts are visible to everyone; "not helpful" votes stay private to the team, as a signal that a link is dead or outdated.
- **Interesting because:** a suggestion limit (5 a day per person) is enforced by a database trigger, so the review queue cannot be flooded from the client.
- **Code:** `src/components/path/ResourceVotes.tsx`, `SuggestResource.tsx`, `supabase/migrations/20261008000100_resource_votes_and_suggestions.sql`.

### Public path page (`/u/handle`)
- **Sees:** an opt-in page with a chosen handle, the route, the progress, the streak, the projects, and links to GitHub, LinkedIn and LeetCode if provided. It has a generated share image.
- **Interesting because:** it is safe to make public. One security-definer function returns only the chosen fields, and database constraints restrict the outside links to those three sites. It is `noindex`, so it does not compete with the main pages in search.
- **Code:** `src/app/(site)/u/[handle]/`, `get_public_path()` in the latest migration.

### Projects ("proof of work")
- **Sees:** on My Path, one project per stage: a title and an https link to something you built. Shown on the public path page.
- **Interesting because:** the route's stage names are the keys, so a project always belongs to a real stage, and the database only accepts https links.
- **Code:** `src/app/(site)/me/me-sections.tsx`, `supabase/migrations/20261020000000_project_showcase.sql`.

### Weekly progress email (opt-in)
- **Sees:** a short email with what you finished this week, your streak, and your next stations, with a one-click unsubscribe.
- **Interesting because:** users are split into seven groups by a stable hash of their ID, one group per day, so no single run sends everyone at once. A batch is marked as sent only after it succeeds, and the send cap protects the free email quota.
- **Code:** `src/app/api/cron/weekly-email/route.ts`, `src/lib/email/weekly.ts`, `weekly_email_batch()`.

---

## Asking

### CJ AI (the chatbot)
- **Sees:** a chat panel on every page. Answers stream in word by word, with numbered citations that link to the pages. Thumbs up or down on each answer. A daily limit of 40 messages for signed-in users.
- **Interesting because:** it is grounded. Answers come only from indexed passages from the site, and when nothing relevant is found, it says so. Search combines exact role and skill matches, vector similarity and keyword search. Follow-up questions are rewritten into standalone queries.
- **Full detail:** [06-cj-ai-rag.md](06-cj-ai-rag.md).
- **Code:** `src/app/api/chat/route.ts`, `src/lib/rag.ts`, `src/lib/rag-prompt.ts`, `src/lib/gemini.ts`, `src/components/shell/ChatPanel.tsx`.

### Command palette
- **Sees:** Ctrl or Cmd+K, or `/`, opens a search that finds roles, skills, resources and pages.
- **Code:** `src/components/shell/CommandPalette.tsx`, `src/app/search-index.json/route.ts`.

### Contact form
- **Sees:** a form at the bottom of the FAQ, with a topic (question, suggestion, bug, partnership, other).
- **Interesting because:** it needs no email service. Messages go to a table, protected by a honeypot field, a limit of 5 messages an hour per network (by salted IP hash) and length limits. Signed-in senders are linked to their account.
- **Code:** `src/app/api/contact/route.ts`, `contact_messages` table.

---

## Everywhere

### Four colour themes, light and dark
- **Sees:** Tangerine (default), Harbor, Juniper and Orchard, each in light and dark, plus "follow the system" mode. Choose in Theme settings.
- **Interesting because:** the themes are CSS variables, switched by attributes on `<html>`. A script in the head applies the saved theme before the first paint, so there is no flash. Signed-in users' choice follows them to other devices.
- **Code:** `src/lib/site.ts` (`THEMES`), `src/app/globals.css`, `src/app/layout.tsx`, `src/components/shell/UIProvider.tsx`.

### Installable app that works offline
- **Sees:** an install button in the footer. Installed, the app opens full screen, and long-pressing its icon gives shortcuts to My Path, Compass, the job post checker and all roles. Pages you have opened work offline. Unseen pages show a friendly offline page that lists the ones you can read.
- **Interesting because:** the caching rules are explicit by request type, and private pages are never stored on a shared device.
- **Full detail:** `docs/learn/pwa.md` and [10-delivery-ci-and-operations.md](10-delivery-ci-and-operations.md).
- **Code:** `public/sw.js`, `src/app/manifest.ts`, `src/components/shell/InstallApp.tsx`.

### Privacy by design
- **Sees:** a Privacy page written in plain words. A consent banner appears only for visitors in a European time zone, and analytics stays off until they accept there (Google Consent Mode v2, with ad storage always denied).
- **Code:** `src/components/shell/Consent.tsx`, `src/app/(site)/(legal)/privacy/page.tsx`.

### Search engine and AI-crawler friendliness
- **Sees:** nothing directly. Search engines get a sitemap, per-page share images, JSON-LD, and a `robots.txt` that allows search and AI crawlers while keeping private pages out. `/llms.txt` describes the site for AI assistants.
- **Code:** `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, `src/lib/og.tsx`.

### Admin dashboard (for the team)
- **Sees:** a password-protected page with users, signups by day, route choices, top completed skills, streaks, chat usage, feedback, saved and helpful resources, the contact inbox and suggestions.
- **Interesting because:** the statistics come from a few SQL functions, so the dashboard makes one round trip. The data is computed on the server with the service role, and nothing sensitive reaches the browser.
- **Code:** `src/app/(admin)/admin/`, `src/lib/admin.ts`, `admin_stats()` and `admin_users()` in `20261012000000_contact_and_admin.sql`.

---

## Quiet details people miss

- **Old URLs redirect.** About 15 legacy paths (for example `/tracks`, `/roadmap`, `/profile`, `/register`) are permanent redirects in `next.config.ts`, so old links still work.
- **The map is data-driven.** Add a line to `catalog.yaml` and the map grows. The content checker stops typos from breaking it.
- **Compass ranking is not a plain sum.** It divides by the square root of the maximum possible score.
- **The job post checker learns the prerequisite graph.** Learning order sorts skills by prerequisite depth, then by how often the post mentions them.
- **Pay data is copied, not estimated.** Each row keeps its source and date, and a non-exact match is flagged in the data and in the text the AI is given.
- **The streak forgives a busy day.** One ticked station in a week keeps the week alive, however many days were quiet.
- **The public page can never leak an email.** The function that builds it is written to omit the email and the user ID.
- **The AI never sees your progress.** The chat sends only the question and the conversation, not the user's route.
- **Every role page can be shared.** Each has its own generated social image.

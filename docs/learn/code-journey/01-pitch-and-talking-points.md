# The pitch and the talking points

How to explain Code Journey to anyone, and which numbers to quote. Practise the 30-second version until it sounds natural. Everything else is for follow-up questions.

---

## The problem, in one breath

Most people who want to get into tech don't fail for lack of courses. They fail because they don't know **what to learn next, and why**. Free material is everywhere, but it is unordered, and the people who write job ads don't tell you which of the 40 tools in a listing actually matter first.

Code Journey answers one question for every tech role: *"To become a ___, what do I learn, in what order, and where do I learn each thing?"*

## The core idea

- **Metro map.** Fields of tech are lines, roles are destinations, skills are stations. The map is the navigation, not decoration.
- **We curate, we don't teach.** Every skill links to the official documentation first, then the best free material. No courses are sold, and no certificates are issued.
- **Every number has a source.** Pay figures link to PayScale India or the US Bureau of Labor Statistics, with a date. Nothing is estimated.
- **Privacy by default.** Reading needs no account. Email is opt-in. Ads are off. The job post checker runs in the browser, so the text you paste is never uploaded.

---

## The three pitches

### 30 seconds

> Code Journey is a free map of tech careers. You pick a job, like frontend engineer or data analyst, and it shows the skills you need, in the order to learn them, with the official docs and the best free resources for each one. It's built with Next.js and Supabase, and it has an AI assistant that answers only from its own pages, with sources. I built it so people stop guessing what to learn next.

### 2 minutes

Add three points to the 30-second version:

1. **What a visitor does.** Compass, an 8-question quiz, suggests roles. Each role page has a four-stage route (Foundations, Core, Job-ready, Senior), and each stage has a project to build and a "you're done when" check.
2. **What makes it more than a list.** Signed-in users save a route and tick off stations. My Path shows a percentage, the next stations, hours left, milestones, and a weekly streak. Progress is saved in Postgres with row-level security, so users can only see their own rows.
3. **Why the AI is safe to trust.** CJ AI is retrieval-augmented. It searches a passage index built from the site's own content, sends only those passages to Gemini, and is told to answer only from them, with numbered citations. If nothing relevant is found, it says so instead of guessing.

### 5 minutes (walkthrough script)

1. **Home.** Show the metro map. Point out that the map is generated from `content/catalog.yaml`, and that routes not yet written show as "being mapped". (The map can ship before every page exists.)
2. **Compass.** Answer two questions. Explain the scoring: score divided by the square root of the role's maximum, so a role is not favoured just for appearing in many options.
3. **A role page.** Show the four stages. Explain that each stage's skills, project and "done when" are data in one Markdown file, and the page is rendered at build time.
4. **A skill page.** Show the brief, the checklist and the resources, with official ones first and a "last checked" date.
5. **Job post checker.** Paste a short job ad. Show the skills it finds, the role it fits, and the learning order (prerequisites first). Say: this runs entirely in the browser, with no AI and no upload.
6. **Sign in, then My Path.** Save a route, tick a station, and show the streak and milestone. Mention that the write goes straight from the browser to Supabase, and RLS enforces ownership.
7. **CJ AI.** Ask "What should I learn after SQL?" Show the sources panel and the citations. Mention the daily limit and the grounding rule.
8. **Close with the architecture.** Static pages from files, a small set of server routes, and Postgres with RLS. Point at the system design file if they want more.

---

## Numbers to quote (and where they come from)

| Claim | Number | Source file |
|---|---|---|
| Career roles | 26 | `content/roles/` |
| Skills | 99 | `content/skills/` |
| Lines (domains) on the map | 10 | `content/catalog.yaml` |
| Resources linked | 360+ (README figure, de-duplicated by URL in code) | `getAllResources()` in `src/lib/content.ts` |
| CJ AI messages per user per day | 40 | `CJ_DAILY_LIMIT` default |
| CJ AI answers | 12 turns of history, 2000 characters per message | `src/app/api/chat/route.ts` |
| Passages indexed for CJ AI | about 914 (note from 2026-10-07; re-check the live index) | `doc_chunks` table |
| Weekly email | one group per weekday, capped at 100 a day | `api/cron/weekly-email`, `WEEKLY_EMAIL_DAILY_CAP` |
| Colour themes | 4, each in light and dark | `src/lib/site.ts` |
| Git history | 166 commits, 2026-03-31 to 2026-10-20 | `git log` |

**Say "about" or "roughly" for anything that changes with content.** Say "166 commits" only if you have just checked it.

---

## What to say carefully

These claims are true, but they need the right framing.

- **"The AI is accurate."** Don't say this. Say: "It is grounded in the site's own pages and cites them. Retrieval quality is checked by an evaluation script that runs in CI, with a hit-rate gate of 0.85. The similarity threshold is not yet tuned against real traffic."
- **"It has users."** Only say this if you know. The admin dashboard shows the real counts.
- **"It's fully tested."** There is no automated test suite. The quality gates are the content checker (which runs before every build), lint, typecheck, the build itself, and the RAG evaluation. Say that, and say that the pure logic files were written to be testable.
- **"It's secure."** Say what is protected and how. Row-level security on every user table, server-only secret keys, signed admin cookies, rate limits, and no secrets in the browser. Also be ready to name the weak spots in [12-known-gaps-and-improvements.md](12-known-gaps-and-improvements.md). Interviewers respect an honest list more than a claim of perfection.
- **"Salaries."** Say "published figures from PayScale India and the US BLS, each with a date and source link". Never say "we estimate".

---

## Tailor it to the listener

| Listener | Lead with | Show | Avoid |
|---|---|---|---|
| **Recruiter or non-engineer** | The problem and the metro map | Compass, then a role page | Stack names |
| **Frontend engineer** | Next.js 16 App Router, server and client split, theme system | Themes switcher, command palette, the map | Database details |
| **Backend or data engineer** | Content pipeline, RLS, hybrid search, streak SQL | Migrations folder, `match_doc_chunks`, `streak_weeks` | Colours |
| **AI engineer** | RAG pipeline, grounding, RRF, evaluation gate, fallback model | CJ AI with sources, `scripts/rag/eval.ts` | Marketing words |
| **Product or founder** | Why people quit, the curate-don't-sell principle, growth loops | My Path, public path page, weekly email | Implementation details |
| **Someone who wants to learn** | How to use it to plan 6 months | Start with Compass | Internals first |

---

## Your own story (fill this in)

Interviewers often ask "tell me about a project you're proud of". Prepare a version with these parts, using real details from you:

1. **Why you built it:** what you saw happen to people, or what you got wrong yourself.
2. **The hardest decision:** for example, moving from a Vite single-page app to Next.js (see [11-decisions-and-history.md](11-decisions-and-history.md)), or keeping user data in the browser with row-level security instead of an API.
3. **A bug you found and fixed:** the git log has real ones, such as the service worker that saved pages without their JavaScript (see [08-my-path-and-progress.md](08-my-path-and-progress.md) and `docs/learn/pwa.md`), and the "profiles had RLS disabled" fix (see [07-security-and-privacy.md](07-security-and-privacy.md)).
4. **What you would do next:** pick two items from [12-known-gaps-and-improvements.md](12-known-gaps-and-improvements.md).

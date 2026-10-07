<div align="center">

# Code Journey

**The map of tech careers.**

Pick a role. See every skill it takes, in the order you need them, with the best official docs and free resources for each one.

[**codejourney.space**](https://www.codejourney.space)

</div>

---

## What it is

Most people trying to get into tech don't fail for lack of courses. They fail because they don't know **what to learn next, or why**. Code Journey answers one question for every tech role:

> *"To become a ___, what do I learn, in what order, and where do I learn each thing?"*

The site is drawn like a **metro map**. Fields of tech are **lines**, roles are **destinations**, and skills are the **stations** along the way. Each route is split into stages (Foundations, Core, Job-ready, Senior), with a project and a clear "you're done when…" for each.

**We don't sell courses or teach.** We curate. Every skill points to the official documentation first, then the best free material on the web.

## What's inside

**Explore**
- **26 career routes** - web, mobile, data, AI, cloud and DevOps, quality, security, customer-facing and specialist roles
- **99 skill pages** - a 60-second brief, a learning checklist and hand-picked resources
- **360+ resources**, a **glossary** in plain English, and **roadmap guides**

**Decide**
- **Compass** - an 8-question quiz that suggests roles that suit you
- **Compare** - any two roles side by side: shared skills, time to job-ready, pay and interviews
- **Pay by role** - salaries in India and the US for every role, each figure linked to its source
- **Job post checker** - paste a job ad to see which skills it asks for, which you already have, and what to learn next

**Learn and track**
- **My Path** - choose a destination and tick off stations as you go, with stages, milestones and a weekly streak
- **Saved resources**, helpful votes and resource suggestions
- **Weekly progress email** (opt-in) and a shareable **public path page**

**Ask**
- **CJ AI** - a chatbot that answers only from Code Journey's own pages, with sources for every answer

**Everywhere**
- Four colour themes (Tangerine, Harbor, Juniper, Orchard), each in light and dark
- Built for phones and desktops, and **installable as an app** that keeps working offline

## Principles

- **Free to read.** No account is needed to use the map.
- **Official docs first**, then the best free material.
- **Every number has a source.** No invented salaries or statistics.
- **Privacy by default.** No selling data, opt-in emails, and nothing personal saved on shared devices.

## Built with

| | |
|---|---|
| **App** | Next.js (App Router), TypeScript, Tailwind CSS |
| **Data and accounts** | Supabase: Postgres, Auth, row-level security, pgvector |
| **CJ AI** | Gemini, with retrieval over the site's own content |
| **Hosting** | Vercel, with scheduled jobs for the weekly email |

All the written content (roles, skills, guides, glossary, pay data) lives in plain YAML and Markdown in `content/`, separate from the code, and is checked on every build.

## Commit conventions

| Prefix | Use it for | Example |
|---|---|---|
| `feat:` | A new feature or page | `feat: Compass role-finder quiz and side-by-side role comparison` |
| `fix:` | A bug fix: what was broken and what changed | `fix: CJ AI crashed the page after sending a question in newer Chrome` |
| `ui:` | A visual or layout change that isn't a feature or a fix | `ui: network overlay slides up when it opens and back down when it closes` |
| `content:` | Written content: routes, skills, resources, guides, glossary | `content: four roadmap guides, pay passages for CJ AI, changelog` |
| `refactor:` | Code reorganised without changing what people see | `refactor: move compare data into the content layer` |

Keep the subject short and in plain words, describing what changed for the person using the site.

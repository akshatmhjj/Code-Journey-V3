<div align="center">

<h1>Code Journey</h1>

<p><strong>The map of tech careers.</strong></p>

<p>
Pick a role. See every skill it takes, in the order you need them,<br />
with the best official docs and free resources for each one.
</p>

<p>
<a href="https://www.codejourney.space"><img alt="Live site" src="https://img.shields.io/badge/live-codejourney.space-f97316?style=for-the-badge" /></a>
<a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-2563eb?style=for-the-badge" /></a>
<a href="#contributing"><img alt="Contributions welcome" src="https://img.shields.io/badge/contributions-welcome-16a34a?style=for-the-badge" /></a>
</p>

<p>
<img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs" />
<img alt="React 19" src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=000000" />
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178c6?style=flat-square&logo=typescript&logoColor=white" />
<img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" />
<img alt="Supabase" src="https://img.shields.io/badge/Supabase-Postgres-3ecf8e?style=flat-square&logo=supabase&logoColor=white" />
</p>

</div>

---

## Contents

- [What is Code Journey?](#what-is-code-journey)
- [Features](#features)
- [Principles](#principles)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Working with content](#working-with-content)
- [Contributing](#contributing)
- [License](#license)

---

## What is Code Journey?

Most people trying to get into tech don't fail for lack of courses. They fail because they don't know **what to learn next, and why**. Code Journey answers one question for every tech role:

> *"To become a ___, what do I learn, in what order, and where do I learn each thing?"*

The site is drawn like a **metro map**. Fields of tech are **lines**, roles are **destinations**, and skills are the **stations** along the way. Each route is split into four stages (Foundations, Core, Job-ready, Senior), with a project and a clear "you're done when…" check for each one.

**We don't sell courses or teach.** We curate. Every skill points to the official documentation first, then to the best free material on the web.

---

## Features

**Explore**
- **26 career routes** across web, mobile, data, AI, cloud and DevOps, quality, security, customer-facing and specialist roles
- **99 skill pages**, each with a 60-second brief, a learning checklist and hand-picked resources
- **Hundreds of curated resources**, a plain-English **glossary**, **system design** paths, **interview prep** and roadmap guides

**Decide**
- **Compass**: an 8-question quiz that suggests roles that suit you
- **Compare**: any two roles side by side, covering shared skills, time to job-ready, pay and interviews
- **Pay by role**: salaries in India and the US for every role, each figure linked to its source
- **Job post checker**: paste a job ad to see which skills it asks for, which you already have, and what to learn next

**Learn and track**
- **My Path**: choose a destination and tick off stations as you go, with stages, milestones and a weekly streak
- **Saved resources**, helpful votes and resource suggestions
- **Weekly progress email** (opt-in) and a shareable **public path page**

**Ask**
- **CJ AI**: a chatbot that answers only from Code Journey's own pages, with sources for every answer

**Everywhere**
- Four colour themes (**Tangerine**, **Harbor**, **Juniper**, **Orchard**), each in light and dark mode
- Built for phones and desktops, and **installable as an app** that keeps working offline

---

## Principles

- **Free to read.** No account is needed to use the map.
- **Official docs first**, then the best free material.
- **Every number has a source.** No invented salaries or statistics.
- **Privacy by default.** No selling data, opt-in emails, and nothing personal saved on shared devices.
- **No affiliate links.** We don't earn from where you click.

---

## Tech stack

| Layer | Tools |
|---|---|
| **App** | Next.js (App Router), React, TypeScript, Tailwind CSS |
| **Content** | Plain YAML and Markdown in `content/`, checked on every build |
| **Data and accounts** | Supabase: Postgres, Auth, row-level security, pgvector |
| **CJ AI** | Google Gemini, with retrieval over the site's own content |
| **Email** | Resend, for the opt-in weekly progress email |
| **Hosting** | Vercel, with a scheduled job for the weekly email |

---

## Getting started

### Prerequisites

- **Node.js 24** (the version used in CI)
- **npm**
- A **Supabase** project and a **Gemini API key**, only if you want accounts, saved progress or CJ AI. The content pages read from `content/`, so you can explore the site before adding any keys.

### 1. Clone and install

```bash
git clone https://github.com/akshatmhjj/Code-Journey-V3.git
cd Code-Journey-V3
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in the values you need. `.env` is git-ignored, so **never commit it**. Each variable is explained inside `.env.example`.

| Variable | Needed for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Accounts and saved progress |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only jobs and indexing. Never expose it to the browser. |
| `GEMINI_API_KEY` | CJ AI chat and indexing |
| `ADMIN_PASSWORD` | The `/admin` dashboard |
| `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET` | The weekly progress email |

### 3. Run the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Check the content, then build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Generate Next.js types and run `tsc` |
| `npm test` | Run the Vitest test suite |
| `npm run content:check` | Check that content references are valid |
| `npm run links:check` | Check that every external resource link still works |
| `npm run rag:ingest` | Re-index the site content for CJ AI |
| `npm run rag:eval` | Check CJ AI's retrieval quality |

---

## Project structure

```text
Code-Journey-V3/
├── content/         Roles, skills, resources, guides, glossary, pay data (YAML and Markdown)
├── src/
│   ├── app/         Routes and pages (Next.js App Router)
│   ├── components/  UI, map, path, interview prep and system design components
│   └── lib/         Content loading, CJ AI, path logic, email and shared helpers
├── scripts/         Content and link checks, and CJ AI indexing (scripts/rag)
├── supabase/        Database migrations and config
├── tests/           Database tests
└── docs/learn/      Plain-language guides about how the project is built
```

---

## Working with content

Most of Code Journey is content, not code. If you know a role well, you can make the site better without touching TypeScript.

- **Roles** live in `content/roles/`, one Markdown file per career route.
- **Skills** live in `content/skills/`, one Markdown file per skill.
- **Resources, glossary, pay data, FAQs and guides** live in their own folders and YAML files under `content/`.

Every change to `content/` is checked automatically. The build runs `npm run content:check`, and a weekly workflow runs `npm run links:check` to catch broken links. Run both locally before you open a pull request.

**Content standards**
- Point to **official documentation first**, then to free, high-quality material.
- Label paid courses clearly as paid, and don't add them unless they're clearly the best option.
- Every number needs a source link.
- Write in plain English. Short sentences beat jargon.

---

## Contributing

Contributions are welcome, and they don't have to be code. Here's how you can help:

- **Improve content.** Spotted an outdated link, a missing resource or a confusing explanation? Edit it in `content/`.
- **Report bugs.** Open an issue with what you expected, what happened, and the steps to see it.
- **Suggest features.** Open an issue describing the problem first, before you write any code. It saves everyone time.
- **Improve the code.** Fix a bug, add a test, or build something from the feature list above.
- **Improve the docs.** Clearer docs help the next person more than you'd think.

### Your first contribution

1. **Fork** the repository and clone your fork.
2. **Create a branch** with a short, descriptive name, such as `fix/broken-react-link` or `content/add-rust-resources`.
3. **Make your change.** Keep each pull request focused on one thing.
4. **Run the checks:**
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run content:check
   ```
5. **Open a pull request** against `main`. Explain what changed and why, and link any related issue.

### Commit conventions

Short prefixes keep the history easy to scan. Keep the subject in plain words that describe what changed for the person using the site.

| Prefix | Use it for | Example |
|---|---|---|
| `feat:` | A new feature or page | `feat: Compass role-finder quiz and side-by-side role comparison` |
| `fix:` | A bug fix: what was broken and what changed | `fix: CJ AI crashed the page after sending a question in newer Chrome` |
| `ui:` | A visual or layout change that isn't a feature or a fix | `ui: network overlay slides up when it opens and back down when it closes` |
| `content:` | Written content: routes, skills, resources, guides, glossary | `content: four roadmap guides, pay passages for CJ AI, changelog` |
| `refactor:` | Code reorganised without changing what people see | `refactor: move compare data into the content layer` |
| `docs:` | Documentation only | `docs: explain how to run the app locally` |

### Ground rules

- Be kind and constructive. Everyone here is learning.
- Never commit secrets. Keep keys in `.env`, not in code or in a pull request.
- If your change touches the database, add a new migration in `supabase/migrations/` rather than editing an old one.

---

## License

Code Journey is open source under the [MIT License](LICENSE). You're free to use, copy, modify and share it, as long as you keep the license notice.

---

<div align="center">

Built in the open by [Akshat](https://github.com/akshatmhjj) and contributors.

**[Explore the map →](https://www.codejourney.space)**

</div>

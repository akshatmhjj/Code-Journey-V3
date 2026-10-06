# Code Journey

The map of tech careers: every role, the skills it takes in order, and the best official docs and free resources for each. Live at [codejourney.space](https://www.codejourney.space).

## Stack

Next.js 16 (App Router, TypeScript), Tailwind CSS 4, Supabase (auth + Postgres), Gemini for CJ AI, deployed on Vercel. Almost every page is pre-rendered as static HTML.

## Run it

```bash
npm install
npm run dev
```

`.env` needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the old `VITE_` names also work) and `GEMINI_API_KEY` (server only, never `NEXT_PUBLIC_`).

| Command | What it does |
| --- | --- |
| `npm run build` | Checks content links, then builds |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run content:check` | Cross-checks roles, skills and catalog references |

## Content

Everything people read lives in `content/`, not in components:

- `catalog.yaml` — the network: domains (lines), roles (destinations), skills (stations). Anything listed shows on the map; it gets a full page once its Markdown file exists.
- `roles/<slug>.md` — a full route: stages, skills by priority, interviews, market notes.
- `skills/<slug>.md` — 60-second brief, learning checklist, resources (official first).
- `blog/`, `glossary.yaml`, `snippets.json`, `faq.yaml`, `changelog.yaml`.

Schemas are in `src/lib/content.ts`; a bad field fails the build with a clear message.

## Themes

Four palettes (Harbor, Juniper, Tangerine, Orchard) of four colours each, light and dark, defined as CSS variables in `src/app/globals.css`. Accent colours are fills only on light canvases; use `--hl` for accent-coloured text.

## Database

Schema changes go in `supabase/migrations` and are applied with `supabase db push`.

---

### Commit Conventions

**`feat:`** - A new feature or page added to the platform.

> `feat: add Exercises page with in-browser JS/Python/SQL test runner and XP tracking`

---

**`bug:`** - A bug fix. Describe what was broken and what the fix does.

> `bug: fix header overlap on sticky TOC rails - changed top value from 70px to 88px across all track pages`

---

**`ui:`** - A visual or layout change that isn't a new feature and isn't a bug fix. Redesigns, spacing corrections, colour tweaks, responsive fixes.

> `ui: redesign Footer mobile layout - hide giant wordmark, show compact brand row, collapse link grid to single column`

---

**`refactor:`** - Code reorganised or cleaned up without changing how anything looks or behaves for the user.

> `refactor: extract CJModal shell and ModalHead into shared components used by all 15 modal types`

---

**`content:`** - Changes to written content - text, analogies, code examples, resource links, glossary terms.

> `content: expand JavaScript section in WebDev with closure explanation and real debounce code example`

---

**`perf:`** - A change made specifically to improve speed, reduce layout thrashing, or cut unnecessary re-renders.

> `perf: memoize Search results with useMemo so filtering only runs when query changes, not on every render`

---

**`chore:`** - Housekeeping. Dependency updates, config changes, file renames, removing dead code. Nothing the user sees.

> `chore: remove MUI Dialog dependency from Profile - replaced with CJModal shell using Framer Motion`

---

**`auth:`** - Anything specifically related to authentication, session management, or access control.

> `auth: wire Supabase signOut to Profile logout button and redirect to home on success`

---

**`dx:`** - Developer experience improvements - comments, documentation, layout-fix.css, README updates.

> `dx: add layout-fix.css with complete overlap fix guide and per-file top value change table`

---

## Licence

This project is not open source. All design, code, and content in this repository is proprietary to Code Journey. Do not reproduce or redistribute without permission.

---

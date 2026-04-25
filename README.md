# Code Journey

**Learn to code. Build real things. Ship.**

Code Journey is a browser-native learning platform built for software engineering beginners who want a clear path — not a firehose of content. Instead of throwing hundreds of topics at you and hoping something sticks, it gives you one structured roadmap, one built-in code editor, and enough focused material to go from zero to your first job or shipped product.

No installation. No confusion tax. Just open the browser and start.

---

## What it does

The platform is organised around three learning tracks:

- **Web Development** — HTML, CSS, JavaScript, TypeScript, React, and Node.js. Covers everything from writing your first webpage to building a production-ready REST API with authentication.
- **App Development** — Flutter and Dart for cross-platform apps, plus native paths with Kotlin (Android) and Swift (iOS), and React Native. Pick the path that matches your goal.
- **Data Science** — Python, NumPy, Pandas, SQL, data visualisation, statistics, machine learning, and R. From loading a CSV to training a classification model.

Each track is a continuous long-form page — not slides or videos — written like a well-designed textbook. Every concept comes with a plain-English analogy, a real code example with inline comments, and a visual diagram.

---

## Pages and features built

| Area | What's there |
|---|---|
| **Home** | Landing page with animated hero, track overview, stats strip, how-it-works section |
| **Track pages** | WebDev, AppDev, DataScience — sticky left TOC, scroll-spy, syntax-highlighted code, SVG diagrams, resource links |
| **Roadmap** | Stage-by-stage interactive learning map per track, collapsible stages with projects and resources |
| **Practice / Exercises** | 10+ coding challenges across JS, Python, TypeScript, SQL — real in-browser test runner, hints, solution reveal, XP tracking |
| **IDE / Editor** | Full VS Code-inspired in-browser editor supporting 9 languages with tabs, minimap, syntax highlighting, and simulated code execution |
| **Languages** | Searchable reference for all 9 languages with expandable detail panels |
| **Glossary** | 45+ technical terms defined in plain English, alphabetically grouped, fully searchable |
| **Snippet Library** | 20 copy-paste code patterns across JS, TypeScript, React, Python, SQL — filterable by language and tag |
| **Blog** | Long-form articles with a slide-in reader panel and reading progress bar |
| **Leaderboard** | XP rankings, streak counts, challenges solved — podium top 3 with animated bars |
| **Search** | Global search across all languages, tools, roadmap, glossary, and pages — keyboard-driven (⌘K) |
| **Careers** | 18 companies across 4 hiring tiers, filterable by track and role, with salary ranges |
| **Ecosystem** | 6-tab technology map: languages, frameworks, databases, dev tools, modules, cloud |
| **Changelog (CJ Logs)** | Public platform changelog with a hidden admin composer |
| **Auth** | Login and signup with a smooth morphing panel transition, password strength meter, social login UI |
| **Profile** | Dashboard, notes (full CRUD), tasks (kanban with progress ring), theme settings — connected to Supabase backend |
| **Modals / Notifications** | Complete toast system + 15 modal types (notes, tasks, code execution, stage unlock, session expiry, etc.) |
| **Header** | Floating pill with mega-drop navigation, search, scroll progress bar, mobile drawer |
| **Footer** | Parallax sticky reveal on desktop, flat compact layout on mobile |
| **404** | On-brand not-found page with quick-nav grid |
| **Legal** | FAQ, Privacy Policy, Terms, Licensing — all in one file with named exports |

---

## Design system

The platform runs five themes — **Cosmos** (default dark), **Void**, **Aurora**, **Nord**, and **Light** — each defined as a complete colour token set. The active theme is stored in `localStorage["cj-theme"]` and every page polls for it every 500ms. The Profile Settings page is the single source of truth for theme changes; no other page has its own theme toggle.

**Typography** uses three fonts working together:
- `Syne` — headings, UI labels, buttons
- `JetBrains Mono` — code, metadata, badges, tags
- `Lora` — body text, analogies, descriptions, italic callouts

The logo (`CJLogo.jsx`) is a pure SVG — no image file dependency, scales perfectly at any size.

---

## Tech stack

- **React** — all UI components are function components with hooks
- **Framer Motion** — page transitions, modals, staggered animations, scroll-driven effects
- **Supabase** — authentication, notes, tasks, activity logs (Profile page)
- **React Router** — client-side navigation
- No CSS framework — all styling is inline with the design token system

---

## Project structure

```
src/
├── components/
│   ├── Header.jsx          # Floating nav pill, mega-drops, search, mobile drawer
│   ├── Footer.jsx          # Sticky parallax footer, responsive mobile layout
│   ├── CJLogo.jsx          # Standalone SVG logo — import wherever needed
│   ├── Layout.jsx          # Page wrapper that wires Header + Footer
│   └── Modals.jsx          # Full toast + modal system
│
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── About.jsx           # Mission and philosophy
│   ├── AuthPage.jsx        # Login / signup with morphing panel
│   ├── Profile.jsx         # User dashboard, notes, tasks, theme settings
│   ├── Roadmap.jsx         # Interactive learning roadmap
│   ├── Languages.jsx       # Language explorer
│   ├── CareersAndEcosystem.jsx  # Careers + Ecosystem (two named exports)
│   ├── CJLogs.jsx          # Platform changelog
│   ├── CodeJourneyIDE.jsx  # In-browser code editor
│   ├── Blog.jsx            # Articles with slide-in reader
│   ├── Exercises.jsx       # Coding challenges with test runner
│   ├── Glossary.jsx        # Technical term dictionary
│   ├── Snippets.jsx        # Copy-paste code patterns
│   ├── Leaderboard.jsx     # XP and streak rankings
│   ├── Search.jsx          # Global search
│   ├── NotFound.jsx        # 404 page
│   └── LegalPages.jsx      # FAQ, Privacy, Terms, Licensing
│
└── tracks/
    ├── WebDev.jsx          # Web Development track
    ├── AppDev.jsx          # App Development track
    └── DataScience.jsx     # Data Science track
```

---

## Routing

```
/                 → Home
/about            → About
/auth             → AuthPage
/profile          → Profile
/roadmap          → Roadmap
/tracks           → Languages
/tracks/web       → WebDev
/tracks/app       → AppDev
/tracks/data      → DataScience
/editor           → CodeJourneyIDE
/practice         → Exercises
/glossary         → Glossary
/snippets         → Snippets
/blog             → Blog
/leaderboard      → Leaderboard
/search           → Search
/logs             → CJLogs
/careers          → Careers
/ecosystem        → Ecosystem
/faq              → FAQ
/privacy-policy   → Privacy
/terms            → Terms
/licensing        → Licensing
/404              → NotFound (catch-all)
```

---

## Header overlap fix

The header is a fixed floating pill (`top: 14px`, `height: 60px`). To prevent it from overlapping page content, add this to your global CSS once:

```css
html {
  scroll-padding-top: 96px;
}
```

And on any page that doesn't have a hero section with top padding, add `padding-top: 88px` to the first content element. All sticky TOC rails in track pages should use `top: 88px`.

---

## Backend setup (Supabase)

The Profile page requires four tables in your Supabase project:

| Table | Purpose |
|---|---|
| `profiles` | Stores `full_name`, `email` keyed by user `id` |
| `notes` | User notes — `user_id`, `title`, `content` |
| `tasks` | User tasks — `user_id`, `title`, `description`, `status`, `priority` |
| `activity_logs` | Audit trail — `user_id`, `action`, `created_at` |

Set Row Level Security so users can only read and write their own rows. The auth flow uses `supabase.auth.getUser()` and `supabase.auth.signOut()`.

---

## Commit conventions

Every commit message starts with a **prefix** that tells anyone reading the history exactly what kind of change it is. Keep the description clear enough that a team member can understand what changed without opening the diff.

---

### Prefixes

**`feat:`** — A new feature or page added to the platform.

> `feat: add Exercises page with in-browser JS/Python/SQL test runner and XP tracking`
>
> `feat: add global search modal with ⌘K shortcut and category-filtered results`
>
> `feat: add mobile drawer to Header — slides from left, accordion nav groups, body scroll lock`

---

**`bug:`** — A bug fix. Describe what was broken and what the fix does.

> `bug: fix header overlap on sticky TOC rails — changed top value from 70px to 88px across all track pages`
>
> `bug: fix note deletion not refreshing list — fetchNotes now called after Supabase delete confirms success`
>
> `bug: fix auth page scrolling on mobile — set html and body overflow:hidden, all content fits viewport`

---

**`ui:`** — A visual or layout change that isn't a new feature and isn't a bug fix. Redesigns, spacing corrections, colour tweaks, responsive fixes.

> `ui: redesign Footer mobile layout — hide giant wordmark, show compact brand row, collapse link grid to single column`
>
> `ui: improve mega-drop animation — children now stagger in with 40ms delay each instead of all appearing at once`
>
> `ui: fix light theme readability on WebDev hero — adjusted t2 text opacity and body font size`

---

**`refactor:`** — Code reorganised or cleaned up without changing how anything looks or behaves for the user.

> `refactor: extract CJModal shell and ModalHead into shared components used by all 15 modal types`
>
> `refactor: consolidate theme token reading into single useTheme hook used across all pages`

---

**`content:`** — Changes to written content — text, analogies, code examples, resource links, glossary terms.

> `content: expand JavaScript section in WebDev with closure explanation and real debounce code example`
>
> `content: add 8 new glossary terms — Coroutine, ORM, JWT, CI/CD, Null Safety, Framework, Result Type, useReducer`
>
> `content: update Careers page — added 4 new companies to Tier 2, corrected salary ranges for data roles`

---

**`perf:`** — A change made specifically to improve speed, reduce layout thrashing, or cut unnecessary re-renders.

> `perf: memoize Search results with useMemo so filtering only runs when query changes, not on every render`
>
> `perf: replace 500ms polling in useTheme with storage event listener as primary, polling as fallback`

---

**`chore:`** — Housekeeping. Dependency updates, config changes, file renames, removing dead code. Nothing the user sees.

> `chore: remove MUI Dialog dependency from Profile — replaced with CJModal shell using Framer Motion`
>
> `chore: rename title state variable in Profile from title/content to noteTitle/noteContent to avoid collision with task form`

---

**`auth:`** — Anything specifically related to authentication, session management, or access control.

> `auth: wire Supabase signOut to Profile logout button and redirect to home on success`
>
> `auth: add session expiry modal — fires after 30 minutes of inactivity, links to /auth`

---

**`dx:`** — Developer experience improvements — comments, documentation, layout-fix.css, README updates.

> `dx: add layout-fix.css with complete overlap fix guide and per-file top value change table`
>
> `dx: add AUTH: comment markers throughout Header and Profile so re-enabling auth is a search-and-uncomment`

---

## What's next

- Connect the IDE to a real WebAssembly execution engine
- Wire the Leaderboard to live Supabase XP data
- Add more challenges to Exercises (target: 50 across all tracks)
- Build the Curriculum page — a flat printable syllabus for all three tracks
- Add notification preferences and linked accounts to Profile Settings
- Public shareable progress card per user

---

## Licence

This project is not open source. All design, code, and content in this repository is proprietary to Code Journey. Do not reproduce or redistribute without permission.

---

*Built with React, Framer Motion, and Supabase. No framework shortcuts. Every pixel intentional.*

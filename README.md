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

## Commit conventions

Every commit message starts with a **prefix** that tells anyone reading the history exactly what kind of change it is. Keep the description clear enough that a team member can understand what changed without opening the diff.

---

### Prefixes

**`feat:`** — A new feature or page added to the platform.

> `feat: add Exercises page with in-browser JS/Python/SQL test runner and XP tracking`

---

**`bug:`** — A bug fix. Describe what was broken and what the fix does.

> `bug: fix header overlap on sticky TOC rails — changed top value from 70px to 88px across all track pages`

---

**`ui:`** — A visual or layout change that isn't a new feature and isn't a bug fix. Redesigns, spacing corrections, colour tweaks, responsive fixes.

> `ui: redesign Footer mobile layout — hide giant wordmark, show compact brand row, collapse link grid to single column`

---

**`refactor:`** — Code reorganised or cleaned up without changing how anything looks or behaves for the user.

> `refactor: extract CJModal shell and ModalHead into shared components used by all 15 modal types`

---

**`content:`** — Changes to written content — text, analogies, code examples, resource links, glossary terms.

> `content: expand JavaScript section in WebDev with closure explanation and real debounce code example`

---

**`perf:`** — A change made specifically to improve speed, reduce layout thrashing, or cut unnecessary re-renders.

> `perf: memoize Search results with useMemo so filtering only runs when query changes, not on every render`

---

**`chore:`** — Housekeeping. Dependency updates, config changes, file renames, removing dead code. Nothing the user sees.

> `chore: remove MUI Dialog dependency from Profile — replaced with CJModal shell using Framer Motion`

---

**`auth:`** — Anything specifically related to authentication, session management, or access control.

> `auth: wire Supabase signOut to Profile logout button and redirect to home on success`

---

**`dx:`** — Developer experience improvements — comments, documentation, layout-fix.css, README updates.

> `dx: add layout-fix.css with complete overlap fix guide and per-file top value change table`

---

## Licence

This project is not open source. All design, code, and content in this repository is proprietary to Code Journey. Do not reproduce or redistribute without permission.

---

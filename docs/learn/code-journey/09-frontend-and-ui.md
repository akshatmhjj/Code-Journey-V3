# Frontend and UI

How the Code Journey interface is built: the Next.js App Router structure, where code runs (server or browser), how state is shared, how the four themes work, how the metro map is drawn, and how the site is made easy to find and easy to use.

---

## 1. The shape of the app

```text
src/app/
  layout.tsx                 Root: <html>, fonts, theme script, JSON-LD, global shell
  (site)/                    Public site (route group, not in the URL)
    layout.tsx               Site chrome: headers, footer, network map, chat, PathProvider
    page.tsx                 Home: the metro map and entry points
    roles/                   Role pages, compare pages, role index
    skills/                  Skill pages
    domains/                 Fields of tech (lines)
    compass/  gap/  market/  glossary/  blog/  faq/  about/  resources/
    me/                      My Path (signed in, private)
    u/[handle]/              Public path page (opt-in)
    (legal)/                 Privacy and terms
    email/unsubscribe/       One-click unsubscribe page
  (auth)/login/              Sign in, sign up, OAuth return
  (admin)/admin/             Password-protected dashboard
  api/                       chat, contact, cron/weekly-email, email/unsubscribe
  offline/                   Offline page and saved-pages list
  manifest.ts, sitemap.ts, robots.ts, llms.txt/, search-index.json/, icons/
  opengraph-image.tsx        Social share images (also per role, skill and public path)
```

**Route groups** are folders in parentheses. `(site)` shares one layout for every public page without adding `/site` to the URL. `(auth)` and `(admin)` have their own layouts, so the login page and the dashboard do not get the public header or the chat panel.

---

## 2. Server components and client components

Next.js App Router components are **server components by default**. They run on the server (or at build time), can read files and secrets, and send HTML to the browser. A file that starts with `"use client"` is a **client component**: it is sent as JavaScript and runs in the browser, with state, effects and event handlers.

| Layer | Examples | Can use | Cannot use |
|---|---|---|---|
| Server (build or request) | `roles/[slug]/page.tsx`, `content.ts`, `layout.tsx` | Files in `content/`, secrets, `server-only` modules | `useState`, `window`, browser APIs |
| Client | `ChatPanel.tsx`, `PathProvider.tsx`, `CommandPalette.tsx`, `UIProvider.tsx` | Hooks, events, `localStorage`, the Supabase browser client | Secrets, the file system |

### The rule that keeps secrets safe

`src/lib/content.ts`, `admin.ts`, `rag.ts` and `markdown.ts` begin with `import "server-only"`. If a client component imports one of them, the build fails with an error. Pure logic that both sides need (`path.ts`, `gap.ts`, `compass.ts`, `milestones.ts`, `money.ts`, `lines.ts`) deliberately has no server-only imports, and a comment at the top says so.

### How data crosses the boundary

A server component reads the content, then passes small plain objects to a client component as props. For example, `(site)/layout.tsx` builds the list of routes and passes it to `PathProvider`, and `me/page.tsx` passes the full path index to `MeView`. The client never reads `content/` itself, so the client bundle carries only what the page needs.

### Typed params

In Next.js 16, dynamic route params are a promise and are typed with `PageProps`:

```tsx
export default async function DomainPage({ params }: PageProps<"/domains/[slug]">) {
  const { slug } = await params;
  // ...
}
```

This differs from older tutorials. The project's `AGENTS.md` asks developers to read the guides under `node_modules/next/dist/docs/` before writing Next.js code.

---

## 3. Static generation

Almost every public page is generated at build time. Dynamic segments use `generateStaticParams` to list the slugs.

| Route | Generated from |
|---|---|
| `/roles/[slug]` and its `opengraph-image` | Role files |
| `/skills/[slug]` and its `opengraph-image` | Skill files |
| `/domains/[slug]` | Catalog domains |
| `/roles/compare/[pair]` | Pairs from each role's adjacent list |
| `/blog/[slug]` | Blog files |
| `/glossary/[slug]` | Glossary terms |
| `/icons/[name]` | A fixed list of icon sizes |

Pages that depend on the signed-in person (`/me`) or on request data (`/api/*`, `/u/[handle]`, `/admin`) are not in this list.

**Consequence:** after content changes, the site must be rebuilt. Vercel does this on each push to the main branch. The developer guide describes this as the reason content edits need a deploy.

---

## 4. Shared state

Two React contexts hold the cross-cutting state.

### `UIProvider` (`src/components/shell/UIProvider.tsx`)

| State | Purpose |
|---|---|
| `panel` | Which overlay is open: search, network map, or theme settings |
| `chatOpen`, `chatDraft` | The chat panel, and a question pre-filled from elsewhere on the site |
| `theme`, `mode` | The current palette and light, dark or system mode |
| `saveLook`, `unsaved`, `saving` | Saving the look to the account |

It also owns the global keyboard shortcuts (Ctrl or Cmd+K, and `/` when not typing in a field).

### `PathProvider` (`src/components/path/PathProvider.tsx`)

Holds the signed-in person's route, statuses, bookmarks and the current celebration. Its write functions use optimistic updates with rollback. The details are in [08-my-path-and-progress.md](08-my-path-and-progress.md).

### Why not a state library?

Two contexts with a few functions each cover the app. The shared data is small, and most state is local to one component. A library would add weight without solving a real problem here.

---

## 5. Themes

Four palettes, each in light and dark, plus "follow the system":

| Id | Name | Note |
|---|---|---|
| `tangerine` | Tangerine | Default. Warm cream background, orange accent |
| `harbor` | Harbor | Navy and off-white, coral accent |
| `juniper` | Juniper | Olive and sand |
| `orchard` | Orchard | Sand and olive, with an amber accent |

### How it is built

1. `src/app/globals.css` defines CSS variables for each palette on `[data-cj="<id>"]`: `--canvas`, `--ink`, `--support`, `--accent`, `--on-accent`, `--hl`, `--surface`.
2. Dark mode is a block per palette, `[data-cj="<id>"][data-mode="dark"]`, plus a `prefers-color-scheme` block for "follow the system".
3. Components use Tailwind tokens built on those variables (`bg-canvas`, `text-ink`, `text-muted`, `border-ink`). No hex colours appear in components.
4. The `<html>` element carries `data-cj` and, when chosen, `data-mode`.

### No flash on load

`THEME_SCRIPT` is an inline script in the `<head>`. It runs before the body is parsed, reads `localStorage` (`cj-theme`, `cj-mode`), checks the value against the list of valid ids, and sets the attributes. The list is generated from the same `THEMES` constant the React code uses, so the two cannot disagree. Without this script, the page would paint in the default colours and then change, which looks broken.

### Saved for signed-in users

When a person signs in, their saved `theme` and `mode` (from `profiles`) are applied. The Theme settings sheet has a "save" button that is shown only when the current look differs from the saved one.

### Adding a theme

The developer guide has the recipe: add an entry to `THEMES`, add the CSS blocks, and add the new id to the `profiles.theme` check constraint with a new migration.

---

## 6. The metro map

The map is the site's signature. It is drawn with SVG from data.

- **Data:** `getNetwork()` returns domains (lines), roles (destinations) and skills (stations), each marked live or "being mapped".
- **Line styles:** ten styles (solid, double, dashed, dotted, thin, dash-dot, short, hollow, rail, hub) give each line its own look without colour alone.
- **Components:** `components/map/NetworkMap.tsx` draws the network, `Line.tsx` draws one line, `RouteStages.tsx` draws a role's stages, and `NetworkList.tsx` is the text alternative for screen readers and small screens.
- **Overlay:** `NetworkOverlay` shows the full map as a sheet that slides up, opened from the header.

The map is a good example of **data-driven UI**. Adding a role to `catalog.yaml` adds a stop, and the layout code does not change.

---

## 7. Layout, phone first

- **Two headers.** `PhoneHeader` is shown below the medium breakpoint (`md:hidden`), and `Header` from the medium breakpoint up (`hidden md:block`). Both are rendered, and CSS decides which one is visible.
- **Tap targets** are at least 44 px on touch screens, following the developer guide.
- **A skip link** at the top of each page lets keyboard users jump past the header.
- **Sheets.** The search palette, network map, theme settings and the chat panel are sheets (`components/shell/Sheet.tsx`). A full sheet slides up, a side sheet slides in from the right, and both slide back out on close (see `.sheet-full` and `.sheet-side` in `globals.css`).
- **The chat** is a panel that stays on the page while the visitor reads.

The developer guide asks that every change is checked at phone width as well as desktop.

---

## 8. Components by folder

| Folder | What is in it | Notable files |
|---|---|---|
| `components/shell/` | The chrome: headers, footer, search, chat, themes, install button, cookie banner | `CommandPalette.tsx`, `ChatPanel.tsx`, `UIProvider.tsx`, `ThemeSettings.tsx`, `Consent.tsx`, `InstallApp.tsx`, `ServiceWorker.tsx` |
| `components/map/` | The metro map | `NetworkMap.tsx`, `Line.tsx`, `RouteStages.tsx` |
| `components/path/` | My Path features | `PathProvider.tsx`, `SaveRoute.tsx`, `SkillProgress.tsx`, `ResourceVotes.tsx`, `StreakMilestones.tsx`, `CelebrationToast.tsx` |
| `components/ui/` | Shared building blocks | `Trail.tsx` (the route as a trail), `Station.tsx`, `Disclosure.tsx`, `RoleToc.tsx`, `JsonLd.tsx`, `bits.tsx` |
| `components/market/` | Pay display | `PayBlock.tsx` |
| `components/brand/` | The logo | `Logo.tsx` |

---

## 9. Search, SEO and crawlers

Being easy to find is part of the product, because people search for "what to learn to become a data analyst".

| Feature | Where | What it does |
|---|---|---|
| Per-page metadata | Each `page.tsx` `generateMetadata` | Title, description, canonical URL, Open Graph, Twitter card |
| Title template | Root `layout.tsx` | `%s · Code Journey` on every inner page |
| Share images | `opengraph-image.tsx` (role, skill, public path) and `src/lib/og.tsx` | Generated images for social cards, at build time |
| JSON-LD | Root layout | `WebSite` and `Organization` structured data |
| Sitemap | `src/app/sitemap.ts` | All public pages |
| Robots | `src/app/robots.ts` | Search crawlers and named AI crawlers allowed; private paths disallowed |
| `llms.txt` | `src/app/llms.txt/route.ts` | A plain-text description of the site for AI assistants |
| Search index | `src/app/search-index.json/route.ts` | The data for the command palette |
| Canonical pair order | `getComparePairs()` | Each pair of roles has one canonical URL, so the two orders do not compete |
| Noindex | Public path pages and My Path | Personal pages are kept out of search results |

---

## 10. Accessibility

The developer guide treats accessibility as a requirement. What the code does:

- A skip link to the main content.
- Icon-only buttons have `aria-label`s (for example the Stop button in the chat).
- Tap targets of 44 px or more on touch screens.
- Focus is moved into the chat input when the panel opens.
- The map has a text list of the same network (`NetworkList.tsx`), so the information does not depend on the drawing.

The repo does not record a formal audit with a screen reader or an automated scan. That is a sensible next step (see [12-known-gaps-and-improvements.md](12-known-gaps-and-improvements.md)).

---

## 11. Typography and fonts

Three font families load through `next/font/google`, which downloads them at build time and serves them from the same origin, avoiding a third-party request and most layout shift:

| Font | Role | Variable |
|---|---|---|
| Familjen Grotesk | Headings (500, 600, 700) | `--font-display` |
| IBM Plex Sans | Body text (400, 500, 600) | `--font-body` |
| IBM Plex Mono | Code and labels | `--font-code` |

`display: "swap"` shows text immediately in a fallback font, then swaps when the webfont is ready.

---

## 12. How to add a page (short version)

1. Create a folder with a `page.tsx` under `src/app/(site)/`.
2. If it is built from content, export `generateStaticParams` and `generateMetadata`.
3. Add it to `sitemap.ts` if it should be indexed, and to the header or footer if it should be linked.
4. If it shows personal data, treat it as private: disallow it in `robots.ts`, add it to the service worker's never-cache list, and mark it `noindex`.
5. Check it at 375 px and at desktop width, in both themes.

---

## 13. Files to read, in order

1. `src/app/layout.tsx` (the root shell and the theme script)
2. `src/app/(site)/layout.tsx` (the site chrome and the data it passes down)
3. `src/app/(site)/roles/[slug]/page.tsx` (a static content page)
4. `src/components/shell/UIProvider.tsx` (shared UI state and shortcuts)
5. `src/app/globals.css` (the four palettes)
6. `src/components/map/NetworkMap.tsx` (the signature drawing)
7. `src/components/shell/CommandPalette.tsx` (keyboard search)

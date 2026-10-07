# How Code Journey became an installable app (PWA)

A **Progressive Web App** is a normal website that a phone or computer can install like an app: it gets a home-screen icon, opens full-screen without the browser's address bar, and keeps working when the connection drops. There's no app store and no second codebase. It's the same Next.js site, plus three small pieces.

## The three pieces

| Piece | What it does | In this repo |
|---|---|---|
| **Web app manifest** | A JSON file describing the app: name, icons, colours, start page, shortcuts. The browser reads it when someone installs. | `src/app/manifest.ts` (served at `/manifest.webmanifest`) |
| **Icons** | PNGs the phone uses on the home screen, splash screen and app switcher. Chrome requires 192px and 512px. | `src/lib/app-icon.tsx` draws them; `src/app/icons/[name]/route.tsx` serves them; `src/app/apple-icon.tsx` for iPhone |
| **Service worker** | A script that runs in the background, between the site and the network. It decides what to save and what to show when offline. | `public/sw.js`, registered by `src/components/shell/ServiceWorker.tsx` |

Chrome and Edge only offer "Install" once all three are present and the site is on HTTPS (localhost counts as secure for testing).

## 1. The manifest

The fields that matter most:

- `name` / `short_name`: full name for the install dialog, short name under the icon.
- `start_url: "/?source=app"`: the page that opens when you tap the icon. The `?source=app` lets Google Analytics tell app opens from website visits.
- `display: "standalone"`: hides the browser's address bar, so it feels like an app.
- `theme_color`: the phone's status-bar colour. `background_color`: the splash-screen colour while the app loads.
- `icons`: one set with `purpose: "any"`, one with `purpose: "maskable"` (see below).
- `shortcuts`: long-press the icon on Android or desktop to jump to My Path, Compass, the gap checker or all roles.

iPhones mostly ignore the manifest. They read `appleWebApp` in `src/app/layout.tsx` and `apple-icon` instead.

## 2. Icons, and what "maskable" means

Android crops app icons into the phone maker's shape: circle, squircle, teardrop. A **maskable** icon promises that everything important sits inside the middle 80%, so cropping never cuts the logo. That's why the maskable version shrinks the mark to 56% of the square, while the normal icon fills 74%.

The icons are drawn in code (an SVG inside `ImageResponse`), so changing the colours in `src/lib/app-icon.tsx` updates every size at once. They're generated at build time, not on each request.

## 3. The service worker

The service worker sees every request the site makes and chooses how to answer it. The choice per kind of request is called a **caching strategy**:

| Request | Strategy | Why |
|---|---|---|
| Pages (HTML) | **Network first**: try the internet; if that fails, use the saved copy; if there isn't one, show `/offline`. | Pages change when content changes, so fresh beats fast. Offline you still get what you've read. |
| `/_next/static/*` (JS, CSS) | **Cache first**: use the saved copy, only fetch if missing. | Next.js puts a content hash in these file names, so a file with a given name never changes. A saved copy is always correct, and instant. |
| Images, icons, fonts | **Stale while revalidate**: answer from the cache now, refresh it in the background for next time. | Fast, and quietly stays up to date. |
| `/me`, `/admin`, `/login`, `/u/`, `/email/`, `/api/*` | **Never cached.** Offline, private pages show `/offline`. | Personal data must not stay on a shared phone, and API answers must be live. |
| Other websites (Supabase, Google Analytics) | **Ignored.** | Not ours to cache. |

Two limits stop the caches growing forever: 60 pages and 120 images. The oldest entries are dropped first.

### The lifecycle: install, activate, fetch

1. **install** runs once per new version. It saves `/offline` and the home page **plus the JavaScript and CSS files they reference**. That last part matters: a saved page without its scripts can't start, and you'd see the error screen instead. We found this in testing.
2. **activate** deletes caches from older versions.
3. **fetch** runs for every request and applies the table above.

### Shipping a change to the service worker

Change `VERSION` in `public/sw.js` (for example `"v2"` to `"v3"`). Browsers check `/sw.js` on every visit; we serve it with `Cache-Control: no-cache` (see `headers()` in `next.config.ts`) so the check always reaches the server. The new version installs, and on activate it throws away every old cache.

Never let `/sw.js` be cached for long. If it is, old visitors can be stuck on an old service worker for days.

## 4. The install button

- **Chrome and Edge** fire a `beforeinstallprompt` event when the site qualifies. `src/components/shell/InstallApp.tsx` keeps that event, hides Chrome's own banner, and shows "Install the app" in the footer. Clicking it calls `event.prompt()`. Each event can only be used once.
- **Safari on iPhone** has no such event, so the footer shows "Add to Home Screen" with the three steps (Share, Add to Home Screen, Add).
- When the site is already running as an installed app (`display-mode: standalone`), the button hides itself.

## 5. Testing it yourself

On your deployed site, in desktop Chrome:

1. Open DevTools, go to the **Application** tab.
   - **Manifest**: shows the name, icons and any install problems.
   - **Service workers**: should say *activated and is running*. "Update on reload" is handy while developing.
   - **Cache storage**: open `cj-pages-v2` to see every saved page.
2. **Try offline**: visit a few pages, then in Application, Service workers, tick **Offline** and reload. Saved pages open; unvisited pages show "You're offline". (The Network tab's Offline switch also works now, but note it doesn't always apply to the service worker's own requests; the Application tab one does.)
3. **Lighthouse** (DevTools, Lighthouse tab): run it on mobile to confirm the site is installable.
4. **On your phone**: Android Chrome shows "Install app" in the menu (and our footer button); iPhone Safari uses Share, then Add to Home Screen.

## Common mistakes (and how this setup avoids them)

- **Service worker in development.** It would cache your half-written code. We only register it in production builds.
- **Caching HTML "cache first".** Visitors would see old pages forever. Pages are network first.
- **Saving a page but not its scripts.** It loads, then crashes. We save the scripts at install time.
- **Caching private pages.** The next person on a shared device sees someone else's data. Private paths are never stored.
- **A long cache on `sw.js`.** Updates get stuck. It's `no-cache`.
- **No HTTPS.** Service workers only work on HTTPS (or localhost). Vercel handles that.

## Files at a glance

```
public/sw.js                              the service worker
src/components/shell/ServiceWorker.tsx    registers it (production only)
src/components/shell/InstallApp.tsx       the install button / iPhone steps
src/app/manifest.ts                       the manifest
src/lib/app-icon.tsx                      draws the icon
src/app/icons/[name]/route.tsx            serves 192/512 and maskable PNGs
src/app/apple-icon.tsx                    iPhone home-screen icon
src/app/(site)/offline/                   the offline page and its list of saved pages
next.config.ts (headers)                  keeps sw.js uncached
```

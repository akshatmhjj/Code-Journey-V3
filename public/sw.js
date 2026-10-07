// Code Journey service worker: makes the site installable and lets visited pages open offline.
//
// How each request is answered:
//   pages (HTML)          network first, fall back to the last saved copy, then the offline page
//   /_next/static/*       cache first: file names include a content hash, so a saved copy is never wrong
//   images, icons, fonts  stale while revalidate: answer from the cache, refresh it in the background
//   private pages, APIs   never cached, so nobody's data stays on a shared device
//
// Bump VERSION to throw away every old cache on the next visit.
const VERSION = "v2";
const PAGES = `cj-pages-${VERSION}`;
const STATIC = `cj-static-${VERSION}`;
const ASSETS = `cj-assets-${VERSION}`;
const OFFLINE_URL = "/offline";
const MAX_PAGES = 60;
const MAX_ASSETS = 120;

const PRIVATE = [/^\/api\//, /^\/me(\/|$)/, /^\/admin/, /^\/login/, /^\/u\//, /^\/email\//];

/**
 * Save a page and the scripts and styles it needs. Without its JavaScript a saved page can't start,
 * so the offline page would show the error screen instead of itself.
 */
async function precache(path) {
  const response = await fetch(path, { cache: "reload" });
  if (!response.ok) return;
  const html = await response.clone().text();
  await (await caches.open(PAGES)).put(path, response);
  const files = [...new Set(html.match(/\/_next\/static\/[^"'\s)]+\.(?:js|css)/g) ?? [])];
  const statics = await caches.open(STATIC);
  await Promise.all(files.map((f) => statics.add(f).catch(() => {})));
}

self.addEventListener("install", (event) => {
  event.waitUntil(Promise.all([precache(OFFLINE_URL), precache("/")]).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("cj-") && !k.endsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Keep a cache from growing forever: drop the oldest entries past the limit. */
async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (const req of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(req);
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      cache.put(request, response.clone()).then(() => trim(PAGES, MAX_PAGES));
    }
    return response;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) || (await cache.match(OFFLINE_URL)) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone()).then(() => trim(ASSETS, MAX_ASSETS));
      return response;
    })
    .catch(() => hit);
  return hit || refresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Supabase, Google Analytics, CDNs: leave alone
  if (PRIVATE.some((re) => re.test(url.pathname))) {
    // Never saved, but offline they still get the friendly offline page instead of the browser's error.
    if (request.mode === "navigate") {
      event.respondWith(fetch(request).catch(async () => (await caches.match(OFFLINE_URL)) || Response.error()));
    }
    return;
  }
  // Next.js page-data requests during in-app navigation: let them through untouched. When offline they
  // fail, and Next falls back to a full page load, which the page rule below then answers from the cache.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  } else if (/\.(png|jpg|jpeg|webp|avif|svg|ico|woff2?)$/.test(url.pathname) || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/_next/image")) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

"use client";

import { useEffect, useState } from "react";

/** Lists pages the service worker has saved, read straight from the browser's cache. */
export function SavedPages() {
  const [pages, setPages] = useState<{ path: string; title: string }[] | null>(null);

  useEffect(() => {
    if (!("caches" in window)) return;
    (async () => {
      const names = (await caches.keys()).filter((k) => k.startsWith("cj-pages-"));
      const seen = new Map<string, string>();
      for (const name of names) {
        const cache = await caches.open(name);
        for (const req of await cache.keys()) {
          const path = new URL(req.url).pathname;
          if (path === "/offline" || seen.has(path)) continue;
          const html = await (await cache.match(req))?.text();
          const title = html?.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/ · Code Journey$/, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'") ?? path;
          seen.set(path, title);
        }
      }
      setPages([...seen].map(([path, title]) => ({ path, title })).sort((a, b) => a.title.localeCompare(b.title)));
    })().catch(() => setPages([]));
  }, []);

  if (!pages?.length) return null;
  return (
    <ul className="mt-8 divide-y divide-line border-y-2 border-ink">
      {pages.map((p) => (
        <li key={p.path}>
          {/* A plain link, so the browser does a full load the service worker can answer from the cache. */}
          <a href={p.path} className="flex items-baseline justify-between gap-4 py-3 font-display text-lg font-semibold hover:underline">
            <span className="min-w-0 truncate">{p.title}</span>
            <span className="shrink-0 font-mono text-[12px] font-normal text-muted">{p.path}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

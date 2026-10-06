"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, CornerDownLeft, MessageCircle, Search } from "lucide-react";
import { Sheet } from "./Sheet";
import { useUI } from "./UIProvider";

export type SearchItem = {
  type: "role" | "skill" | "domain" | "resource" | "term" | "post" | "page";
  title: string;
  sub: string;
  href: string;
  live?: boolean;
  keys?: string;
};

const GROUP: Record<SearchItem["type"], string> = {
  role: "Roles",
  skill: "Skills",
  domain: "Domains",
  resource: "Resources",
  term: "Glossary",
  post: "Blog",
  page: "Pages",
};
const ORDER = Object.keys(GROUP) as SearchItem["type"][];

function score(item: SearchItem, q: string) {
  const t = item.title.toLowerCase();
  const hay = `${t} ${item.keys ?? ""} ${item.sub.toLowerCase()}`;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.split(/[\s/&(),.-]+/).some((w) => w.startsWith(q))) return 60;
  if (hay.includes(q)) return 30;
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1 && words.every((w) => hay.includes(w))) return 20;
  return 0;
}

let cached: SearchItem[] | null = null;

export function CommandPalette() {
  const ui = useUI();
  const router = useRouter();
  const [items, setItems] = useState<SearchItem[]>(cached ?? []);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const open = ui.panel === "search";

  useEffect(() => {
    if (!open || cached) return;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((d: SearchItem[]) => {
        cached = d;
        setItems(d);
      })
      .catch(() => {});
  }, [open]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items.filter((i) => (i.type === "role" && i.live) || i.type === "domain").slice(0, 12);
    return items
      .map((i) => ({ i, s: score(i, query) + (i.live ? 5 : 0) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => ORDER.indexOf(a.i.type) - ORDER.indexOf(b.i.type) || b.s - a.s)
      .reduce<SearchItem[]>((acc, { i }) => {
        if (acc.filter((a) => a.type === i.type).length < 6) acc.push(i);
        return acc;
      }, []);
  }, [items, q]);

  const total = results.length + (q.trim() ? 1 : 0); // +1 = "Ask CJ AI"

  function go(index: number) {
    if (index === results.length) {
      ui.openChat(q.trim());
      return;
    }
    const item = results[index];
    if (!item) return;
    ui.close();
    setQ("");
    if (item.href.startsWith("http")) window.open(item.href, "_blank", "noopener");
    else router.push(item.href);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active);
    }
  }

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let index = -1;
  return (
    <Sheet open={open} onClose={ui.close} label="Search" hideClose>
      <div className="flex items-center gap-3 border-b-2 border-ink px-4">
        <Search size={20} className="shrink-0" />
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKey}
          placeholder="Search a role, skill, tool or term…"
          aria-label="Search"
          aria-controls="search-results"
          aria-activedescendant={`sr-${active}`}
          className="h-16 min-w-0 flex-1 bg-transparent font-display text-xl outline-none placeholder:text-faint"
        />
        <button onClick={ui.close} className="rounded border border-line-strong px-1.5 py-0.5 font-mono text-[11px] text-muted">
          Esc
        </button>
      </div>
      <div ref={listRef} id="search-results" role="listbox" aria-label="Results" className="min-h-0 flex-1 overflow-y-auto p-2">
        {!q.trim() && <p className="px-3 pt-2 pb-1 eyebrow">Popular destinations</p>}
        {ORDER.map((type) => {
          const group = results.filter((r) => r.type === type);
          if (!group.length) return null;
          return (
            <div key={type} className="mb-1">
              {q.trim() && <p className="px-3 pt-3 pb-1 eyebrow">{GROUP[type]}</p>}
              {group.map((r) => {
                index++;
                const i = index;
                const external = r.href.startsWith("http");
                return (
                  <button
                    key={r.type + r.href}
                    id={`sr-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={active === i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(i)}
                    className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left ${
                      active === i ? "bg-ink text-canvas" : ""
                    }`}
                  >
                    <span
                      className={`size-3 shrink-0 rounded-full border-[3px] ${
                        r.live === false ? "border-current opacity-50" : active === i ? "border-canvas bg-accent" : "border-ink bg-accent"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{r.title}</span>
                      <span className={`block truncate text-sm ${active === i ? "opacity-80" : "text-muted"}`}>{r.sub}</span>
                    </span>
                    {external ? <ArrowUpRight size={16} className="shrink-0" /> : active === i && <CornerDownLeft size={16} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          );
        })}
        {q.trim() && (
          <button
            id={`sr-${results.length}`}
            data-index={results.length}
            role="option"
            aria-selected={active === results.length}
            onMouseEnter={() => setActive(results.length)}
            onClick={() => go(results.length)}
            className={`mt-1 flex w-full items-center gap-3 rounded-[var(--radius-md)] border-2 border-dashed border-line-strong px-3 py-3 text-left ${
              active === results.length ? "border-ink bg-ink text-canvas" : ""
            }`}
          >
            <MessageCircle size={18} className="shrink-0" />
            <span className="min-w-0 flex-1 truncate">
              Ask CJ AI: <span className="font-semibold">&ldquo;{q.trim()}&rdquo;</span>
            </span>
          </button>
        )}
        {q.trim() && !results.length && items.length > 0 && (
          <p className="px-3 py-4 text-muted">Nothing on the map matches that yet. Try a broader word, or ask CJ AI.</p>
        )}
      </div>
      <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[11px] text-muted sm:flex">
        <span>↑↓ move</span>
        <span>↵ open</span>
        <span>esc close</span>
      </div>
    </Sheet>
  );
}

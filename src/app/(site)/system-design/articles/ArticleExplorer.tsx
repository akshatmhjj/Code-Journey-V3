"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LEVELS, LEVEL_LABEL, TOPICS, type Level, type Topic } from "@/lib/system-design-meta";
import { LevelBadge } from "@/components/system-design/LevelBadge";

type Item = { id: string; title: string; summary: string; text: string; topic: Topic; level: Level; date: string; pathTitle: string; href: string };

const chip = (on: boolean) => `rounded-full border-2 border-ink px-3 py-1.5 text-sm font-semibold transition-colors ${on ? "bg-ink text-canvas" : "text-muted hover:text-ink"}`;
const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Search, sort and filter over every article. Filters combine, and the count always shows what is left. */
export function ArticleExplorer({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [level, setLevel] = useState<Level | "all">("all");
  const [topic, setTopic] = useState<Topic | "all">("all");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items
      .filter((i) => (level === "all" || i.level === level) && (topic === "all" || i.topic === topic))
      .filter((i) => !needle || i.text.includes(needle))
      .sort((a, b) => (sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [items, q, sort, level, topic]);

  const counts = (key: "level" | "topic", value: string) => items.filter((i) => i[key] === value).length;

  return (
    <div>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="sd-search">
            Search articles
          </label>
          <input
            id="sd-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles, summaries and key ideas"
            className="min-h-11 min-w-0 flex-1 rounded-full border-2 border-ink bg-canvas px-5 text-base"
          />
          <label className="sr-only" htmlFor="sd-sort">
            Sort
          </label>
          <select id="sd-sort" value={sort} onChange={(e) => setSort(e.target.value as "newest" | "oldest")} className="min-h-11 rounded-full border-2 border-ink bg-canvas px-4 text-sm font-semibold">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div role="group" aria-label="Level" className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-xs tracking-wide text-muted uppercase">Level</span>
          <button type="button" aria-pressed={level === "all"} onClick={() => setLevel("all")} className={chip(level === "all")}>
            All
          </button>
          {LEVELS.map((l) => (
            <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)} className={chip(level === l)}>
              {LEVEL_LABEL[l]} <span className="font-mono text-xs opacity-70">{counts("level", l)}</span>
            </button>
          ))}
        </div>

        <div role="group" aria-label="Topic" className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-xs tracking-wide text-muted uppercase">Topic</span>
          <button type="button" aria-pressed={topic === "all"} onClick={() => setTopic("all")} className={chip(topic === "all")}>
            All
          </button>
          {TOPICS.map((t) => (
            <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)} className={chip(topic === t)}>
              {t} <span className="font-mono text-xs opacity-70">{counts("topic", t)}</span>
            </button>
          ))}
        </div>

      </div>

      <p className="mt-8 font-mono text-sm text-muted" aria-live="polite">
        {shown.length} of {items.length} articles
      </p>

      {shown.length === 0 ? (
        <p className="mt-6 max-w-[50ch] text-muted">Nothing matches. Clear the search or a filter to see more.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {shown.map((i) => (
            <li key={i.id} className="py-5">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <LevelBadge level={i.level} />
                    <span className="font-mono text-xs text-muted">
                      {i.topic} · {fmt(i.date)}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-xl leading-snug font-bold">
                    <Link href={i.href} className="hover:underline hover:underline-offset-4">
                      {i.title}
                    </Link>
                  </h2>
                  <p className="mt-1 max-w-[66ch] text-sm leading-relaxed text-muted">{i.summary}</p>
                  <p className="mt-2 font-mono text-xs text-muted">In: {i.pathTitle}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

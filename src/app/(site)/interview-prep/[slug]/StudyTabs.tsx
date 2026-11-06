"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { useReady } from "@/lib/prep-progress";

type Concept = { term: string; def: string; hook?: string; visual?: ReactNode };
type Question = { q: string; a: string; visual?: ReactNode };
type Tab = "concepts" | "questions" | "traps";
type Item = { title: string; body?: string; hook?: string; visual?: ReactNode };

/** One topic in three tabs. Each item is a station on a metro line, the same layout as a System Design line. */
export function StudyTabs({ slug, concepts, questions, traps }: { slug: string; concepts: Concept[]; questions: Question[]; traps: string[] }) {
  const [tab, setTab] = useState<Tab>("concepts");
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "concepts", label: "Concepts", count: concepts.length },
    { id: "questions", label: "Questions", count: questions.length },
    { id: "traps", label: "Traps", count: traps.length },
  ];
  const items: Record<Tab, Item[]> = {
    concepts: concepts.map((c) => ({ title: c.term, body: c.def, hook: c.hook, visual: c.visual })),
    questions: questions.map((q) => ({ title: q.q, body: q.a, visual: q.visual })),
    traps: traps.map((t) => ({ title: t })),
  };

  return (
    <div>
      <div role="tablist" aria-label="Topic sections" className="flex gap-1 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls="study-panel"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-3 font-semibold transition-colors ${tab === t.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {t.label} <span className="font-mono text-xs text-muted">{t.count}</span>
          </button>
        ))}
      </div>
      <div id="study-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-10">
        <Line key={tab} slug={slug} tab={tab} items={items[tab]} />
      </div>
    </div>
  );
}

/** A metro line of stations. The chosen station opens under its name on a phone and in a panel beside the line on desktop. */
function Line({ slug, tab, items }: { slug: string; tab: Tab; items: Item[] }) {
  const { ready, loaded, toggle, reset } = useReady();
  const [selected, setSelected] = useState(0);
  const current = items[selected] ?? items[0];
  const isQuestions = tab === "questions";
  const label = tab === "concepts" ? "Concept" : tab === "questions" ? "Question" : "Trap";
  const ids = items.map((_, n) => `${slug}:${n}`);
  const done = ids.filter((id) => ready.has(id)).length;

  const detail = (it: Item, n: number) => (
    <article className="grid gap-5 rounded-2xl bg-raise p-5 md:p-7">
      <p className="font-mono text-xs tracking-wide text-muted uppercase">
        {label} {n + 1} of {items.length}
      </p>
      <h3 className="font-display text-2xl leading-snug font-bold md:text-3xl">{it.title}</h3>
      {it.body && <p className="max-w-[66ch] leading-relaxed">{it.body}</p>}
      {it.hook && <p className="border-l-4 border-accent pl-4 text-sm font-semibold">Remember: {it.hook}</p>}
      {it.visual && <div className="max-w-lg">{it.visual}</div>}
      {isQuestions && (
        <div>
          <button
            type="button"
            aria-pressed={ready.has(ids[n])}
            onClick={() => toggle(ids[n])}
            className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${ready.has(ids[n]) ? "border-accent bg-accent text-on-accent" : "border-ink hover:bg-canvas"}`}
          >
            <Check className="size-4" aria-hidden /> {ready.has(ids[n]) ? "Ready" : "Mark ready"}
          </button>
        </div>
      )}
    </article>
  );

  return (
    <div>
      {isQuestions && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="font-mono text-muted" aria-live="polite">
            {loaded ? `${done} of ${items.length} ready` : `${items.length} questions`}
          </p>
          <button type="button" disabled={done === 0} onClick={() => reset(ids)} className="font-semibold text-muted underline underline-offset-4 hover:text-ink disabled:opacity-40">
            Reset ticks
          </button>
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start md:gap-12">
        <ol className="relative">
          <span aria-hidden className="absolute top-4 bottom-4 left-[15px] w-1 rounded-full bg-ink" />
          {items.map((it, n) => {
            const on = n === selected;
            return (
              <li key={`${n}-${it.title}`} className="relative pb-4 pl-14 last:pb-0">
                <span aria-hidden className={`absolute top-6 left-[8px] size-[18px] rounded-full border-[3px] border-ink ${on ? "bg-accent" : "bg-canvas"}`} />
                <button
                  type="button"
                  aria-current={on ? "true" : undefined}
                  onClick={() => setSelected(n)}
                  className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition-colors ${on ? "border-ink bg-raise" : "border-line hover:border-ink"}`}
                >
                  <span className="block font-mono text-xs text-muted">{String(n + 1).padStart(2, "0")} · {label}</span>
                  <span className="mt-1.5 block text-lg leading-snug font-semibold">{it.title}</span>
                  {isQuestions && ready.has(ids[n]) && (
                    <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-accent">
                      <Check className="size-3.5" aria-hidden /> Ready
                    </span>
                  )}
                </button>
                {on && <div className="mt-3 md:hidden">{detail(it, n)}</div>}
              </li>
            );
          })}
        </ol>

        <div className="hidden md:sticky md:top-28 md:block">{detail(current, selected)}</div>
      </div>
    </div>
  );
}

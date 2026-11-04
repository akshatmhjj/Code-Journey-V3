"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { useReady } from "@/lib/prep-progress";

type Concept = { term: string; def: string; hook?: string; visual?: ReactNode };
type Question = { q: string; a: string; visual?: ReactNode };
type Tab = "concepts" | "questions" | "traps";
type Item = { title: string; body?: string; hook?: string; visual?: ReactNode };

/** One topic in three tabs. Each tab is a list on the left and the full answer on the right. */
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
      <div id="study-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-6">
        <SplitPane key={tab} slug={slug} tab={tab} items={items[tab]} />
      </div>
    </div>
  );
}

/** The list picks an item and the panel beside it shows it in full. Questions can be ticked once you can answer them out loud. */
function SplitPane({ slug, tab, items }: { slug: string; tab: Tab; items: Item[] }) {
  const { ready, loaded, toggle, reset } = useReady();
  const [i, setI] = useState(0);
  const it = items[i];
  const isQuestions = tab === "questions";
  const ids = items.map((_, n) => `${slug}:${n}`);
  const done = ids.filter((id) => ready.has(id)).length;
  const label = tab === "concepts" ? "Concept" : tab === "questions" ? "Question" : "Trap";

  return (
    <div>
      {isQuestions && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="font-mono text-muted" aria-live="polite">
            {loaded ? `${done} of ${items.length} ready` : `${items.length} questions`}
          </p>
          <button type="button" disabled={done === 0} onClick={() => reset(ids)} className="font-semibold text-muted underline underline-offset-4 hover:text-ink disabled:opacity-40">
            Reset ticks
          </button>
        </div>
      )}
      <div className="grid gap-4 pr-12 md:grid-cols-[17rem_1fr] md:pr-0">
        <ul className="max-h-60 overflow-y-auto rounded-xl border border-line md:max-h-[34rem]">
          {items.map((x, n) => (
            <li key={x.title} className="border-b border-line last:border-b-0">
              <button
                type="button"
                aria-current={n === i}
                onClick={() => setI(n)}
                className={`flex w-full items-start gap-3 border-l-4 px-4 py-3 text-left text-sm transition-colors ${n === i ? "border-accent bg-raise font-semibold" : "border-transparent hover:bg-raise"}`}
              >
                <span className="mt-0.5 font-mono text-xs text-muted">{String(n + 1).padStart(2, "0")}</span>
                <span className="line-clamp-2 min-w-0 flex-1">{x.title}</span>
                {isQuestions && ready.has(ids[n]) && <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-label="Ready" />}
              </button>
            </li>
          ))}
        </ul>

        <article className="min-w-0 rounded-2xl bg-raise p-6 md:p-8">
          <p className="font-mono text-xs tracking-wide text-muted uppercase">
            {label} {i + 1} of {items.length}
          </p>
          <h3 className="mt-3 font-display text-2xl leading-snug font-bold">{it.title}</h3>
          {it.body && <p className="mt-4 max-w-[66ch] leading-relaxed">{it.body}</p>}
          {it.hook && <p className="mt-5 border-l-4 border-accent pl-4 text-sm font-semibold">Remember: {it.hook}</p>}
          {it.visual && <div className="mt-6 max-w-lg">{it.visual}</div>}
          {isQuestions && (
            <button
              type="button"
              aria-pressed={ready.has(ids[i])}
              onClick={() => toggle(ids[i])}
              className={`mt-6 inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${ready.has(ids[i]) ? "border-accent bg-accent text-on-accent" : "border-ink hover:bg-canvas"}`}
            >
              <Check className="size-4" aria-hidden /> {ready.has(ids[i]) ? "Ready" : "Mark ready"}
            </button>
          )}
        </article>
      </div>
    </div>
  );
}

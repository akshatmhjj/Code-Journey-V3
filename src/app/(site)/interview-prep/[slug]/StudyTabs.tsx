"use client";

import { useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useReady } from "@/lib/prep-progress";

type Concept = { term: string; def: string; hook?: string; visual?: ReactNode };
type Question = { q: string; a: string; visual?: ReactNode };
type Tab = "concepts" | "questions" | "traps"
/** One topic, in three tabs: concepts, questions and traps. Only one tab is on screen at a time. */
export function StudyTabs({ slug, concepts, questions, traps }: { slug: string; concepts: Concept[]; questions: Question[]; traps: string[] }) {
  const [tab, setTab] = useState<Tab>("concepts");
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "concepts", label: "Concepts", count: concepts.length },
    { id: "questions", label: "Questions", count: questions.length },
    { id: "traps", label: "Traps", count: traps.length },
  ];

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
        {tab === "concepts" && <ConceptRows concepts={concepts} />}
        {tab === "questions" && <QuestionRows slug={slug} questions={questions} />}
        {tab === "traps" && <TrapRows traps={traps} />}
      </div>
    </div>
  );
}

/** Each concept is one row: the term and its memory hook. Open it for the definition and the picture. */
function ConceptRows({ concepts }: { concepts: Concept[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const allOpen = open.size === concepts.length;
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(concepts.map((_, i) => i)))} className="text-sm font-semibold text-muted underline underline-offset-4 hover:text-ink">
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <ul className="divide-y divide-line border-y border-line pr-12 md:pr-0">
        {concepts.map((c, i) => {
          const isOpen = open.has(i);
          return (
            <li key={c.term}>
              <button type="button" aria-expanded={isOpen} onClick={() => toggle(i)} className="flex w-full items-center gap-4 py-4 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-bold">{c.term}</span>
                  {c.hook && !isOpen && <span className="mt-1 block truncate text-sm text-muted">{c.hook}</span>}
                </span>
                <ChevronDown className={`size-5 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {isOpen && (
                <div className="grid gap-5 pb-6">
                  <p className="max-w-[66ch] leading-relaxed">{c.def}</p>
                  {c.hook && <p className="max-w-[66ch] text-sm font-semibold">Remember: {c.hook}</p>}
                  {c.visual && <div className="max-w-lg">{c.visual}</div>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Questions open one at a time. Tick a question once you can answer it out loud. */
function QuestionRows({ slug, questions }: { slug: string; questions: Question[] }) {
  const { ready, loaded, toggle, reset } = useReady();
  const [open, setOpen] = useState<Set<number>>(new Set());
  const ids = questions.map((_, i) => `${slug}:${i}`);
  const done = ids.filter((id) => ready.has(id)).length;

  const flip = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="font-mono text-muted" aria-live="polite">
          {loaded ? `${done} of ${questions.length} ready` : `${questions.length} questions`}
        </p>
        <button type="button" disabled={done === 0} onClick={() => reset(ids)} className="font-semibold text-muted underline underline-offset-4 hover:text-ink disabled:opacity-40">
          Reset ticks
        </button>
      </div>
      <ol className="divide-y divide-line border-y border-line pr-12 md:pr-0">
        {questions.map((item, i) => {
          const id = ids[i];
          const isReady = ready.has(id);
          const isOpen = open.has(i);
          return (
            <li key={id} className="py-4">
              <div className="flex items-start gap-3">
                <button type="button" aria-expanded={isOpen} onClick={() => flip(i)} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                  <span className="mt-1 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-lg leading-snug font-bold">{item.q}</span>
                </button>
                <button
                  type="button"
                  aria-pressed={isReady}
                  aria-label={isReady ? `Ready: ${item.q}` : `Mark ready: ${item.q}`}
                  onClick={() => toggle(id)}
                  className={`grid size-9 shrink-0 place-items-center rounded-full border-2 transition-colors ${isReady ? "border-accent bg-accent text-on-accent" : "border-line hover:border-ink"}`}
                >
                  {isReady && <Check className="size-4" aria-hidden />}
                </button>
              </div>
              {isOpen && (
                <div className="mt-4 grid gap-5 pl-9">
                  <p className="max-w-[66ch] leading-relaxed">{item.a}</p>
                  {item.visual && <div className="max-w-lg">{item.visual}</div>}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function TrapRows({ traps }: { traps: string[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {traps.map((t) => (
        <li key={t} className="py-4 leading-relaxed">
          {t}
        </li>
      ))}
    </ul>
  );
}

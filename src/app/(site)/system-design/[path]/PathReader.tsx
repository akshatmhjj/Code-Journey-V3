"use client";

import Link from "next/link";
import { useState } from "react";
import type { Level } from "@/lib/system-design-meta";
import { LevelBadge } from "@/components/system-design/LevelBadge";

type Step = {
  id: string;
  title: string;
  href: string;
  topic: string;
  level: Level;
  why: string;
  summary: string;
  points: string[];
  source: string;
  sourceLabel: string;
  needs: { id: string; title: string; href: string }[];
  terms: { id: string; term: string }[];
};

/**
 * One path as a metro line. Each article is a station on the line. The chosen station opens under its
 * name on a phone, and in a panel beside the line on desktop.
 */
export function PathReader({ steps }: { steps: Step[] }) {
  const [selected, setSelected] = useState(steps[0].id);
  const current = steps.find((s) => s.id === selected) ?? steps[0];
  const currentIndex = steps.indexOf(current);

  const detail = (s: Step, n: number) => (
    <article className="grid gap-5 rounded-2xl bg-raise p-5 md:p-7">
      <div>
        <p className="font-mono text-xs tracking-wide text-muted uppercase">
          Stop {n + 1} of {steps.length} · {s.topic}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-snug font-bold md:text-3xl">{s.title}</h3>
        <p className="mt-3 leading-relaxed text-muted">{s.why}</p>
      </div>
      <p className="leading-relaxed">{s.summary}</p>
      <ul className="grid list-disc gap-2 pl-5 text-[15px] leading-relaxed">
        {s.points.map((pt) => (
          <li key={pt}>{pt}</li>
        ))}
      </ul>
      {s.needs.length > 0 && (
        <p className="text-sm">
          <span className="font-semibold">Read first: </span>
          {s.needs.map((x, k) => (
            <span key={x.id}>
              {k > 0 && ", "}
              <Link href={x.href} className="underline underline-offset-4 hover:text-accent">
                {x.title}
              </Link>
            </span>
          ))}
        </p>
      )}
      {s.terms.length > 0 && (
        <p className="text-sm text-muted">
          Terms:{" "}
          {s.terms.map((t, k) => (
            <span key={t.id}>
              {k > 0 && ", "}
              <Link href={`/system-design/glossary#${t.id}`} className="underline underline-offset-4 hover:text-ink">
                {t.term}
              </Link>
            </span>
          ))}
        </p>
      )}
      <div>
        <Link href={s.href} className="btn btn-line">
          Open this stop
        </Link>
      </div>
    </article>
  );

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start md:gap-12">
      <ol className="relative">
        <span aria-hidden className="absolute top-4 bottom-4 left-[15px] w-1 rounded-full bg-ink" />
        {steps.map((s, i) => {
          const on = s.id === current.id;
          return (
            <li key={s.id} className="relative pb-4 pl-14 last:pb-0">
              <span aria-hidden className={`absolute top-6 left-[8px] size-[18px] rounded-full border-[3px] border-ink ${on ? "bg-accent" : "bg-canvas"}`} />
              <button
                type="button"
                aria-current={on ? "true" : undefined}
                onClick={() => setSelected(s.id)}
                className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition-colors ${on ? "border-ink bg-raise" : "border-line hover:border-ink"}`}
              >
                <span className="block font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")} · {s.topic}
                </span>
                <span className="mt-1.5 block text-lg leading-snug font-semibold">{s.title}</span>
                <span className="mt-1 block">
                  <LevelBadge level={s.level} />
                </span>
              </button>
              {on && <div className="mt-3 md:hidden">{detail(s, i)}</div>}
            </li>
          );
        })}
      </ol>

      <div className="hidden md:sticky md:top-28 md:block">{detail(current, currentIndex)}</div>
    </div>
  );
}

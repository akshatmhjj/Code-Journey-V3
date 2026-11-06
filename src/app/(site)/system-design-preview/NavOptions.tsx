"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, List } from "lucide-react";

type Stop = { id: string; title: string; href: string; topic: string };
type Props = { line: { title: string; slug: string }; stops: Stop[]; current: Stop; summary: string; points: string[] };

const OPTIONS = [
  { id: "a", name: "A · Back link", note: "A small back link to the line above the title, and the stop position in plain text. Nothing else competes with the article." },
  { id: "b", name: "B · Bottom bar", note: "A bar pinned to the bottom of the screen with previous, the stop count and next. Thumbs reach it on a phone." },
  { id: "c", name: "C · Stop list", note: "A list of every stop beside the article on desktop. On a phone it becomes one button that opens the list." },
  { id: "d", name: "D · Line progress", note: "A thin line of dots under the header, one per stop. The current stop is filled. Tap any dot to jump." },
] as const;

const pill = (on: boolean) => `rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition-colors ${on ? "bg-ink text-canvas" : "text-muted hover:text-ink"}`;

export function NavOptions(props: Props) {
  const [v, setV] = useState<(typeof OPTIONS)[number]["id"]>("a");
  return (
    <div className="wrap pt-10 pb-28 md:pt-14">
      <p className="eyebrow mb-4">Preview only · pick a navigation</p>
      <div role="tablist" aria-label="Navigation option" className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button key={o.id} type="button" role="tab" aria-selected={v === o.id} onClick={() => setV(o.id)} className={pill(v === o.id)}>
            {o.name}
          </button>
        ))}
      </div>
      <p className="mt-3 max-w-[60ch] text-sm text-muted">{OPTIONS.find((o) => o.id === v)!.note}</p>
      <div className="mt-8 border-t border-line pt-8">
        {v === "a" && <BackLink {...props} />}
        {v === "b" && <BottomBar {...props} />}
        {v === "c" && <StopList {...props} />}
        {v === "d" && <LineProgress {...props} />}
      </div>
    </div>
  );
}

function Article({ props, index }: { props: Props; index: number }) {
  const stop = props.stops[index];
  return (
    <article className="mx-auto max-w-4xl">
      <p className="font-mono text-xs tracking-wide text-muted uppercase">
        {stop.topic} · Stop {index + 1} of {props.stops.length}
      </p>
      <h2 className="mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl">{stop.title}</h2>
      <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">{props.summary}</p>
      <ul className="mt-8 grid list-disc gap-3 pl-6 text-lg leading-relaxed">
        {props.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </article>
  );
}

/* A · Back link: one quiet line above the title. */
function BackLink(props: Props) {
  return (
    <div>
      <Link href={`/system-design/${props.line.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> {props.line.title}
      </Link>
      <div className="mt-8">
        <Article props={props} index={0} />
      </div>
    </div>
  );
}

/* B · Bottom bar: prev, position and next, pinned to the bottom. */
function BottomBar(props: Props) {
  const [i, setI] = useState(0);
  const pct = ((i + 1) / props.stops.length) * 100;
  return (
    <div>
      <Article props={props} index={i} />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-canvas/95 backdrop-blur">
        <div className="h-1 bg-line">
          <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <div className="wrap flex items-center justify-between gap-3 py-3">
          <button type="button" disabled={i === 0} onClick={() => setI((x) => x - 1)} className="btn btn-line min-h-11 px-4 disabled:opacity-40">
            <ArrowLeft className="size-4" aria-hidden /> Prev
          </button>
          <span className="truncate font-mono text-sm">
            {i + 1} / {props.stops.length} · {props.line.title}
          </span>
          <button type="button" disabled={i === props.stops.length - 1} onClick={() => setI((x) => x + 1)} className="btn btn-ink min-h-11 px-4 disabled:opacity-40">
            Next <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

/* C · Stop list: a sidebar on desktop, one button on phones. */
function StopList(props: Props) {
  const [open, setOpen] = useState(false);
  const current = 0;
  const list = (
    <ol className="grid gap-1">
      {props.stops.map((s, n) => (
        <li key={s.id}>
          <Link href={s.href} aria-current={n === current ? "true" : undefined} className={`grid grid-cols-[2rem_1fr] gap-2 rounded-lg px-3 py-2 text-sm ${n === current ? "bg-raise font-semibold" : "text-muted hover:text-ink"}`}>
            <span className="font-mono text-xs">{String(n + 1).padStart(2, "0")}</span>
            <span className="leading-snug">{s.title}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
  return (
    <div>
      <div className="mb-6 lg:hidden">
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="btn btn-line w-full justify-between">
          <span className="inline-flex items-center gap-2">
            <List className="size-4" aria-hidden /> All stops in {props.line.title}
          </span>
          <span className="font-mono text-xs">{current + 1} / {props.stops.length}</span>
        </button>
        {open && <div className="mt-3 rounded-2xl border-2 border-ink p-3">{list}</div>}
      </div>
      <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <aside className="hidden lg:sticky lg:top-28 lg:block">
          <p className="mb-3 font-mono text-xs tracking-wide text-muted uppercase">{props.line.title}</p>
          {list}
        </aside>
        <Article props={props} index={current} />
      </div>
    </div>
  );
}

/* D · Line progress: dots under the header, one per stop. */
function LineProgress(props: Props) {
  const current = 0;
  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
        <ol className="flex min-w-max items-center">
          {props.stops.map((s, n) => (
            <li key={s.id} className="flex items-center">
              {n > 0 && <span aria-hidden className="h-[3px] w-6 bg-ink md:w-10" />}
              <Link href={s.href} aria-label={`Stop ${n + 1}: ${s.title}`} aria-current={n === current ? "true" : undefined} className={`grid size-8 place-items-center rounded-full border-[3px] border-ink font-mono text-xs font-bold ${n === current ? "bg-accent text-on-accent" : n < current ? "bg-ink text-canvas" : "bg-canvas"}`}>
                {n + 1}
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <p className="mb-8 font-mono text-xs text-muted">{props.line.title} · stop {current + 1} of {props.stops.length}</p>
      <Article props={props} index={current} />
    </div>
  );
}

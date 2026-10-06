"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Departure = { dest: string; code: string; live: boolean; href: string };

const WIDTH = 21;
const ROWS = 5;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/-";

const pad = (s: string) => s.slice(0, WIDTH).padEnd(WIDTH, " ");

/** Split-flap characters: letters that change scramble briefly, then settle left to right. */
function useFlap(target: string, still: boolean) {
  const [shown, setShown] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    if (still || prev.current === target) {
      prev.current = target;
      setShown(target);
      return;
    }
    const from = prev.current;
    prev.current = target;
    const settle = [...target].map((c, i) => (c === from[i] ? 0 : 3 + i * 0.6 + Math.random() * 4));
    let tick = 0;
    const id = setInterval(() => {
      tick++;
      setShown([...target].map((c, i) => (tick >= settle[i] ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""));
      if (tick > Math.max(...settle)) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [target, still]);
  return shown;
}

function Tiles({ text, still }: { text: string; still: boolean }) {
  const shown = useFlap(text, still);
  return (
    <span className="flex gap-px" aria-hidden="true">
      {[...shown].map((c, i) => (
        <span
          key={i}
          className="relative grid h-[1.75em] w-[1.1em] place-items-center rounded-[2px] bg-[color-mix(in_oklab,var(--ink)_10%,var(--canvas))] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-canvas"
        >
          {c}
        </span>
      ))}
    </span>
  );
}

/** Departures board listing every role, rolling one row at a time. */
export function DepartureBoard({ departures }: { departures: Departure[] }) {
  const [start, setStart] = useState(0);
  const [clock, setClock] = useState("--:--");
  const [still, setStill] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStill(reduce);
    const time = () => setClock(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    time();
    const c = setInterval(time, 15_000);
    const r = reduce ? undefined : setInterval(() => setStart((s) => (s + 1) % departures.length), 3800);
    return () => {
      clearInterval(c);
      if (r) clearInterval(r);
    };
  }, [departures.length]);

  const rows = Array.from({ length: ROWS }, (_, i) => departures[(start + i) % departures.length]);

  return (
    <div className="rounded-[var(--radius-lg)] border-2 border-line-strong p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between font-mono text-[12px] tracking-[0.14em] uppercase">
        <span className="flex items-center gap-2 font-bold">
          <span className="size-2 animate-pulse rounded-full bg-accent motion-reduce:animate-none" /> Departures
        </span>
        <span className="tabular-nums text-muted" suppressHydrationWarning>
          {clock}
        </span>
      </div>
      <ul className="grid gap-2 font-mono text-[11px] font-semibold sm:text-[14px]">
        {rows.map((d, i) => (
          <li key={i}>
            <Link href={d.href} className="group flex items-center gap-3" aria-label={`${d.dest}, ${d.live ? "boarding now" : "being mapped"}`}>
              <span className="hidden w-[3.2em] shrink-0 rounded-[3px] bg-ink py-1 text-center text-[0.85em] text-canvas sm:block">{d.code}</span>
              <Tiles text={pad(d.dest)} still={still} />
              <span
                className={`ml-auto hidden shrink-0 rounded-full px-2 py-0.5 text-[0.78em] tracking-wider lg:inline ${
                  d.live ? "bg-accent text-on-accent" : "border border-line-strong text-muted"
                }`}
              >
                {d.live ? "BOARDING" : "MAPPING"}
              </span>
              <span aria-hidden="true" className={`ml-auto size-2.5 shrink-0 rounded-full lg:hidden ${d.live ? "bg-accent" : "border border-line-strong"}`} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useUI } from "./UIProvider";

/** A perforated one-way ticket that opens route search. */
export function Ticket() {
  const ui = useUI();
  return (
    <button
      onClick={() => ui.open("search")}
      className="group relative flex w-full overflow-hidden rounded-[var(--radius-md)] bg-accent text-left text-on-accent transition-transform hover:-rotate-1"
    >
      {/* punched notches */}
      <span aria-hidden="true" className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-canvas" />
      <span aria-hidden="true" className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-canvas" />
      <span className="flex-1 px-7 py-5">
        <span className="block font-mono text-[11px] font-bold tracking-[0.16em] uppercase">One way · any destination</span>
        <span className="mt-1 block font-display text-[1.75rem] leading-none font-bold tracking-[-0.02em]">Find my route</span>
        <span className="mt-2 block text-[14px] font-semibold">Fare: free. Always.</span>
      </span>
      <span className="flex w-24 shrink-0 flex-col items-center justify-center border-l-2 border-dashed border-on-accent/50 px-3 font-mono text-[11px] font-bold tracking-wider uppercase">
        <span>Admit</span>
        <span className="font-display text-3xl leading-none">1</span>
      </span>
    </button>
  );
}

"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useUI } from "./UIProvider";

export function HeroSearch({ chips }: { chips: { title: string; href: string }[] }) {
  const ui = useUI();
  return (
    <div className="mt-9 max-w-2xl">
      <button
        onClick={() => ui.open("search")}
        className="flex h-16 w-full items-center gap-4 rounded-full border-[3px] border-ink bg-canvas pr-2 pl-6 text-left shadow-[5px_5px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
      >
        <Search size={22} className="shrink-0" />
        <span className="min-w-0 flex-1 truncate font-display text-lg text-muted md:text-xl">I want to become a…</span>
        <span className="btn btn-accent hidden sm:inline-flex">Find my route</span>
      </button>
      <Link href="/compass" className="mt-4 inline-flex items-center gap-2 font-semibold underline decoration-accent decoration-2 underline-offset-4">
        Not sure yet? Take the 2-minute Compass quiz
      </Link>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">Popular:</span>
        {chips.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-full border-2 border-line px-3 py-1 text-[15px] font-medium hover:border-ink">
            {c.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

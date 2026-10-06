"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type Term = { term: string; slug: string; category: string; definition: string };

export function GlossaryBrowser({ terms }: { terms: Term[] }) {
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    return query ? terms.filter((t) => `${t.term} ${t.definition}`.toLowerCase().includes(query)) : terms;
  }, [terms, q]);
  const letters = useMemo(() => [...new Set(shown.map((t) => t.term[0].toUpperCase()))], [shown]);

  return (
    <>
      <div className="sticky top-[var(--header-h)] z-20 -mx-4 flex flex-wrap items-center gap-4 border-b border-line bg-canvas px-4 py-3 sm:mx-0 sm:px-0">
        <label className="flex h-11 w-full max-w-sm items-center gap-2 rounded-full border-2 border-ink px-4">
          <Search size={17} />
          <span className="sr-only">Search the glossary</span>
          <input id="gl-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint" />
        </label>
        <nav aria-label="Letters" className="flex flex-wrap gap-1 font-mono text-sm">
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`} className="grid size-8 place-items-center rounded-full hover:bg-ink hover:text-canvas">
              {l}
            </a>
          ))}
        </nav>
      </div>
      {letters.map((l) => (
        <section key={l} id={`letter-${l}`} className="grid gap-x-8 border-b-2 border-ink py-8 md:grid-cols-[80px_1fr]">
          <h2 className="font-display text-5xl font-bold">{l}</h2>
          <dl className="grid gap-6 md:grid-cols-2">
            {shown
              .filter((t) => t.term[0].toUpperCase() === l)
              .map((t) => (
                <div key={t.slug} className="min-w-0">
                  <dt>
                    <Link href={`/glossary/${t.slug}`} className="font-display text-xl font-bold hover:underline">
                      {t.term}
                    </Link>
                    <span className="ml-2 font-mono text-[11px] tracking-wide text-muted uppercase">{t.category}</span>
                  </dt>
                  <dd className="mt-1.5 line-clamp-3 text-muted">{t.definition}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
      {!shown.length && <p className="py-12 text-center text-muted">No term matches &ldquo;{q}&rdquo;. Try CJ AI from the search bar.</p>}
    </>
  );
}

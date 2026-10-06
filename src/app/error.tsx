"use client";

import Link from "next/link";
import { useEffect } from "react";

// Catches crashes anywhere under the root layout, including the site shell, so it renders without the header.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="wrap grid min-h-[100dvh] content-center py-20">
      <p className="eyebrow">Signal failure</p>
      <h1 className="mt-5 max-w-[14ch] text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] font-bold tracking-[-0.045em]">Something stopped the train.</h1>
      <svg aria-hidden="true" viewBox="0 0 600 40" className="mt-10 h-10 w-full max-w-xl">
        <path d="M10 20H300" stroke="var(--ink)" strokeWidth="7" />
        <path d="M300 20H590" stroke="var(--ink)" strokeWidth="7" strokeDasharray="6 10" />
        <circle cx="300" cy="20" r="11" fill="var(--accent)" stroke="var(--ink)" strokeWidth="4" />
        <circle cx="10" cy="20" r="8" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="4" />
      </svg>
      <p className="mt-8 max-w-[50ch] text-lg text-muted">That&apos;s a bug on our side, not something you did. Try again - if it keeps happening, let us know what you clicked.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={reset} className="btn btn-accent">
          Try again
        </button>
        <Link href="/" className="btn btn-line">
          Back to the map
        </Link>
      </div>
      {error.digest && <p className="mt-8 font-mono text-[12px] text-faint">Ref {error.digest}</p>}
    </main>
  );
}

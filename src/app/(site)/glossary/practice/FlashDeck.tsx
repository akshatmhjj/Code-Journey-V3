"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Shuffle } from "lucide-react";

type Term = { term: string; slug: string; category: string; definition: string };

const KEY = "cj-flash-known";

/** Reads the terms this device has marked as known. Storage can be blocked, so every access is guarded. */
function readKnown(): Set<string> {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function writeKnown(known: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...known]));
  } catch {
    /* storage blocked: the progress still works for this visit */
  }
}

/** Flashcards for the glossary. Progress stays on this device; nothing is sent to the server. */
export function FlashDeck({ terms }: { terms: Term[] }) {
  // Known terms load after the first paint, so the server and the browser render the same page first.
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [order, setOrder] = useState<Term[]>(terms);
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setKnown(readKnown());
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const deck = useMemo(() => (onlyUnknown ? order.filter((t) => !known.has(t.slug)) : order), [order, onlyUnknown, known]);
  const card = deck[Math.min(index, deck.length - 1)];
  const knownCount = terms.filter((t) => known.has(t.slug)).length;
  const percent = terms.length ? Math.round((knownCount / terms.length) * 100) : 0;

  const go = (step: number) => {
    setFlipped(false);
    setIndex((i) => Math.max(0, Math.min(deck.length - 1, i + step)));
  };

  const markKnown = () => {
    if (!card) return;
    const next = new Set(known).add(card.slug);
    setKnown(next);
    writeKnown(next);
    setFlipped(false);
    // In "unknown only" mode the deck shrinks, so the next card slides into this position.
    if (!onlyUnknown) setIndex((i) => Math.min(deck.length - 1, i + 1));
  };

  const reset = () => {
    setKnown(new Set());
    writeKnown(new Set());
    setIndex(0);
    setFlipped(false);
  };

  const shuffle = () => {
    setOrder((o) => [...o].sort(() => Math.random() - 0.5));
    setIndex(0);
    setFlipped(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <div className="grid gap-8" onKeyDown={onKey}>
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="font-semibold">
            {loaded ? `${knownCount} of ${terms.length} known` : `${terms.length} terms`}
          </span>
          <span className="text-muted">
            {deck.length ? `Card ${Math.min(index, deck.length - 1) + 1} of ${deck.length}` : "Nothing left in this deck"}
          </span>
        </div>
        <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {card ? (
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={flipped ? `${card.term}: definition shown. Activate to show the term.` : `${card.term}: activate to show the definition.`}
          className="relative grid min-h-[280px] w-full cursor-pointer place-items-center rounded-[var(--radius-lg)] border-2 border-ink bg-canvas p-8 text-center transition-shadow hover:shadow-[6px_6px_0_var(--ink)] md:min-h-[340px] md:p-14"
        >
          <span
            aria-hidden="true"
            className={`col-start-1 row-start-1 grid max-w-[40ch] gap-4 transition-opacity duration-300 ${flipped ? "opacity-0" : "opacity-100"}`}
          >
            <span className="eyebrow">{card.category}</span>
            <span className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-bold tracking-[-0.03em]">{card.term}</span>
            <span className="text-sm text-muted">Tap to see the meaning</span>
          </span>
          <span
            aria-hidden="true"
            className={`col-start-1 row-start-1 grid max-w-[52ch] gap-4 transition-opacity duration-300 ${flipped ? "opacity-100" : "opacity-0"}`}
          >
            <span className="eyebrow">{card.term}</span>
            <span className="text-lg leading-relaxed md:text-xl">{card.definition}</span>
          </span>
          <span className="sr-only">{flipped ? card.definition : card.category}</span>
        </button>
      ) : (
        <div className="grid min-h-[280px] place-items-center rounded-[var(--radius-lg)] border-2 border-ink p-8 text-center">
          <div className="grid max-w-[44ch] gap-4">
            <p className="font-display text-3xl font-bold">You know every term in this deck.</p>
            <p className="text-muted">Reset to start again, or turn off &ldquo;only unknown&rdquo; to go through them all.</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => go(-1)} disabled={index === 0} className="btn btn-line disabled:opacity-40">
          <ArrowLeft size={17} aria-hidden="true" /> Previous
        </button>
        <button type="button" onClick={markKnown} disabled={!card} className="btn btn-accent disabled:opacity-40">
          <Check size={17} aria-hidden="true" /> I know this
        </button>
        <button type="button" onClick={() => go(1)} disabled={!deck.length || index >= deck.length - 1} className="btn btn-line disabled:opacity-40">
          Still learning <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t-2 border-ink pt-6 text-[15px]">
        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={onlyUnknown}
            onChange={(e) => {
              setOnlyUnknown(e.target.checked);
              setIndex(0);
              setFlipped(false);
            }}
            className="size-5 accent-[var(--ink)]"
          />
          <span className="font-semibold">Only the terms I don&apos;t know yet</span>
        </label>
        <button type="button" onClick={shuffle} className="inline-flex min-h-11 items-center gap-2 font-semibold hover:underline">
          <Shuffle size={16} aria-hidden="true" /> Shuffle
        </button>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 font-semibold text-muted hover:text-ink hover:underline">
          <RotateCcw size={16} aria-hidden="true" /> Reset progress
        </button>
        <Link href="/glossary" className="ml-auto font-semibold hover:underline">
          Back to the glossary
        </Link>
      </div>
      <p className="text-sm text-muted">Use the left and right arrow keys to move between cards. Progress is saved on this device only.</p>
    </div>
  );
}

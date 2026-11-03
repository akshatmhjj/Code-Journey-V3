"use client";

import { useState } from "react";
import { VisualFrame } from "./VisualFrame";

const ROOT = [20, 40];
const LEAVES = [
  [5, 10, 15],
  [25, 30, 35],
  [45, 50, 60],
];

/** Walk a B-tree: at each node, compare the key and pick the child that can hold it. */
function lookup(key: number) {
  const steps: string[] = [];
  const childIndex = ROOT.filter((k) => key >= k).length;
  const dir = ["left", "middle", "right"][childIndex];
  steps.push(`Root holds ${ROOT.join(" and ")}. ${key} is ${childIndex === 0 ? "below 20" : childIndex === 1 ? "between 20 and 40" : "40 or above"}, so go ${dir}.`);
  const leaf = LEAVES[childIndex];
  const found = leaf.includes(key);
  steps.push(found ? `The ${dir} leaf holds ${key}. Found it.` : `The ${dir} leaf does not hold ${key}. Not in the index.`);
  return { childIndex, found, steps };
}

/** A small B-tree. Pick a key and see the path it takes from the root to a leaf. */
export function BTreeLookup() {
  const [key, setKey] = useState(30);
  const { childIndex, found, steps } = lookup(key);
  const keys = [5, 30, 50, 42];

  return (
    <VisualFrame title="How an index finds a row" hint="A B-tree keeps keys sorted in wide nodes. Each step down the tree cuts the search space, so a lookup takes only a few steps even for millions of rows.">
      <div className="cj-visual">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Key to look up">
          {keys.map((k) => (
            <button key={k} type="button" aria-pressed={key === k} onClick={() => setKey(k)} className={`btn min-h-10 px-4 text-sm ${key === k ? "btn-ink" : "btn-line"}`}>
              Find {k}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6">
          <div className="flex justify-center gap-2">
            {ROOT.map((k) => (
              <div key={`root-${k}`} className="rounded-lg border-2 border-ink bg-raise px-4 py-2 font-mono font-bold">
                {k}
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {LEAVES.map((leaf, i) => {
              const active = i === childIndex;
              return (
                <div key={leaf.join("-")} className={`rounded-xl border-2 p-3 transition-colors ${active ? "border-accent bg-accent/10" : "border-line"}`}>
                  <p className="font-mono text-xs text-muted uppercase">{["left", "middle", "right"][i]} leaf</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {leaf.map((k) => (
                      <span
                        key={k}
                        className={`rounded-md px-2 py-1 font-mono text-sm font-bold ${active && k === key ? "bg-accent text-on-accent" : "bg-raise"}`}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ol className="mt-6 grid gap-2 rounded-xl bg-raise p-5 text-sm leading-relaxed">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="mt-3 font-display text-lg font-bold">{found ? `${key} is found in ${steps.length} steps.` : `${key} is not in the index.`}</p>
      </div>
    </VisualFrame>
  );
}

const LEVELS = [
  { level: "Read uncommitted", dirty: true, repeat: true, phantom: true },
  { level: "Read committed", dirty: false, repeat: true, phantom: true },
  { level: "Repeatable read", dirty: false, repeat: false, phantom: true },
  { level: "Serializable", dirty: false, repeat: false, phantom: false },
];

/** Each isolation level closes more doors. Red cells are the problems that level still allows. */
export function IsolationMatrix() {
  const [hover, setHover] = useState<number | null>(null);
  const mark = (bad: boolean) => (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${bad ? "bg-accent text-on-accent" : "border-2 border-ink"}`}>
      {bad ? "possible" : "prevented"}
    </span>
  );
  return (
    <VisualFrame title="Isolation levels and what they allow" hint="Go down the table: each level keeps the protection of the one above and adds one more. Hover a row to focus it.">
      <div className="cj-visual overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="font-mono text-xs tracking-wide text-muted uppercase">
              <th className="px-4 py-2">Isolation level</th>
              <th className="px-4 py-2">Dirty read</th>
              <th className="px-4 py-2">Non-repeatable read</th>
              <th className="px-4 py-2">Phantom read</th>
            </tr>
          </thead>
          <tbody>
            {LEVELS.map((row, i) => (
              <tr
                key={row.level}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={`transition-colors ${hover === i ? "bg-raise" : ""}`}
              >
                <td className="rounded-l-xl border-y-2 border-l-2 border-ink px-4 py-3 font-display text-lg font-bold">{row.level}</td>
                <td className="border-y-2 border-ink px-4 py-3">{mark(row.dirty)}</td>
                <td className="border-y-2 border-ink px-4 py-3">{mark(row.repeat)}</td>
                <td className="rounded-r-xl border-y-2 border-r-2 border-ink px-4 py-3">{mark(row.phantom)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-muted">A dirty read sees data another transaction has not committed. A non-repeatable read sees a row change between two reads. A phantom read sees new rows appear. The standard allows phantoms at repeatable read. Some databases, PostgreSQL included, also block them there.</p>
      </div>
    </VisualFrame>
  );
}

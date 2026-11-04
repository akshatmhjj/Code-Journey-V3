"use client";

import { useState } from "react";
import { GRAPH, bfsOrder, dfsOrder } from "@/lib/traversal";
import { VisualFrame, motionStyles, toggleClass } from "./VisualFrame";

const CURVES = [
  { id: "1", label: "O(1)", color: "stroke-support", f: () => 1 },
  { id: "logn", label: "O(log n)", color: "stroke-muted", f: (n: number) => Math.log2(n) },
  { id: "n", label: "O(n)", color: "stroke-ink", f: (n: number) => n },
  { id: "nlogn", label: "O(n log n)", color: "stroke-accent", f: (n: number) => n * Math.log2(n) },
  { id: "n2", label: "O(n²)", color: "stroke-accent", f: (n: number) => n * n },
];

const MAX_N = 30;
const MAX_Y = 900;
const W = 600;
const H = 300;
const px = (n: number) => 50 + ((n - 1) / (MAX_N - 1)) * (W - 70);
const py = (v: number) => H - 30 - Math.min(v, MAX_Y) / MAX_Y * (H - 50);

/** How the number of steps grows with the input. Toggle curves on and off, and watch O(n²) leave the chart. */
export function BigOChart() {
  const [on, setOn] = useState<Record<string, boolean>>({ "1": true, logn: true, n: true, nlogn: true, n2: true });
  const shown = CURVES.filter((c) => on[c.id]);
  return (
    <VisualFrame title="How the work grows with input size" hint="Read the shape, not the numbers. A flat line stays cheap. A curve that bends up gets expensive fast.">
      <style>{`@keyframes cj-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }${motionStyles}`}</style>
      <div className="cj-visual">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Curves to show">
          {CURVES.map((c) => (
            <button key={c.id} type="button" aria-pressed={!!on[c.id]} onClick={() => setOn((s) => ({ ...s, [c.id]: !s[c.id] }))} className={toggleClass(!!on[c.id])}>
              {c.label}
            </button>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full" role="img" aria-label="Chart of work against input size for several Big-O classes">
          <line x1="50" y1={H - 30} x2={W - 20} y2={H - 30} className="stroke-ink" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2={H - 30} className="stroke-ink" strokeWidth="2" />
          <text x={W - 20} y={H - 8} textAnchor="end" className="fill-muted" fontSize="13">input size n</text>
          <text x="54" y="16" className="fill-muted" fontSize="13">work</text>
          {shown.map((c) => {
            const points = Array.from({ length: MAX_N }, (_, i) => i + 1)
              .map((n) => `${px(n)},${py(c.f(n))}`)
              .join(" ");
            return (
              <polyline
                key={c.id}
                points={points}
                pathLength={1}
                fill="none"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeDasharray="1"
                className={c.color}
                style={{ animation: "cj-draw 900ms ease-out both" }}
              />
            );
          })}
        </svg>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          {shown.map((c) => (
            <span key={c.id} className="font-mono">{c.label}</span>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink font-mono text-xs tracking-wide uppercase">
                <th className="py-2 pr-4">Class</th>
                <th className="py-2 pr-4">n = 10</th>
                <th className="py-2 pr-4">n = 100</th>
                <th className="py-2">n = 1,000</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["O(1)", "1", "1", "1"],
                ["O(log n)", "3", "7", "10"],
                ["O(n)", "10", "100", "1,000"],
                ["O(n log n)", "33", "664", "9,966"],
                ["O(n²)", "100", "10,000", "1,000,000"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-line">
                  <td className="py-2 pr-4 font-bold">{row[0]}</td>
                  <td className="py-2 pr-4">{row[1]}</td>
                  <td className="py-2 pr-4">{row[2]}</td>
                  <td className="py-2">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </VisualFrame>
  );
}

const SORTED = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const TARGET = 23;

/** The search steps for binary search: each step checks the middle and throws half the array away. */
function bsSteps(arr: number[], target: number) {
  const out: { lo: number; hi: number; mid: number; found: boolean; goRight: boolean | null }[] = [];
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const found = arr[mid] === target;
    const goRight = found ? null : arr[mid] < target;
    out.push({ lo, hi, mid, found, goRight });
    if (found) break;
    if (goRight) lo = mid + 1;
    else hi = mid - 1;
  }
  return out;
}

/** Binary search on a sorted array. Step through and watch the search range halve. */
export function BinarySearchSteps() {
  const steps = bsSteps(SORTED, TARGET);
  const [step, setStep] = useState(0);
  const cur = steps[Math.min(step, steps.length - 1)];
  const finished = step >= steps.length - 1;
  return (
    <VisualFrame title="Binary search: halve, then halve again" hint={`Find ${TARGET} in a sorted list. Each step checks the middle and drops the half that cannot hold it.`}>
      <div className="cj-visual">
        <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
          {SORTED.map((v, i) => {
            const inRange = i >= cur.lo && i <= cur.hi;
            const isMid = i === cur.mid;
            return (
              <div key={v} className="flex flex-col items-center gap-1">
                <span className="h-5 font-mono text-xs text-muted">{isMid ? "mid" : i === cur.lo ? "lo" : i === cur.hi ? "hi" : ""}</span>
                <div
                  className={`grid h-14 w-full place-items-center rounded-lg border-2 font-mono font-bold transition-colors duration-300 ${
                    isMid ? (cur.found ? "border-accent bg-accent text-on-accent" : "border-ink bg-ink text-canvas") : inRange ? "border-ink bg-raise" : "border-line text-faint"
                  }`}
                >
                  {v}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 min-h-[3rem] rounded-xl bg-raise p-5 text-lg leading-relaxed">
          {cur.found
            ? `Found ${TARGET} at position ${cur.mid} after ${step + 1} steps.`
            : `Middle is ${SORTED[cur.mid]}. ${TARGET} is ${cur.goRight ? "bigger, so drop the left half" : "smaller, so drop the right half"}.`}
        </p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setStep(0)} className="btn btn-line min-h-10 px-4 text-sm">Restart</button>
          <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="btn btn-line min-h-10 px-4 text-sm disabled:opacity-40">Back</button>
          <button type="button" disabled={finished} onClick={() => setStep((s) => s + 1)} className="btn btn-line min-h-10 px-4 text-sm disabled:opacity-40">Next step</button>
        </div>
      </div>
    </VisualFrame>
  );
}

const POS: Record<string, [number, number]> = {
  A: [200, 40],
  B: [110, 120],
  C: [290, 120],
  D: [50, 210],
  E: [170, 210],
  F: [290, 210],
};

/** BFS and DFS on the same graph. BFS ripples out level by level, DFS dives down one branch first. */
export function GraphTraversal() {
  const [mode, setMode] = useState<"bfs" | "dfs">("bfs");
  const [step, setStep] = useState(0);
  const order = mode === "bfs" ? bfsOrder("A") : dfsOrder("A");
  const visited = order.slice(0, step);
  const current = visited.at(-1);
  const pick = (m: "bfs" | "dfs") => {
    setMode(m);
    setStep(0);
  };

  return (
    <VisualFrame title="Breadth-first vs depth-first search" hint="Both visit every node once. The order is the difference: a queue gives levels, a stack gives depth.">
      <div className="cj-visual">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Traversal">
          <button type="button" aria-pressed={mode === "bfs"} onClick={() => pick("bfs")} className={toggleClass(mode === "bfs")}>Breadth-first (queue)</button>
          <button type="button" aria-pressed={mode === "dfs"} onClick={() => pick("dfs")} className={toggleClass(mode === "dfs")}>Depth-first (stack)</button>
        </div>
        <svg viewBox="0 0 340 250" className="mt-6 w-full max-w-md" role="img" aria-label={`Graph traversal, visited so far: ${visited.join(" ") || "none"}`}>
          {Object.entries(GRAPH).flatMap(([a, ns]) =>
            ns
              .filter((b) => a < b)
              .map((b) => (
                <line key={`${a}-${b}`} x1={POS[a][0]} y1={POS[a][1]} x2={POS[b][0]} y2={POS[b][1]} className="stroke-line" strokeWidth="3" />
              )),
          )}
          {Object.keys(GRAPH).map((n) => {
            const [x, y] = POS[n];
            const seen = visited.includes(n);
            const isCur = n === current;
            return (
              <g key={n}>
                <circle cx={x} cy={y} r="22" className={isCur ? "fill-accent stroke-ink" : seen ? "fill-ink stroke-ink" : "fill-raise stroke-ink"} strokeWidth="2.5" />
                <text x={x} y={y + 6} textAnchor="middle" fontSize="18" fontWeight="700" className={seen ? "fill-canvas" : "fill-ink"}>{n}</text>
              </g>
            );
          })}
        </svg>
        <p className="mt-4 font-mono text-sm">Visit order: {visited.length ? visited.join(" → ") : "not started"}</p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setStep(0)} className="btn btn-line min-h-10 px-4 text-sm">Restart</button>
          <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="btn btn-line min-h-10 px-4 text-sm disabled:opacity-40">Back</button>
          <button type="button" disabled={step >= order.length} onClick={() => setStep((s) => s + 1)} className="btn btn-line min-h-10 px-4 text-sm disabled:opacity-40">Visit next</button>
        </div>
        <p className="mt-4 text-sm text-muted">{mode === "bfs" ? "BFS visits all of A's neighbours before going any further. It finds the shortest path in an unweighted graph." : "DFS goes down B's branch to the end first, then comes back up. It suits cycle checks and topological order."}</p>
      </div>
    </VisualFrame>
  );
}

"use client";

import { useState } from "react";
import { JOBS, schedule, type Algo } from "@/lib/scheduling";
import { VisualFrame, motionStyles, toggleClass } from "./VisualFrame";

const COLORS: Record<string, string> = { P1: "bg-accent", P2: "bg-ink", P3: "bg-support", P4: "bg-muted" };

/** One process holds shared code and heap; each thread gets only its own stack. */
export function ProcessVsThread() {
  const shared = "border-2 border-dashed border-accent bg-accent/10";
  const own = "border-2 border-ink bg-raise";
  return (
    <VisualFrame title="Process vs thread" hint="A process is a whole house. Its threads are the people living in it: they share the kitchen and the living room, but each has a private bedroom.">
      <div className="cj-visual grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <div className="rounded-2xl border-2 border-ink p-4">
          <p className="font-mono text-xs tracking-wide uppercase">Process (one address space)</p>
          <div className="mt-4 grid gap-3">
            <div className={`${shared} rounded-xl p-3 text-sm`}>Code (shared)</div>
            <div className={`${shared} rounded-xl p-3 text-sm`}>Heap: objects and data (shared)</div>
            <div className="grid grid-cols-2 gap-3">
              <div className={`${own} rounded-xl p-3 text-sm`}>Thread 1 stack (own)</div>
              <div className={`${own} rounded-xl p-3 text-sm`}>Thread 2 stack (own)</div>
            </div>
          </div>
        </div>
        <p className="self-center text-center font-display text-2xl font-bold text-muted">vs</p>
        <div className="rounded-2xl border-2 border-ink p-4">
          <p className="font-mono text-xs tracking-wide uppercase">Two processes</p>
          <div className="mt-4 grid gap-3">
            <div className={`${own} rounded-xl p-3 text-sm`}>Process A: its own code, heap and stack</div>
            <div className={`${own} rounded-xl p-3 text-sm`}>Process B: its own code, heap and stack</div>
            <p className="text-sm text-muted">A crash in one cannot touch the other.</p>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/** Gantt chart: the same four jobs under three schedulers. Switch between them and watch the bars move. */
export function SchedulingChart() {
  const [algo, setAlgo] = useState<Algo>("fcfs");
  const { slices, finish, avgWait } = schedule(JOBS, algo, 4);
  const total = Math.max(...slices.map((s) => s.end));
  const names = JOBS.map((j) => j.name);
  const labels: Record<Algo, string> = { fcfs: "First come first served", sjf: "Shortest job first", rr: "Round robin (quantum 4)" };

  return (
    <VisualFrame title="CPU scheduling as a Gantt chart" hint="Each row is one job. Bars show when the CPU runs it. Waiting time is finish time minus burst time.">
      <style>{`@keyframes cj-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }${motionStyles}`}</style>
      <div className="cj-visual">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Scheduling algorithm">
          {(["fcfs", "sjf", "rr"] as Algo[]).map((a) => (
            <button key={a} type="button" aria-pressed={algo === a} onClick={() => setAlgo(a)} className={toggleClass(algo === a)}>
              {labels[a]}
            </button>
          ))}
        </div>

        <div key={algo} className="mt-6 grid gap-2">
          {names.map((name) => (
            <div key={name} className="grid grid-cols-[3rem_1fr] items-center gap-3">
              <span className="font-mono text-sm font-bold">{name}</span>
              <div className="relative h-9 rounded-md bg-raise">
                {slices
                  .filter((s) => s.name === name)
                  .map((s) => (
                    <div
                      key={`${s.name}-${s.start}`}
                      className={`${COLORS[name]} absolute top-0 h-9 origin-left rounded-md text-center text-xs leading-9 font-bold text-canvas`}
                      style={{
                        left: `${(s.start / total) * 100}%`,
                        width: `${((s.end - s.start) / total) * 100}%`,
                        animation: "cj-grow 500ms ease-out both",
                      }}
                    >
                      {s.end - s.start}
                    </div>
                  ))}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-[3rem_1fr] gap-3 font-mono text-xs text-muted">
            <span />
            <div className="flex justify-between">
              <span>0</span>
              <span>{total / 2}</span>
              <span>{total}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="py-2 pr-4 font-mono">Job</th>
                <th className="py-2 pr-4 font-mono">Burst</th>
                <th className="py-2 pr-4 font-mono">Finish</th>
                <th className="py-2 font-mono">Wait</th>
              </tr>
            </thead>
            <tbody>
              {JOBS.map((j) => (
                <tr key={j.name} className="border-b border-line">
                  <td className="py-2 pr-4 font-bold">{j.name}</td>
                  <td className="py-2 pr-4">{j.burst}</td>
                  <td className="py-2 pr-4">{finish[j.name]}</td>
                  <td className="py-2">{finish[j.name] - j.burst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-display text-xl font-bold">Average wait: {avgWait.toFixed(2)}</p>
        <p className="mt-2 text-sm text-muted">Shortest job first has the lowest average wait. Round robin is the fairest and gives every job a first turn quickly, but it switches more and waits longer on average here.</p>
      </div>
    </VisualFrame>
  );
}

/** Four threads and two locks. Toggle between the deadlock and the fixed version with a lock order. */
export function DeadlockGraph() {
  const [fixed, setFixed] = useState(false);
  return (
    <VisualFrame title="Deadlock as a cycle" hint="A solid arrow means a lock is held by a thread. A dashed arrow means a thread is waiting for a lock. A loop of waiting arrows is a deadlock.">
      <div className="cj-visual">
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!fixed} onClick={() => setFixed(false)} className={toggleClass(!fixed)}>
            Each thread takes locks its own way
          </button>
          <button type="button" aria-pressed={fixed} onClick={() => setFixed(true)} className={toggleClass(fixed)}>
            Everyone takes Lock 1 first
          </button>
        </div>
        <svg viewBox="0 0 420 240" className="mt-6 w-full" role="img" aria-label={fixed ? "No cycle: Thread 1 holds Lock 1 and Thread 2 waits for it" : "Cycle: Thread 1 waits for Lock 2 while Thread 2 waits for Lock 1"}>
          <defs>
            <marker id="dl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" className="fill-ink" />
            </marker>
          </defs>
          {[
            { id: "T1", x: 20, y: 30, label: "Thread 1" },
            { id: "T2", x: 20, y: 150, label: "Thread 2" },
            { id: "L1", x: 280, y: 30, label: "Lock 1" },
            { id: "L2", x: 280, y: 150, label: "Lock 2" },
          ].map((n) => (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width="120" height="52" rx="14" className="fill-raise stroke-ink" strokeWidth="2" />
              <text x={n.x + 60} y={n.y + 32} textAnchor="middle" className="fill-ink font-bold" fontSize="16">{n.label}</text>
            </g>
          ))}
          {fixed ? (
            <>
              <line x1="280" y1="56" x2="140" y2="56" className="stroke-ink" strokeWidth="2.5" markerEnd="url(#dl-arrow)" />
              <line x1="140" y1="158" x2="280" y2="78" className="stroke-accent" strokeWidth="2.5" strokeDasharray="6 6" markerEnd="url(#dl-arrow)" />
              <text x="210" y="232" textAnchor="middle" className="fill-muted" fontSize="13">Thread 2 waits for Lock 1, then goes. No loop, no deadlock.</text>
            </>
          ) : (
            <>
              <line x1="280" y1="56" x2="140" y2="56" className="stroke-ink" strokeWidth="2.5" markerEnd="url(#dl-arrow)" />
              <line x1="280" y1="176" x2="140" y2="176" className="stroke-ink" strokeWidth="2.5" markerEnd="url(#dl-arrow)" />
              <line x1="140" y1="70" x2="280" y2="154" className="stroke-accent" strokeWidth="2.5" strokeDasharray="6 6" markerEnd="url(#dl-arrow)" />
              <line x1="140" y1="158" x2="280" y2="78" className="stroke-accent" strokeWidth="2.5" strokeDasharray="6 6" markerEnd="url(#dl-arrow)" />
              <text x="210" y="232" textAnchor="middle" className="fill-accent font-bold" fontSize="13">Circle of waiting: deadlock</text>
            </>
          )}
        </svg>
        <p className="mt-2 text-sm text-muted">{fixed ? "Taking locks in one global order breaks the circular wait condition." : "Thread 1 holds Lock 1 and waits for Lock 2. Thread 2 holds Lock 2 and waits for Lock 1. Neither can move."}</p>
      </div>
    </VisualFrame>
  );
}

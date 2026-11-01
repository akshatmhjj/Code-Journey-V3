"use client";

import { useState } from "react";
import { VisualFrame, toggleClass } from "./VisualFrame";

/** Inheritance is an "is a" arrow up to a parent. Composition is a "has a" box holding its parts. */
export function InheritanceVsComposition() {
  const box = "rounded-xl border-2 border-ink bg-raise px-4 py-2 text-center font-mono text-sm font-bold";
  return (
    <VisualFrame title="Inheritance (is a) vs composition (has a)" hint="Both reuse code. Inheritance fixes the relationship at compile time. Composition lets you swap the parts.">
      <div className="cj-visual grid gap-8 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs tracking-wide text-muted uppercase">Inheritance: a Circle IS a Shape</p>
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className={`${box} border-dashed`}>Shape (abstract)</div>
            <span className="text-xs text-muted">extends ↑</span>
            <div className="grid w-full grid-cols-2 gap-3">
              <div className={box}>Circle</div>
              <div className={box}>Square</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">Change Shape and every child feels it.</p>
        </div>
        <div>
          <p className="font-mono text-xs tracking-wide text-muted uppercase">Composition: a Car HAS an Engine</p>
          <div className="mt-4 rounded-2xl border-2 border-ink p-4">
            <div className={`${box} mb-4`}>Car</div>
            <div className="grid gap-2">
              <div className={box}>Engine</div>
              <div className={box}>Wheels</div>
              <div className={box}>Brakes</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">Swap the Engine for an electric one without touching Car.</p>
        </div>
      </div>
    </VisualFrame>
  );
}

const SOLID = [
  {
    letter: "S",
    name: "Single responsibility",
    rule: "A class has one reason to change.",
    breaks: "An Invoice class that calculates tax, prints PDFs and saves to the database.",
    fix: "Split it: a tax calculator, a PDF writer and a repository.",
  },
  {
    letter: "O",
    name: "Open-closed",
    rule: "Add behaviour by adding code, not by editing working code.",
    breaks: "A discount function with an if-else for every new customer type.",
    fix: "A Discount interface. Add a new class for each new type.",
  },
  {
    letter: "L",
    name: "Liskov substitution",
    rule: "A subclass works anywhere its parent works, with no surprises.",
    breaks: "Square extends Rectangle, so setting width also changes height.",
    fix: "Model Shape with an area method, and keep Square and Rectangle separate.",
  },
  {
    letter: "I",
    name: "Interface segregation",
    rule: "Clients should not depend on methods they do not use.",
    breaks: "One big Worker interface with work() and eat(), forcing a robot to implement eat().",
    fix: "Split into Workable and Feedable. Robots implement only Workable.",
  },
  {
    letter: "D",
    name: "Dependency inversion",
    rule: "Depend on abstractions, not concrete classes.",
    breaks: "OrderService creates new MySqlDatabase() inside itself, so tests need a real database.",
    fix: "OrderService takes a Database interface in its constructor. Tests pass a fake.",
  },
];

/** The five SOLID principles. Pick a letter to see the rule, a case that breaks it, and the fix. */
export function SolidCards() {
  const [i, setI] = useState(0);
  const s = SOLID[i];
  return (
    <VisualFrame title="SOLID, one letter at a time" hint="Each principle prevents one kind of tangled code. Learn the broken example first, because that is what interviewers ask you to fix.">
      <div className="cj-visual">
        <div className="flex flex-wrap gap-2" role="group" aria-label="SOLID principle">
          {SOLID.map((p, idx) => (
            <button key={p.letter} type="button" aria-pressed={i === idx} onClick={() => setI(idx)} className={`grid size-12 place-items-center rounded-xl border-2 border-ink font-display text-2xl font-bold transition-colors ${i === idx ? "bg-ink text-canvas" : "hover:bg-raise"}`}>
              {p.letter}
            </button>
          ))}
        </div>
        <div key={s.letter} className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-raise p-5 md:col-span-3">
            <p className="font-display text-3xl font-bold">{s.name}</p>
            <p className="mt-2 text-lg">{s.rule}</p>
          </div>
          <div className="rounded-2xl border-2 border-accent p-5">
            <p className="font-mono text-xs tracking-wide text-accent uppercase">Breaks when</p>
            <p className="mt-2 leading-relaxed">{s.breaks}</p>
          </div>
          <div className="rounded-2xl border-2 border-ink p-5 md:col-span-2">
            <p className="font-mono text-xs tracking-wide text-muted uppercase">Fix</p>
            <p className="mt-2 leading-relaxed">{s.fix}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="button" disabled={i === 0} onClick={() => setI((x) => x - 1)} className={toggleClass(false) + " disabled:opacity-40"}>Previous</button>
          <button type="button" disabled={i === SOLID.length - 1} onClick={() => setI((x) => x + 1)} className={toggleClass(false) + " disabled:opacity-40"}>Next letter</button>
        </div>
      </div>
    </VisualFrame>
  );
}

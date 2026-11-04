import { describe, expect, it } from "vitest";
import { JOBS, schedule } from "@/lib/scheduling";
import { bfsOrder, dfsOrder } from "@/lib/traversal";

describe("scheduling visuals", () => {
  it("first come first served runs jobs in arrival order", () => {
    const r = schedule(JOBS, "fcfs");
    expect(r.slices.map((s) => s.name)).toEqual(["P1", "P2", "P3", "P4"]);
    expect(r.avgWait).toBeCloseTo(10.25);
  });

  it("shortest job first picks the shortest burst next and waits least", () => {
    const r = schedule(JOBS, "sjf");
    expect(r.slices.map((s) => s.name)).toEqual(["P4", "P1", "P3", "P2"]);
    expect(r.avgWait).toBeCloseTo(7);
  });

  it("round robin gives each job a quantum and then requeues it", () => {
    const r = schedule(JOBS, "rr", 4);
    expect(r.slices.slice(0, 4).map((s) => s.name)).toEqual(["P1", "P2", "P3", "P4"]);
    expect(r.slices.at(-1)?.end).toBe(24);
    expect(r.avgWait).toBeCloseTo(13.25);
  });
});

describe("traversal visuals", () => {
  it("breadth-first search visits level by level", () => {
    expect(bfsOrder("A")).toEqual(["A", "B", "C", "D", "E", "F"]);
  });

  it("depth-first search goes deep before it backtracks", () => {
    expect(dfsOrder("A")).toEqual(["A", "B", "D", "E", "F", "C"]);
  });
});

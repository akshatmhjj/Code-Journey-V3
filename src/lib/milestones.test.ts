import { describe, expect, it } from "vitest";
import { celebrationFor, milestones } from "@/lib/milestones";
import { computeProgress, type PathIndex, type Statuses } from "@/lib/path";

const index: PathIndex = {
  roles: [
    {
      slug: "analyst",
      title: "Analyst",
      domain: "data",
      stages: [
        { name: "Foundations", skills: ["a", "b"] },
        { name: "Core", skills: ["c", "d"] },
      ],
    },
  ],
  skills: {},
};

const route = { slug: "analyst", title: "Analyst", stages: index.roles[0].stages };

describe("milestones", () => {
  it("starts with only the first-station and route markers unreached", () => {
    const p = computeProgress(index, "analyst", {});
    const m = milestones(p!);
    expect(m.map((x) => x.id)).toEqual(["first", "stage-0", "half", "stage-1", "route"]);
    expect(m.every((x) => !x.reached)).toBe(true);
  });

  it("marks halfway and the first station once half the route is done", () => {
    const p = computeProgress(index, "analyst", { a: "done", b: "done" });
    const m = Object.fromEntries(milestones(p!).map((x) => [x.id, x.reached]));
    expect(m.first).toBe(true);
    expect(m["stage-0"]).toBe(true);
    expect(m.half).toBe(true);
    expect(m.route).toBe(false);
  });

  it("reaches the route marker only at 100%", () => {
    const p = computeProgress(index, "analyst", { a: "done", b: "done", c: "done", d: "done" });
    const m = Object.fromEntries(milestones(p!).map((x) => [x.id, x.reached]));
    expect(m.route).toBe(true);
  });
});

describe("celebrationFor", () => {
  const none: Statuses = {};

  it("returns nothing for a skill that is not on the route", () => {
    expect(celebrationFor(route, none, { z: "done" }, "z")).toBeNull();
  });

  it("celebrates a finished stage, with the next stage named", () => {
    const after: Statuses = { a: "done", b: "done" };
    const c = celebrationFor(route, none, after, "b");
    expect(c?.kind).toBe("stage");
    expect(c?.title).toBe("Foundations complete");
    expect(c?.detail).toContain("Next up: Core");
  });

  it("celebrates the whole route when the last station is ticked", () => {
    const before: Statuses = { a: "done", b: "done", c: "done", d: "learning" };
    const after: Statuses = { ...before, d: "done" };
    const c = celebrationFor(route, before, after, "d");
    expect(c?.kind).toBe("route");
  });

  it("does not celebrate twice for the same stage", () => {
    const before: Statuses = { a: "done", b: "done" };
    expect(celebrationFor(route, before, { ...before, b: "done" }, "b")).toBeNull();
  });
});

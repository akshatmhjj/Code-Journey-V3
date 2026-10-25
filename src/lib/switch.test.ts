import { describe, expect, it } from "vitest";
import { bridgeRoles, type RouteRole, type SwitchJob } from "@/lib/switch";

const job: SwitchJob = { slug: "teacher", title: "Teacher", summary: "", strengths: ["a", "b"], skills: ["technical-writing", "git"] };

const roles: RouteRole[] = [
  {
    slug: "writer-engineer",
    title: "Docs Engineer",
    stages: [
      { name: "Foundations", skills: ["git", "technical-writing"] },
      { name: "Core", skills: ["css"] },
    ],
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    stages: [
      { name: "Foundations", skills: ["sql", "spreadsheets"] },
      { name: "Core", skills: ["statistics"] },
    ],
  },
  {
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    stages: [
      { name: "Foundations", skills: ["html", "css"] },
      { name: "Core", skills: ["git"] },
    ],
  },
];

describe("bridgeRoles", () => {
  it("drops roles that share no skill with the job", () => {
    expect(bridgeRoles(job, roles).map((r) => r.slug)).not.toContain("data-analyst");
  });

  it("ranks the role with the fewest things left to learn first", () => {
    const [first] = bridgeRoles(job, roles);
    expect(first.slug).toBe("writer-engineer");
    expect(first.toLearn).toEqual(["css"]);
    expect(first.have).toEqual(["git", "technical-writing"]);
  });

  it("names the first stage that still has something to learn", () => {
    const writer = bridgeRoles(job, roles)[0];
    expect(writer.startAt).toBe("Core");
    const frontend = bridgeRoles(job, roles).find((r) => r.slug === "frontend-engineer");
    expect(frontend?.startAt).toBe("Foundations");
  });

  it("gives the share of the route already covered", () => {
    const writer = bridgeRoles(job, roles)[0];
    expect(writer.share).toBeCloseTo(2 / 3);
  });

  it("returns nothing when no route overlaps", () => {
    expect(bridgeRoles({ ...job, skills: ["rtos"] }, roles)).toEqual([]);
  });

  it("returns at most the requested number of roles", () => {
    expect(bridgeRoles(job, roles, 1)).toHaveLength(1);
  });

  it("counts a skill that appears in two stages once", () => {
    const dup: RouteRole[] = [{ slug: "x", title: "X", stages: [{ name: "A", skills: ["git"] }, { name: "B", skills: ["git", "css"] }] }];
    const [b] = bridgeRoles({ ...job, skills: ["git"] }, dup);
    expect(b.have).toEqual(["git"]);
    expect(b.toLearn).toEqual(["css"]);
    expect(b.share).toBe(0.5);
  });
});

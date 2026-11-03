import { describe, expect, it } from "vitest";
import { computeProgress, formatHours, formatWeeks, parseHours, type PathIndex } from "@/lib/path";

const index: PathIndex = {
  roles: [
    {
      slug: "data-analyst",
      title: "Data Analyst",
      domain: "data",
      stages: [
        { name: "Foundations", skills: ["sql", "spreadsheets"] },
        { name: "Core", skills: ["sql", "python"] }, // "sql" repeats on purpose: it must count once
      ],
    },
  ],
  skills: {
    sql: { title: "SQL", hours: "40–60", live: true },
    spreadsheets: { title: "Spreadsheets", hours: "20", live: true },
    python: { title: "Python", live: true },
  },
};

describe("parseHours", () => {
  it("reads a range, a single number, or nothing", () => {
    expect(parseHours("40–60")).toEqual([40, 60]);
    expect(parseHours("40-60")).toEqual([40, 60]);
    expect(parseHours("20")).toEqual([20, 20]);
    expect(parseHours(undefined)).toEqual([0, 0]);
    expect(parseHours("a few")).toEqual([0, 0]);
  });
});

describe("computeProgress", () => {
  it("returns null for an unknown role", () => {
    expect(computeProgress(index, "nope", {})).toBeNull();
  });

  it("counts a repeated skill once", () => {
    const p = computeProgress(index, "data-analyst", {});
    expect(p?.total).toBe(3);
    expect(p?.skills).toEqual(["sql", "spreadsheets", "python"]);
  });

  it("tracks done, learning and percent", () => {
    const p = computeProgress(index, "data-analyst", { sql: "done", python: "learning" });
    expect(p?.done).toBe(1);
    expect(p?.learning).toBe(1);
    expect(p?.percent).toBe(33);
  });

  it("points at the first unfinished stage", () => {
    const p = computeProgress(index, "data-analyst", { sql: "done", spreadsheets: "done" });
    expect(p?.currentStage).toBe(1);
  });

  it("stays on the last stage once everything is done", () => {
    const p = computeProgress(index, "data-analyst", { sql: "done", spreadsheets: "done", python: "done" });
    expect(p?.percent).toBe(100);
    expect(p?.currentStage).toBe(1);
    expect(p?.hoursLeft).toEqual([0, 0]);
  });

  it("adds up hours only for skills not yet done", () => {
    const p = computeProgress(index, "data-analyst", { sql: "done" });
    expect(p?.hoursLeft).toEqual([20, 20]);
  });

  it("lists the next four unfinished skills in route order", () => {
    const p = computeProgress(index, "data-analyst", { spreadsheets: "done" });
    expect(p?.next).toEqual(["sql", "python"]);
  });
});

describe("formatHours and formatWeeks", () => {
  it("says none left when nothing remains", () => {
    expect(formatHours([0, 0])).toBe("none left");
    expect(formatWeeks([0, 0])).toBeNull();
  });

  it("rounds large hour counts to tens", () => {
    expect(formatHours([120, 146])).toBe("120–150 hours");
  });

  it("uses weeks for short remainders and months for long ones", () => {
    expect(formatWeeks([20, 30], 10)).toBe("about 2–3 weeks");
    expect(formatWeeks([200, 300], 10)).toBe("about 5–7 months");
  });
});

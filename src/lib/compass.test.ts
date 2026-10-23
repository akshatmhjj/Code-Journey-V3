import { describe, expect, it } from "vitest";
import { maxScores, scoreCompass, type CompassQuestion } from "@/lib/compass";

const questions: CompassQuestion[] = [
  {
    id: "q1",
    q: "Pick one",
    options: [
      { label: "a", why: "likes screens", weights: { frontend: 3, backend: 1 } },
      { label: "b", why: "likes servers", weights: { backend: 3 } },
    ],
  },
  {
    id: "q2",
    q: "Pick one",
    options: [
      { label: "a", why: "likes design", weights: { frontend: 2 } },
      { label: "b", why: "likes data", weights: { data: 3 } },
    ],
  },
];

describe("maxScores", () => {
  it("adds up the best weight each role can earn per question", () => {
    expect(maxScores(questions)).toEqual({ frontend: 5, backend: 3, data: 3 });
  });
});

describe("scoreCompass", () => {
  it("ranks the role the answers point to first", () => {
    const [top] = scoreCompass(questions, [0, 0]);
    expect(top.slug).toBe("frontend");
    expect(top.score).toBe(5);
    expect(top.match).toBe(100);
  });

  it("gives a percentage of the best possible score", () => {
    const backend = scoreCompass(questions, [1, 1]).find((r) => r.slug === "backend");
    expect(backend?.score).toBe(3);
    expect(backend?.match).toBe(100);
  });

  it("lists reasons for the strongest answers first, at most three", () => {
    const frontend = scoreCompass(questions, [0, 0]).find((r) => r.slug === "frontend");
    expect(frontend?.reasons).toEqual(["likes screens", "likes design"]);
  });

  it("ignores an answer that does not match any option", () => {
    const results = scoreCompass(questions, [99, 1]);
    expect(results.find((r) => r.slug === "frontend")?.score).toBe(0);
  });
});

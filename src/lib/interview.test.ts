import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { getInterviewTopic, getInterviewTopics } = await import("@/lib/interview");

describe("interview prep content", () => {
  const topics = getInterviewTopics();

  it("loads the five CS core topics in reading order", () => {
    expect(topics.map((t) => t.slug)).toEqual(["os", "networks", "dbms", "oop", "dsa"]);
  });

  it("gives every topic a 60-second version, concepts, questions and traps", () => {
    for (const t of topics) {
      expect(t.say.length).toBeGreaterThan(80);
      expect(t.concepts.length).toBeGreaterThanOrEqual(10);
      expect(t.questions.length).toBeGreaterThanOrEqual(10);
      expect(t.traps.length).toBeGreaterThanOrEqual(3);
      expect(t.concepts.filter((c) => c.hook).length).toBeGreaterThanOrEqual(4);
    }
  });

  it("finds a topic by slug and returns undefined for an unknown one", () => {
    expect(getInterviewTopic("dbms")?.title).toBe("Databases (DBMS)");
    expect(getInterviewTopic("missing")).toBeUndefined();
  });

  it("uses no em or en dashes, per the house style", () => {
    const text = JSON.stringify(topics);
    expect(text).not.toMatch(/[–—]/);
  });
});

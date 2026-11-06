import { describe, expect, it, vi } from "vitest";
import { CREATOR, LEVELS } from "@/lib/system-design-meta";

vi.mock("server-only", () => ({}));

const { getSdArticle, getSdArticles, getSdPath, getSdPaths, getSdTerms } = await import("@/lib/system-design");

describe("system design content", () => {
  const paths = getSdPaths();
  const articles = getSdArticles();

  it("loads the paths in reading order", () => {
    expect(paths.map((p) => p.slug)).toEqual([
      "system-design-fundamentals",
      "hld-interview-prep",
      "lld-classics",
      "backend-engineering-fundamentals",
      "distributed-systems",
      "microservices",
      "ai-and-ml-foundations",
      "extra-reads",
    ]);
  });

  it("covers beginner, intermediate and advanced paths", () => {
    for (const level of LEVELS) expect(paths.some((p) => p.level === level)).toBe(true);
  });

  it("keeps all 71 source articles, each in exactly one path", () => {
    expect(articles).toHaveLength(71);
    expect(new Set(articles.map((a) => a.id)).size).toBe(71);
  });

  it("gives every article a summary, three key points and a source link", () => {
    for (const a of articles) {
      expect(a.summary.length).toBeGreaterThan(20);
      expect(a.points.length).toBeGreaterThanOrEqual(3);
      expect(a.source).toMatch(/^https:\/\//);
    }
  });

  it("gives every path a purpose, what it assumes, an outcome and quick checks", () => {
    for (const p of paths) {
      expect(p.purpose.length).toBeGreaterThan(30);
      expect(p.assumes.length).toBeGreaterThan(10);
      expect(p.outcome.length).toBeGreaterThan(30);
      expect(p.checks.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("puts every prerequisite earlier in the same path", () => {
    for (const p of paths) {
      for (const a of p.articles) {
        for (const n of a.needs) {
          const need = getSdArticle(n);
          expect(need).toBeDefined();
          if (need?.path === p.slug) expect(need.position).toBeLessThan(a.position);
        }
      }
    }
  });

  it("defines every term an article uses", () => {
    const ids = new Set(getSdTerms().map((t) => t.id));
    for (const a of articles) for (const t of a.terms) expect(ids.has(t)).toBe(true);
  });

  it("finds a path by slug and returns undefined for an unknown one", () => {
    expect(getSdPath("microservices")?.articles).toHaveLength(6);
    expect(getSdPath("missing")).toBeUndefined();
  });

  it("credits the original writer and never names the site this list was found on", () => {
    expect(CREATOR.handle).toBe("@Harry_The_Nerd");
    expect(CREATOR.url).toBe("https://x.com/Harry_The_Nerd");
    // Source links are allowed to point where the original lives. The words we wrote are not.
    const written = JSON.stringify({ paths, terms: getSdTerms() }, (key, value) => (key === "source" ? undefined : value));
    expect(written.toLowerCase()).not.toContain("vidya");
  });

  it("uses no em or en dashes, per the house style", () => {
    expect(JSON.stringify({ paths, terms: getSdTerms() })).not.toMatch(/[–—]/);
  });
});

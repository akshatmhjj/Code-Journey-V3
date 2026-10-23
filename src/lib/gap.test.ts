import { describe, expect, it } from "vitest";
import { analyse, buildGapData, learningOrder, type GapData } from "@/lib/gap";

const data: GapData = {
  skills: [
    { slug: "sql", title: "SQL", level: "", prereqs: [] },
    { slug: "python", title: "Python", level: "", prereqs: [] },
    { slug: "pandas", title: "Pandas", level: "", prereqs: ["python"] },
    { slug: "react", title: "React", level: "", prereqs: [] },
    { slug: "react-native", title: "React Native", level: "", prereqs: ["react"] },
    { slug: "go", title: "Go", level: "", prereqs: [] },
  ],
  matchers: [
    { slug: "sql", phrases: ["sql"] },
    { slug: "python", phrases: ["python"] },
    { slug: "pandas", phrases: ["pandas"] },
    { slug: "react", phrases: ["react"] },
    { slug: "react-native", phrases: ["react native"] },
    { slug: "go", phrases: ["=Go"] },
  ],
  notCovered: [{ name: "Kubernetes", phrases: ["kubernetes"] }],
  roles: [
    { slug: "data-analyst", title: "Data Analyst", names: ["Data Analyst"], route: ["sql", "python", "pandas"] },
    { slug: "frontend-engineer", title: "Frontend Engineer", names: ["Frontend Engineer"], route: ["react", "sql"] },
  ],
};

const slugs = (text: string) => analyse(data, text).found.map((f) => f.slug);

describe("analyse", () => {
  it("matches whole words only", () => {
    expect(slugs("We use MySQL daily")).toEqual([]);
    expect(slugs("We use SQL daily")).toEqual(["sql"]);
  });

  it("matches a plural form", () => {
    expect(slugs("Strong pythons skills")).toEqual(["python"]);
  });

  it("counts mentions and keeps the order of first mention", () => {
    const a = analyse(data, "Python, then SQL, then more python");
    expect(a.found.map((f) => [f.slug, f.mentions])).toEqual([
      ["python", 2],
      ["sql", 1],
    ]);
  });

  it("prefers the longer phrase: React Native is not also React", () => {
    expect(slugs("Mobile with React Native")).toEqual(["react-native"]);
  });

  it("respects case when the phrase starts with =", () => {
    expect(slugs("I write Go services")).toEqual(["go"]);
    expect(slugs("I go to work")).toEqual([]);
  });

  it("lists topics the site does not cover", () => {
    expect(analyse(data, "Kubernetes and SQL").notCovered).toEqual(["Kubernetes"]);
  });

  it("suggests roles that share at least two skills, and boosts a named role", () => {
    const a = analyse(data, "Frontend Engineer with react and sql");
    expect(a.roles[0].slug).toBe("frontend-engineer");
    expect(a.roles.every((r) => r.shared >= 2)).toBe(true);
  });
});

describe("learningOrder", () => {
  it("puts prerequisites before the skills that need them", () => {
    expect(learningOrder(data, ["pandas", "python"], {})).toEqual(["python", "pandas"]);
  });

  it("breaks ties by mention count, then name", () => {
    expect(learningOrder(data, ["sql", "go"], { go: 3, sql: 1 })).toEqual(["go", "sql"]);
  });
});

describe("buildGapData", () => {
  it("turns the title's bracketed parts into extra phrases", () => {
    const built = buildGapData({
      catalogSkills: [{ slug: "cloud", title: "Cloud (AWS, GCP)" }],
      aliases: { skills: {}, not_covered: {} },
      written: [],
      roles: [],
    });
    expect(built.matchers[0].phrases).toEqual(["cloud", "aws", "gcp"]);
    expect(built.skills[0].title).toBe("Cloud");
  });

  it("turns off automatic phrases with auto: false", () => {
    const built = buildGapData({
      catalogSkills: [{ slug: "js", title: "JavaScript" }],
      aliases: { skills: { js: { auto: false, aliases: ["js"] } }, not_covered: {} },
      written: [],
      roles: [],
    });
    expect(built.matchers[0].phrases).toEqual(["js"]);
  });
});

import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import YAML from "yaml";
import { z } from "zod";
import type { PathIndex } from "./path";
import type { CompassQuestion } from "./compass";
import { buildGapData, type GapData } from "./gap";

const ROOT = path.join(process.cwd(), "content");

/* ── Schemas ─────────────────────────────────────────────── */

export const RESOURCE_TYPES = ["docs", "book", "course", "video", "interactive", "practice", "tool", "article", "community"] as const;

const Resource = z.object({
  title: z.string(),
  url: z.url(),
  provider: z.string().optional(),
  type: z.enum(RESOURCE_TYPES),
  cost: z.enum(["free", "freemium", "paid"]).default("free"),
  official: z.boolean().optional(),
  note: z.string().optional(),
});
export type Resource = z.infer<typeof Resource>;

const LineStyle = z.enum(["solid", "double", "dashed", "dotted", "thin", "dashdot", "short", "hollow", "rail", "hub"]);
export type LineStyle = z.infer<typeof LineStyle>;

const Catalog = z.object({
  domains: z.array(z.object({ slug: z.string(), code: z.string(), name: z.string(), line: LineStyle, tagline: z.string() })),
  roles: z.array(z.object({ slug: z.string(), title: z.string(), domain: z.string(), wave: z.number(), oneLiner: z.string() })),
  skills: z.array(z.object({ slug: z.string(), title: z.string(), domain: z.string() })),
});

const SkillData = z.object({
  title: z.string(),
  domain: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  hours: z.string().optional(),
  brief: z.string(),
  prereqs: z.array(z.string()).default([]),
  learn: z.array(z.object({ topic: z.string(), detail: z.string() })),
  resources: z.array(Resource).min(1),
  checked: z.coerce.date(),
});

const Stage = z.object({
  name: z.string(),
  summary: z.string(),
  skills: z.array(z.string()),
  project: z.string(),
  doneWhen: z.string(),
  weeks: z.string().optional(),
});

const RoleData = z.object({
  title: z.string(),
  aliases: z.array(z.string()).default([]),
  summary: z.string(),
  whereTheyWork: z.string(),
  dayInLife: z.array(z.string()),
  stages: z.array(Stage).min(1),
  skills: z.object({ must: z.array(z.string()), should: z.array(z.string()), nice: z.array(z.string()) }),
  tools: z.array(z.string()),
  interview: z.object({ rounds: z.array(z.string()), practice: z.array(Resource) }),
  aiImpact: z.string(),
  market: z.array(z.object({ text: z.string(), source: z.object({ title: z.string(), url: z.url() }).optional() })),
  adjacent: z.array(z.string()),
  updated: z.coerce.date(),
});

const PostData = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tag: z.string(),
  excerpt: z.string(),
  readTime: z.string(),
});

const Term = z.object({ term: z.string(), slug: z.string(), category: z.string(), definition: z.string() });
const Snippet = z.object({ id: z.string(), skill: z.string(), title: z.string(), description: z.string(), tags: z.array(z.string()), code: z.string() });
const Faq = z.array(z.object({ group: z.string(), items: z.array(z.object({ q: z.string(), a: z.string() })) }));
const Changelog = z.array(
  z.object({
    date: z.coerce.date(),
    version: z.string(),
    title: z.string(),
    changes: z.array(z.object({ type: z.enum(["added", "changed", "fixed", "removed"]), text: z.string() })),
  }),
);

/* ── Helpers ─────────────────────────────────────────────── */

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function parse<T extends z.ZodType>(schema: T, data: unknown, where: string): z.infer<T> {
  const r = schema.safeParse(data);
  if (!r.success) throw new Error(`Invalid content in ${where}:\n${z.prettifyError(r.error)}`);
  return r.data;
}

function mdFiles(dir: string) {
  const full = path.join(ROOT, dir);
  return fs.existsSync(full) ? fs.readdirSync(full).filter((f) => f.endsWith(".md")).sort() : [];
}

/* ── Loaders ─────────────────────────────────────────────── */

export const getCatalog = cache(() => parse(Catalog, YAML.parse(read("catalog.yaml")), "catalog.yaml"));

export type Domain = ReturnType<typeof getCatalog>["domains"][number];
export type RoleEntry = ReturnType<typeof getCatalog>["roles"][number] & { live: boolean };
export type SkillEntry = ReturnType<typeof getCatalog>["skills"][number] & { live: boolean };

export const getSkills = cache(() =>
  mdFiles("skills").map((f) => {
    const slug = f.replace(/\.md$/, "");
    const { data, content } = matter(read(`skills/${f}`));
    return { slug, ...parse(SkillData, data, `skills/${f}`), body: content };
  }),
);
export type Skill = ReturnType<typeof getSkills>[number];

export const getRoles = cache(() =>
  mdFiles("roles").map((f) => {
    const slug = f.replace(/\.md$/, "");
    const { data, content } = matter(read(`roles/${f}`));
    return { slug, ...parse(RoleData, data, `roles/${f}`), body: content };
  }),
);
export type Role = ReturnType<typeof getRoles>[number];

/** Catalog entries with a flag for whether a full page exists. */
export const getNetwork = cache(() => {
  const c = getCatalog();
  const liveRoles = new Set(getRoles().map((r) => r.slug));
  const liveSkills = new Set(getSkills().map((s) => s.slug));
  return {
    domains: c.domains,
    roles: c.roles.map((r) => ({ ...r, live: liveRoles.has(r.slug) })) as RoleEntry[],
    skills: c.skills.map((s) => ({ ...s, live: liveSkills.has(s.slug) })) as SkillEntry[],
  };
});

export function getDomain(slug: string) {
  return getCatalog().domains.find((d) => d.slug === slug);
}
export function getSkillEntry(slug: string) {
  return getNetwork().skills.find((s) => s.slug === slug);
}
export function getRoleEntry(slug: string) {
  return getNetwork().roles.find((r) => r.slug === slug);
}
export function getSkill(slug: string) {
  return getSkills().find((s) => s.slug === slug);
}
export function getRole(slug: string) {
  return getRoles().find((r) => r.slug === slug);
}

/** Roles whose route passes through a skill. */
export function rolesUsingSkill(slug: string) {
  return getRoles().filter((r) => r.stages.some((s) => s.skills.includes(slug)) || Object.values(r.skills).some((t) => t.includes(slug)));
}

export const getPosts = cache(() =>
  mdFiles("blog")
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = matter(read(`blog/${f}`));
      return { slug, ...parse(PostData, data, `blog/${f}`), body: content };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime()),
);

export const getGlossary = cache(() =>
  parse(z.array(Term), YAML.parse(read("glossary.yaml")), "glossary.yaml").sort((a, b) => a.term.localeCompare(b.term)),
);
export const getSnippets = cache(() => parse(z.array(Snippet), JSON.parse(read("snippets.json")), "snippets.json"));
export const getFaq = cache(() => parse(Faq, YAML.parse(read("faq.yaml")), "faq.yaml"));
export const getChangelog = cache(() => parse(Changelog, YAML.parse(read("changelog.yaml")), "changelog.yaml"));

/** Every resource across all skills, de-duplicated by URL. */
export const getAllResources = cache(() => {
  const map = new Map<string, Resource & { skills: { slug: string; title: string }[] }>();
  for (const s of getSkills()) {
    for (const r of s.resources) {
      const e = map.get(r.url) ?? { ...r, skills: [] };
      e.skills.push({ slug: s.slug, title: s.title });
      map.set(r.url, e);
    }
  }
  return [...map.values()].sort((a, b) => Number(!!b.official) - Number(!!a.official) || a.title.localeCompare(b.title));
});

/** Latest "checked" date across the library, for the footer. */
export const getLibraryStatus = cache(() => {
  const skills = getSkills();
  const last = skills.reduce((d, s) => (s.checked > d ? s.checked : d), new Date(0));
  return { checked: last, resources: getAllResources().length };
});

/** Compact route data for client components (My Path progress). */
export const getPathIndex = cache((): PathIndex => {
  const net = getNetwork();
  const written = new Map(getSkills().map((s) => [s.slug, s]));
  const domain = new Map(net.roles.map((r) => [r.slug, r.domain]));
  return {
    roles: getRoles().map((r) => ({
      slug: r.slug,
      title: r.title,
      domain: domain.get(r.slug) ?? "",
      stages: r.stages.map((s) => ({ name: s.name, weeks: s.weeks, skills: s.skills })),
    })),
    skills: Object.fromEntries(net.skills.map((s) => [s.slug, { title: s.title, hours: written.get(s.slug)?.hours, live: s.live }])),
  };
});

const Compass = z.object({
  questions: z
    .array(
      z.object({
        id: z.string(),
        q: z.string(),
        options: z.array(z.object({ label: z.string(), why: z.string(), weights: z.record(z.string(), z.number().int().min(1).max(3)) })).min(2),
      }),
    )
    .min(3),
});

/** The Compass quiz (content/compass.yaml). */
export const getCompass = cache((): CompassQuestion[] => parse(Compass, YAML.parse(read("compass.yaml")), "compass.yaml").questions);

const AliasEntry = z.union([z.array(z.string()), z.object({ auto: z.boolean().optional(), aliases: z.array(z.string()).default([]) })]);
const Aliases = z.object({
  skills: z.record(z.string(), AliasEntry),
  not_covered: z.record(z.string(), z.array(z.string())),
});

/** Everything the job-post gap analyser needs, built from the catalog, skill pages and content/skill-aliases.yaml. */
export const getGapData = cache((): GapData =>
  buildGapData({
    catalogSkills: getCatalog().skills,
    aliases: parse(Aliases, YAML.parse(read("skill-aliases.yaml")), "skill-aliases.yaml"),
    written: getSkills(),
    roles: getRoles().map((r) => ({
      slug: r.slug,
      title: r.title,
      names: [r.title, ...r.aliases].filter((n) => n.length > 3),
      route: [...new Set([...r.stages.flatMap((st) => st.skills), ...r.skills.must, ...r.skills.should, ...r.skills.nice])],
    })),
  }),
);

/* ── Market: pay and demand (content/market.yaml) ─────────── */

const IndiaPay = z.object({
  title: z.string(),
  avg: z.number(),
  p10: z.number(),
  p90: z.number(),
  entry: z.number().optional(),
  profiles: z.number().int(),
  updated: z.coerce.date(),
  url: z.url(),
});
const UsPay = z.object({ title: z.string(), median: z.number().int(), growth: z.number(), url: z.url() });
const MarketFile = z.object({
  checked: z.coerce.date(),
  india: z.record(z.string(), IndiaPay),
  us: z.record(z.string(), UsPay),
  roles: z.record(
    z.string(),
    z.object({ india: z.string().optional(), india_exact: z.boolean().default(true), us: z.string().optional(), us_exact: z.boolean().default(true) }),
  ),
});

export type RoleMarket = {
  india?: z.infer<typeof IndiaPay> & { exact: boolean };
  us?: z.infer<typeof UsPay> & { exact: boolean };
};

/** Pay and growth per role, resolved to the source rows. Unknown keys fail the build. */
export const getMarket = cache(() => {
  const m = parse(MarketFile, YAML.parse(read("market.yaml")), "market.yaml");
  const roles: Record<string, RoleMarket> = {};
  for (const [slug, r] of Object.entries(m.roles)) {
    if (r.india && !m.india[r.india]) throw new Error(`market.yaml: role "${slug}" points at unknown india key "${r.india}"`);
    if (r.us && !m.us[r.us]) throw new Error(`market.yaml: role "${slug}" points at unknown us key "${r.us}"`);
    roles[slug] = {
      india: r.india ? { ...m.india[r.india], exact: r.india_exact } : undefined,
      us: r.us ? { ...m.us[r.us], exact: r.us_exact } : undefined,
    };
  }
  return { checked: m.checked, roles };
});

/* ── Compare ──────────────────────────────────────────────── */

/** "10–14" week ranges for the first three stages → "7–10 months". */
function jobReady(weeks: (string | undefined)[]) {
  let lo = 0;
  let hi = 0;
  for (const w of weeks) {
    const m = w?.match(/(\d+)\D+(\d+)/);
    if (m) {
      lo += +m[1];
      hi += +m[2];
    }
  }
  return hi ? `${Math.round(lo / 4.3)}–${Math.round(hi / 4.3)} months` : "Varies";
}

/** Everything the compare view needs for each written role. */
export const getCompareRoles = cache(() => {
  const domains = new Map(getCatalog().domains.map((d) => [d.slug, d.name]));
  const entries = new Map(getNetwork().roles.map((r) => [r.slug, r]));
  const market = getMarket().roles;
  return getRoles()
    .map((r) => {
      const m = market[r.slug] ?? {};
      return {
        slug: r.slug,
        title: r.title,
        domain: domains.get(entries.get(r.slug)?.domain ?? "") ?? "",
        summary: r.summary,
        whereTheyWork: r.whereTheyWork,
        jobReady: jobReady(r.stages.slice(0, 3).map((s) => s.weeks)),
        stages: r.stages.map((s) => ({ name: s.name, count: s.skills.length })),
        route: [...new Set([...r.stages.flatMap((s) => s.skills), ...r.skills.must, ...r.skills.should, ...r.skills.nice])],
        must: r.skills.must,
        rounds: r.interview.rounds,
        aiImpact: r.aiImpact,
        pay: {
          india: m.india ? { avg: m.india.avg, entry: m.india.entry ?? null, exact: m.india.exact, title: m.india.title } : null,
          us: m.us ? { median: m.us.median, growth: m.us.growth, exact: m.us.exact, title: m.us.title } : null,
        },
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
});
export type CompareRole = ReturnType<typeof getCompareRoles>[number];

/**
 * Pairs worth their own indexable page: every role with each of its related roles.
 * The first time a pair appears sets its canonical order ("data-analyst-vs-data-scientist").
 */
export const getComparePairs = cache(() => {
  const written = new Set(getRoles().map((r) => r.slug));
  const seen = new Set<string>();
  const pairs: { a: string; b: string }[] = [];
  for (const r of getRoles()) {
    for (const other of r.adjacent) {
      if (!written.has(other) || other === r.slug) continue;
      const key = [r.slug, other].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ a: r.slug, b: other });
    }
  }
  return pairs;
});

export const pairSlug = (a: string, b: string) => `${a}-vs-${b}`;

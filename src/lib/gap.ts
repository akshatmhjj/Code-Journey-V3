// Job-post gap analyser: finds Code Journey skills mentioned in a job post.
// Runs entirely in the browser. No server-only imports, so it's testable from scripts.

export type GapSkill = {
  slug: string;
  title: string;
  level: string;
  hours?: string;
  prereqs: string[];
  resource?: { title: string; url: string; official?: boolean };
};

export type GapData = {
  skills: GapSkill[];
  /** Phrases per skill. A leading "=" means case-sensitive. */
  matchers: { slug: string; phrases: string[] }[];
  notCovered: { name: string; phrases: string[] }[];
  /** names = title plus aliases, e.g. "Frontend Developer". */
  roles: { slug: string; title: string; names: string[]; route: string[] }[];
};

export type Found = { slug: string; mentions: number; first: number };
export type Analysis = {
  found: Found[];
  notCovered: string[];
  roles: { slug: string; title: string; shared: number; fit: number }[];
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");

type Compiled = { key: string; kind: "skill" | "other"; re: RegExp }[];
const cache = new WeakMap<GapData, Compiled>();

function compile(data: GapData): Compiled {
  const hit = cache.get(data);
  if (hit) return hit;
  const make = (key: string, kind: "skill" | "other", phrase: string) => {
    const sensitive = phrase.startsWith("=");
    const p = escape(sensitive ? phrase.slice(1) : phrase);
    // Whole words only: no letter, digit, + or # either side (so "sql" misses "mysql", "c" misses "c#").
    // A leading "." is also blocked so "js" doesn't fire inside "node.js". Optional plural.
    return { key, kind, re: new RegExp(`(?<![A-Za-z0-9+#.])${p}(?:s|es)?(?![A-Za-z0-9+#])`, sensitive ? "g" : "gi") };
  };
  const out: Compiled = [
    ...data.matchers.flatMap((m) => m.phrases.map((p) => make(m.slug, "skill", p))),
    ...data.notCovered.flatMap((n) => n.phrases.map((p) => make(n.name, "other", p))),
  ];
  cache.set(data, out);
  return out;
}

export function analyse(data: GapData, text: string): Analysis {
  type Span = { key: string; kind: "skill" | "other"; start: number; end: number };
  const spans: Span[] = [];
  for (const { key, kind, re } of compile(data)) {
    re.lastIndex = 0;
    for (let m: RegExpExecArray | null; (m = re.exec(text)); ) spans.push({ key, kind, start: m.index, end: m.index + m[0].length });
  }

  // Longest match wins: "React Native" shouldn't also count as React, "SwiftUI" not as Swift.
  // A span is dropped only when it sits strictly inside a longer span of a different key.
  spans.sort((a, b) => b.end - b.start - (a.end - a.start));
  const kept: Span[] = [];
  for (const s of spans) {
    const inside = kept.some((k) => k.key !== s.key && k.start <= s.start && k.end >= s.end && k.end - k.start > s.end - s.start);
    if (!inside) kept.push(s);
  }

  const bySkill = new Map<string, Found>();
  const other = new Set<string>();
  for (const s of kept) {
    if (s.kind === "other") {
      other.add(s.key);
      continue;
    }
    const f = bySkill.get(s.key) ?? { slug: s.key, mentions: 0, first: s.start };
    f.mentions += 1;
    f.first = Math.min(f.first, s.start);
    bySkill.set(s.key, f);
  }
  const found = [...bySkill.values()].sort((a, b) => a.first - b.first);

  // Which route does this post look like? Cosine overlap between found skills and each route,
  // plus a strong boost when the post names the role ("Frontend Engineer", "Frontend Developer").
  const foundSet = new Set(found.map((f) => f.slug));
  const lower = text.toLowerCase();
  const roles = data.roles
    .map((r) => {
      const shared = r.route.filter((s) => foundSet.has(s)).length;
      const named = r.names.some((n) => new RegExp(`(?<![a-z])${escape(n.toLowerCase())}(?![a-z])`).test(lower));
      const fit = (found.length ? shared / Math.sqrt(found.length * r.route.length) : 0) + (named ? 0.25 : 0);
      return { slug: r.slug, title: r.title, shared, fit };
    })
    .filter((r) => r.shared >= 2)
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 3);

  return { found, notCovered: [...other].sort(), roles };
}

/** Order skills to learn: prerequisites first, then the ones the post mentions most. */
export function learningOrder(data: GapData, slugs: string[], mentions: Record<string, number>) {
  const bySlug = new Map(data.skills.map((s) => [s.slug, s]));
  const depthCache = new Map<string, number>();
  const depth = (slug: string, seen = new Set<string>()): number => {
    if (depthCache.has(slug)) return depthCache.get(slug)!;
    if (seen.has(slug)) return 0;
    seen.add(slug);
    const pre = bySlug.get(slug)?.prereqs ?? [];
    const d = pre.length ? 1 + Math.max(...pre.map((p) => depth(p, seen))) : 0;
    depthCache.set(slug, d);
    return d;
  };
  return [...slugs].sort((a, b) => depth(a) - depth(b) || (mentions[b] ?? 0) - (mentions[a] ?? 0) || a.localeCompare(b));
}

type AliasEntry = string[] | { auto?: boolean; aliases?: string[] };

/** Builds analyser data from raw content. Shared by the page (via content.ts) and by tests. */
export function buildGapData(input: {
  catalogSkills: { slug: string; title: string }[];
  aliases: { skills: Record<string, AliasEntry>; not_covered: Record<string, string[]> };
  written: { slug: string; level: string; hours?: string; prereqs: string[]; resources: { title: string; url: string; official?: boolean }[] }[];
  roles: { slug: string; title: string; names: string[]; route: string[] }[];
}): GapData {
  const written = new Map(input.written.map((s) => [s.slug, s]));
  const matchers = input.catalogSkills.map((s) => {
    const entry = input.aliases.skills[s.slug] ?? [];
    const auto = Array.isArray(entry) ? true : entry.auto !== false;
    const extra = Array.isArray(entry) ? entry : (entry.aliases ?? []);
    const phrases: string[] = [];
    if (auto) {
      const base = s.title.replace(/\s*\(.*\)$/, "").toLowerCase();
      if (base.length >= 3) phrases.push(base);
      const inner = s.title.match(/\(([^)]*)\)/)?.[1];
      if (inner) phrases.push(...inner.split(",").map((x) => x.trim().toLowerCase()).filter((x) => x.length >= 2));
    }
    return { slug: s.slug, phrases: [...new Set([...phrases, ...extra])] };
  });
  return {
    skills: input.catalogSkills.map((s) => {
      const w = written.get(s.slug);
      const r = w?.resources.find((x) => x.official) ?? w?.resources[0];
      return {
        slug: s.slug,
        title: s.title.replace(/\s*\(.*\)$/, ""),
        level: w?.level ?? "",
        hours: w?.hours,
        prereqs: w?.prereqs ?? [],
        resource: r ? { title: r.title, url: r.url, official: r.official } : undefined,
      };
    }),
    matchers,
    notCovered: Object.entries(input.aliases.not_covered).map(([name, phrases]) => ({ name, phrases })),
    roles: input.roles,
  };
}

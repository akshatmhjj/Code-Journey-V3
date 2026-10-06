import "server-only";
import { getNetwork, getRole, getRoles, getSkill, getSkillEntry } from "./content";

export type Source = { key: string; url: string; title: string; heading: string; content: string; similarity?: number };

/* ── Exact lookups: roles and skills named in the question ─────────── */

// Short or ambiguous names need an explicit phrase to count as a mention.
const MANUAL_ALIASES: Record<string, string[]> = {
  go: ["golang", "go language", "go programming", "learn go"],
  r: ["r language", "r programming", "learn r"],
  "c-programming": ["c language", "c programming", "learn c"],
  csharp: ["c#", "csharp", "c sharp"],
  cpp: ["c++", "cpp"],
  "site-reliability-engineer": ["sre"],
  "qa-sdet": ["qa", "sdet", "tester", "test automation engineer"],
  "forward-deployed-engineer": ["fde", "forward deployed"],
  "ai-engineer": ["llm engineer", "genai engineer"],
  "cross-platform-mobile-engineer": ["flutter developer", "react native developer", "mobile developer", "app developer"],
};

type Matcher = { kind: "role" | "skill"; slug: string; phrases: string[] };

let matchers: Matcher[] | null = null;
function getMatchers(): Matcher[] {
  if (matchers) return matchers;
  const aliases = new Map(getRoles().map((r) => [r.slug, r.aliases]));
  const base = (t: string) => t.replace(/\s*\(.*\)$/, "").toLowerCase();
  const usable = (p: string) => p.length >= 3 && !["go", "r", "c"].includes(p);
  matchers = [
    ...getNetwork().roles.map((r) => ({
      kind: "role" as const,
      slug: r.slug,
      phrases: [base(r.title), ...(aliases.get(r.slug) ?? []).map((a) => a.toLowerCase()), ...(MANUAL_ALIASES[r.slug] ?? [])].filter(usable),
    })),
    ...getNetwork().skills.map((s) => ({
      kind: "skill" as const,
      slug: s.slug,
      phrases: [base(s.title), ...(MANUAL_ALIASES[s.slug] ?? [])].filter((p) => usable(p) || MANUAL_ALIASES[s.slug]?.includes(p)),
    })),
  ];
  return matchers;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Roles and skills explicitly named in the text, most specific (longest phrase) first. */
export function findEntities(text: string, max = 2) {
  const q = ` ${text.toLowerCase().replace(/[^\w#+.\s/-]/g, " ")} `;
  const hits: { kind: "role" | "skill"; slug: string; len: number }[] = [];
  for (const m of getMatchers()) {
    const best = m.phrases.filter((p) => new RegExp(`(^|[^\\w#+])${escape(p)}([^\\w#+]|$)`).test(q)).sort((a, b) => b.length - a.length)[0];
    if (best) hits.push({ kind: m.kind, slug: m.slug, len: best.length });
  }
  // Prefer roles, then longer matches ("data engineer" over "data").
  return hits.sort((a, b) => (a.kind === b.kind ? b.len - a.len : a.kind === "role" ? -1 : 1)).slice(0, max);
}

/** A compact, exact summary of a role or skill page, used as a source. */
export function entitySource(kind: "role" | "skill", slug: string): Source | null {
  const title = (s: string) => getSkillEntry(s)?.title ?? s;
  if (kind === "role") {
    const r = getRole(slug);
    if (!r) return null;
    return {
      key: `role:${slug}#summary`,
      url: `/roles/${slug}`,
      title: `${r.title} (career route)`,
      heading: "The full route",
      content: [
        r.summary,
        ...r.stages.map((s, i) => `Stage ${i + 1} — ${s.name}${s.weeks ? ` (${s.weeks} weeks at ~10 h/week)` : ""}: ${s.summary} Skills: ${s.skills.map(title).join(", ")}. Project: ${s.project}`),
        `Must have: ${r.skills.must.map(title).join(", ")}. Should have: ${r.skills.should.map(title).join(", ")}.`,
        `Interview rounds: ${r.interview.rounds.join("; ")}.`,
      ].join("\n"),
    };
  }
  const s = getSkill(slug);
  if (!s) return null;
  return {
    key: `skill:${slug}#summary`,
    url: `/skills/${slug}`,
    title: `${s.title} (skill)`,
    heading: "Brief, checklist and resources",
    content: [
      `${s.brief} Level: ${s.level}.${s.hours ? ` About ${s.hours} hours.` : ""}${s.prereqs.length ? ` Learn first: ${s.prereqs.map(title).join(", ")}.` : ""}`,
      `What to learn: ${s.learn.map((l) => l.topic).join("; ")}.`,
      `Best resources: ${s.resources.slice(0, 5).map((r) => `${r.title}${r.official ? " (official)" : ""} — ${r.url}`).join("; ")}.`,
    ].join("\n"),
  };
}

/* ── Prompt ─────────────────────────────────────────────────────────── */

export const SYSTEM_PROMPT = `You are CJ AI, the assistant on Code Journey (codejourney.space) — a free map of tech careers. Code Journey shows what each tech role involves, the skills it needs in order, and the best official docs and free resources for each. It does not teach courses, sell anything, give certificates or place people in jobs.

Answer ONLY from the numbered sources provided with each question. They come from Code Journey's own pages.

Rules:
- Cite sources inline with their numbers, like [1] or [2][3], right after the sentence they support.
- If the sources don't contain the answer, say "Code Journey doesn't cover that yet" in one sentence, then point to the closest source page if one is relevant. Do not answer from general knowledge.
- Only use links that appear in the sources. Never invent URLs, resources, numbers or salaries.
- Questions unrelated to tech careers, learning tech or Code Journey: reply briefly that you only help with those, and suggest a related page if one fits.
- Be concise and practical: short paragraphs, numbered steps for routes and plans, bullets for options. Bold key terms sparingly.
- When someone asks how to start or what to learn, name the stages or skills in order and link the role or skill page.
- Reply in the language the user writes in.`;

export function formatSources(sources: Source[]) {
  return sources.map((s, i) => `[${i + 1}] ${s.title}${s.heading ? ` — ${s.heading}` : ""}\nPage: ${s.url}\n${s.content}`).join("\n\n");
}

// Splits Code Journey content into retrievable passages for CJ AI.
// Each passage starts with its page and section so it makes sense on its own.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import YAML from "yaml";

const ROOT = path.join(process.cwd(), "content");

export type Chunk = { key: string; source_type: string; url: string; title: string; heading: string; content: string; content_hash: string };

type Res = { title: string; url?: string; provider?: string; type: string; cost?: string; official?: boolean };

const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const md = (dir: string) => fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith(".md")).sort();
const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
const list = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n");
const resLine = (r: Res) => `${r.title}${r.provider ? ` (${r.provider})` : ""} — ${r.official ? "official, " : ""}${r.type}, ${r.cost ?? "free"}${r.url ? ` — ${r.url}` : ""}`;

/** Split Markdown body into sections by "## " headings. */
function sections(body: string) {
  const out: { heading: string; text: string }[] = [];
  let cur = { heading: "", text: "" };
  for (const line of body.split("\n")) {
    const h = line.match(/^##\s+(.*)/);
    if (h) {
      if (cur.text.trim()) out.push(cur);
      cur = { heading: h[1].trim(), text: "" };
    } else cur.text += line + "\n";
  }
  if (cur.text.trim()) out.push(cur);
  return out;
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function buildChunks(): Chunk[] {
  const cat = YAML.parse(read("catalog.yaml")) as {
    domains: { slug: string; name: string; tagline: string }[];
    roles: { slug: string; title: string; domain: string; oneLiner: string }[];
    skills: { slug: string; title: string; domain: string }[];
  };
  const skillTitle = new Map(cat.skills.map((s) => [s.slug, s.title]));
  const roleTitle = new Map(cat.roles.map((r) => [r.slug, r.title]));
  const domainName = new Map(cat.domains.map((d) => [d.slug, d.name]));
  const st = (slugs: string[]) => slugs.map((s) => skillTitle.get(s) ?? s).join(", ");

  const chunks: Omit<Chunk, "content_hash">[] = [];
  const add = (c: Omit<Chunk, "content_hash" | "content"> & { body: string }) =>
    chunks.push({ key: c.key, source_type: c.source_type, url: c.url, title: c.title, heading: c.heading, content: `${c.title}${c.heading ? ` — ${c.heading}` : ""}\n\n${c.body.trim()}` });

  /* Roles */
  for (const f of md("roles")) {
    const slug = f.replace(/\.md$/, "");
    const { data: r, content } = matter(read(`roles/${f}`));
    const url = `/roles/${slug}`;
    const title = `${r.title} (career route)`;
    add({
      key: `role:${slug}#overview`, source_type: "role", url, title, heading: "What the job is",
      body: `${r.summary}\n\nAlso called: ${r.aliases.join(", ")}.\nField: ${domainName.get(cat.roles.find((x) => x.slug === slug)?.domain ?? "")}.\nWhere they work: ${r.whereTheyWork}\n\nA week in the life:\n${list(r.dayInLife)}\n\nTools: ${r.tools.join(", ")}.`,
    });
    r.stages.forEach((s: { name: string; summary: string; skills: string[]; project: string; doneWhen: string; weeks?: string }, i: number) =>
      add({
        key: `role:${slug}#stage-${i + 1}`, source_type: "role", url: `${url}#route`, title, heading: `Stage ${i + 1} of ${r.stages.length}: ${s.name}`,
        body: `${s.summary}\nSkills in this stage, in order: ${st(s.skills)}.\nProject to build: ${s.project}\nYou're done when: ${s.doneWhen}${s.weeks ? `\nRough time: ${s.weeks} weeks at about 10 hours a week.` : ""}`,
      }),
    );
    add({
      key: `role:${slug}#skills`, source_type: "role", url: `${url}#skills`, title, heading: "Skills by priority",
      body: `Must have: ${st(r.skills.must)}.\nShould have: ${st(r.skills.should)}.\nNice to have: ${st(r.skills.nice)}.\nThe full route: ${r.stages.map((s: { name: string; skills: string[] }) => `${s.name} (${st(s.skills)})`).join(" → ")}.`,
    });
    add({
      key: `role:${slug}#interviews`, source_type: "role", url: `${url}#interviews`, title, heading: "Interviews and where to practise",
      body: `Typical interview rounds:\n${list(r.interview.rounds)}\n\nWhere to practise:\n${list(r.interview.practice.map(resLine))}`,
    });
    add({
      key: `role:${slug}#market`, source_type: "role", url: `${url}#market`, title, heading: "The market and how AI is changing the role",
      body: `${r.aiImpact}\n\n${list(r.market.map((m: { text: string }) => m.text))}\n\nRelated roles: ${r.adjacent.map((a: string) => roleTitle.get(a) ?? a).join(", ")}.`,
    });
    for (const s of sections(content)) add({ key: `role:${slug}#${slugify(s.heading)}`, source_type: "role", url: `${url}#more`, title, heading: s.heading, body: s.text });
  }

  /* Skills */
  for (const f of md("skills")) {
    const slug = f.replace(/\.md$/, "");
    const { data: s, content } = matter(read(`skills/${f}`));
    const url = `/skills/${slug}`;
    const title = `${s.title} (skill)`;
    add({
      key: `skill:${slug}#brief`, source_type: "skill", url, title, heading: "60-second brief",
      body: `${s.brief}\nLevel: ${s.level}.${s.hours ? ` Time to get comfortable: ${s.hours} hours.` : ""}\n${s.prereqs.length ? `Learn first: ${st(s.prereqs)}.` : "No prerequisites."}\nField: ${domainName.get(s.domain)}.`,
    });
    add({
      key: `skill:${slug}#learn`, source_type: "skill", url, title, heading: "What to learn, in order",
      body: list(s.learn.map((l: { topic: string; detail: string }) => `${l.topic}: ${l.detail}`)),
    });
    add({
      key: `skill:${slug}#resources`, source_type: "skill", url: `${url}`, title, heading: "Best resources to learn it",
      body: `Official documentation comes first, then the best free material.\n${list((s.resources as Res[]).map(resLine))}`,
    });
    for (const sec of sections(content)) add({ key: `skill:${slug}#${slugify(sec.heading)}`, source_type: "skill", url, title, heading: sec.heading, body: sec.text });
  }

  /* Which roles use each skill — answers "which jobs need SQL?" */
  const usage = new Map<string, string[]>();
  for (const f of md("roles")) {
    const { data: r } = matter(read(`roles/${f}`));
    const all = new Set<string>([...r.stages.flatMap((s: { skills: string[] }) => s.skills), ...Object.values(r.skills as Record<string, string[]>).flat()]);
    for (const sk of all) usage.set(sk, [...(usage.get(sk) ?? []), r.title]);
  }
  for (const [sk, roles] of usage) {
    if (!skillTitle.has(sk)) continue;
    add({ key: `skill:${sk}#roles`, source_type: "skill", url: `/skills/${sk}`, title: `${skillTitle.get(sk)} (skill)`, heading: "Roles that need it", body: `${skillTitle.get(sk)} is on these Code Journey routes: ${roles.join(", ")}.` });
  }

  /* Domains */
  for (const d of cat.domains) {
    const roles = cat.roles.filter((r) => r.domain === d.slug);
    const skills = cat.skills.filter((s) => s.domain === d.slug);
    add({
      key: `domain:${d.slug}`, source_type: "domain", url: `/domains/${d.slug}`, title: `${d.name} (field of tech)`, heading: "Roles and skills in this field",
      body: `${d.tagline}\n${roles.length ? `Roles: ${roles.map((r) => `${r.title} — ${r.oneLiner}`).join(" ")}\n` : ""}Skills: ${skills.map((s) => s.title).join(", ")}.`,
    });
  }

  /* Glossary */
  for (const t of YAML.parse(read("glossary.yaml")) as { term: string; slug: string; category: string; definition: string }[]) {
    add({ key: `term:${t.slug}`, source_type: "term", url: `/glossary/${t.slug}`, title: `${t.term} (glossary)`, heading: t.category, body: t.definition });
  }

  /* Blog */
  for (const f of md("blog")) {
    const slug = f.replace(/\.md$/, "");
    const { data: p, content } = matter(read(`blog/${f}`));
    for (const s of sections(content)) add({ key: `post:${slug}#${slugify(s.heading)}`, source_type: "post", url: `/blog/${slug}`, title: `${p.title} (blog)`, heading: s.heading, body: s.text });
  }

  /* FAQ */
  for (const g of YAML.parse(read("faq.yaml")) as { group: string; items: { q: string; a: string }[] }[]) {
    for (const it of g.items) add({ key: `faq:${slugify(it.q)}`, source_type: "faq", url: "/faq", title: "Code Journey FAQ", heading: it.q, body: it.a });
  }

  /* Site guide: where things are */
  add({
    key: "guide:site", source_type: "guide", url: "/about", title: "Code Journey (site guide)", heading: "What's on the site and where",
    body: [
      "Code Journey is a free map of tech careers. It does not teach courses or sell anything; it shows each role's route and links to the best official docs and free resources.",
      `All ${cat.roles.length} career routes are at /roles. Each route has stages, skills by priority, interviews, and how AI is changing the role.`,
      "Not sure which role fits? The Compass quiz at /compass asks eight questions and suggests three roles with reasons. Compare any two roles side by side — shared skills, time to job-ready, interviews — at /roles/compare.",
      `All ${cat.skills.length} skills are at /skills, each with a 60-second brief, a learning checklist and checked resources.`,
      "Fields of tech (web, mobile, data, AI, cloud & DevOps, quality, security, customer-facing, specialist, foundations) are at /domains.",
      "The resource library with filters is at /resources. Plain-English definitions are at /glossary. Short code snippets are at /snippets. Articles are at /blog.",
      "Search everything with Ctrl+K or \u2318K. Four colour themes are available from the palette icon, and a signed-in person can save their theme to their account.",
      "A free account unlocks CJ AI and My Path: pick a destination role, mark each skill on that route as learning or done, and see your progress, next stations and hours left at /me. Reading every page stays free without an account.",
      `Contact: work.codejourney@gmail.com.`,
    ].join("\n"),
  });

  return chunks.map((c) => ({ ...c, content_hash: hash(c.content) }));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const c = buildChunks();
  const by = c.reduce<Record<string, number>>((a, x) => ((a[x.source_type] = (a[x.source_type] ?? 0) + 1), a), {});
  const lens = c.map((x) => x.content.length).sort((a, b) => a - b);
  console.log(`${c.length} chunks`, by, `chars p50=${lens[Math.floor(lens.length / 2)]} max=${lens.at(-1)}`);
  const dup = c.length - new Set(c.map((x) => x.key)).size;
  if (dup) throw new Error(`${dup} duplicate chunk keys`);
}

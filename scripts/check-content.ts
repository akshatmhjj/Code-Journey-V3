// Cross-checks content references before every build: skills, roles, prereqs, domains and duplicates.
// Schema validation of each file happens in src/lib/content.ts at build time; this catches broken links between files.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";

const ROOT = path.join(process.cwd(), "content");
const errors: string[] = [];
const warn: string[] = [];

type Catalog = { domains: { slug: string }[]; roles: { slug: string; domain: string }[]; skills: { slug: string; domain: string }[] };
const cat: Catalog = YAML.parse(fs.readFileSync(path.join(ROOT, "catalog.yaml"), "utf8"));
const domains = new Set(cat.domains.map((d) => d.slug));
const roles = new Set(cat.roles.map((r) => r.slug));
const skills = new Set(cat.skills.map((s) => s.slug));

const ALLOWED = { role: ["slug", "title", "domain", "wave", "oneLiner"], skill: ["slug", "title", "domain"] };
for (const [kind, list] of [["role", cat.roles], ["skill", cat.skills]] as const) {
  const seen = new Set<string>();
  for (const x of list) {
    // An unquoted comma inside a { … } entry silently splits the value into extra keys.
    const extra = Object.keys(x).filter((k) => !ALLOWED[kind].includes(k));
    if (extra.length) errors.push(`catalog: ${kind} "${x.slug}" has unexpected keys (${extra.join(", ")}) - quote values that contain commas`);
    if (seen.has(x.slug)) errors.push(`catalog: duplicate ${kind} "${x.slug}"`);
    seen.add(x.slug);
    if (!domains.has(x.domain)) errors.push(`catalog: ${kind} "${x.slug}" has unknown domain "${x.domain}"`);
  }
}

const md = (dir: string) => (fs.existsSync(path.join(ROOT, dir)) ? fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith(".md")) : []);

for (const f of md("skills")) {
  const slug = f.replace(/\.md$/, "");
  const { data } = matter(fs.readFileSync(path.join(ROOT, "skills", f), "utf8"));
  if (!skills.has(slug)) errors.push(`skills/${f}: not listed in catalog.yaml`);
  for (const p of data.prereqs ?? []) if (!skills.has(p)) errors.push(`skills/${f}: unknown prereq "${p}"`);
  const urls = (data.resources ?? []).map((r: { url: string }) => r.url);
  if (new Set(urls).size !== urls.length) errors.push(`skills/${f}: duplicate resource URL`);
  if (!(data.resources ?? []).some((r: { official?: boolean }) => r.official)) warn.push(`skills/${f}: no official resource`);
}

for (const f of md("roles")) {
  const slug = f.replace(/\.md$/, "");
  const { data } = matter(fs.readFileSync(path.join(ROOT, "roles", f), "utf8"));
  if (!roles.has(slug)) errors.push(`roles/${f}: not listed in catalog.yaml`);
  const refs = [...(data.stages ?? []).flatMap((s: { skills: string[] }) => s.skills), ...Object.values(data.skills ?? {}).flat()] as string[];
  for (const s of refs) if (!skills.has(s)) errors.push(`roles/${f}: unknown skill "${s}"`);
  for (const a of data.adjacent ?? []) if (!roles.has(a)) errors.push(`roles/${f}: unknown adjacent role "${a}"`);
}

// Compass: every weighted role must exist, and every role must be reachable.
{
  const compass = YAML.parse(fs.readFileSync(path.join(ROOT, "compass.yaml"), "utf8")) as { questions: { id: string; options: { weights: Record<string, number> }[] }[] };
  const reached = new Set<string>();
  for (const q of compass.questions)
    for (const o of q.options)
      for (const r of Object.keys(o.weights)) {
        if (!roles.has(r)) errors.push(`compass.yaml (${q.id}): unknown role "${r}"`);
        reached.add(r);
      }
  for (const r of roles) if (!reached.has(r)) warn.push(`compass.yaml: role "${r}" can never be suggested`);
}

// Gap analyser aliases: every skill key must exist.
{
  const al = YAML.parse(fs.readFileSync(path.join(ROOT, "skill-aliases.yaml"), "utf8")) as { skills: Record<string, unknown> };
  for (const k of Object.keys(al.skills ?? {})) if (!skills.has(k)) errors.push(`skill-aliases.yaml: unknown skill "${k}"`);
}

// Market data: every role is listed, and every pointer resolves.
{
  const m = YAML.parse(fs.readFileSync(path.join(ROOT, "market.yaml"), "utf8")) as {
    india: Record<string, unknown>;
    us: Record<string, unknown>;
    roles: Record<string, { india?: string; us?: string }>;
  };
  for (const [slug, r] of Object.entries(m.roles ?? {})) {
    if (!roles.has(slug)) errors.push(`market.yaml: unknown role "${slug}"`);
    if (r?.india && !m.india?.[r.india]) errors.push(`market.yaml: ${slug} → unknown india key "${r.india}"`);
    if (r?.us && !m.us?.[r.us]) errors.push(`market.yaml: ${slug} → unknown us key "${r.us}"`);
  }
  for (const r of roles) if (!(r in (m.roles ?? {}))) warn.push(`market.yaml: role "${r}" has no market entry`);
}

// Parse the standalone data files too, so a YAML slip fails here rather than mid-build.
for (const f of ["glossary.yaml", "faq.yaml", "changelog.yaml"]) {
  try {
    YAML.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
  } catch (e) {
    errors.push(`${f}: ${(e as Error).message.split("\n")[0]}`);
  }
}
try {
  JSON.parse(fs.readFileSync(path.join(ROOT, "snippets.json"), "utf8"));
} catch (e) {
  errors.push(`snippets.json: ${(e as Error).message}`);
}

for (const w of warn) console.warn("warn:", w);
if (errors.length) {
  for (const e of errors) console.error("error:", e);
  process.exit(1);
}
console.log(`content ok: ${cat.roles.length} roles, ${cat.skills.length} skills, ${md("roles").length + md("skills").length} written pages`);

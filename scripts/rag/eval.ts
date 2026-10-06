// Measures CJ AI retrieval: does the right page come back in the top results?
// Also measures similarity on off-topic questions, to calibrate CJ_MIN_SIMILARITY.
// Usage: node --env-file-if-exists=.env scripts/rag/eval.ts [--json report.json] [--min-hit 0.85]
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { createClient } from "@supabase/supabase-js";
import { embedQuery } from "../../src/lib/gemini.ts";

const ROOT = path.join(process.cwd(), "content");
const cat = YAML.parse(fs.readFileSync(path.join(ROOT, "catalog.yaml"), "utf8")) as {
  roles: { slug: string; title: string }[];
  skills: { slug: string; title: string }[];
};
const terms = YAML.parse(fs.readFileSync(path.join(ROOT, "glossary.yaml"), "utf8")) as { term: string; slug: string }[];
const short = (t: string) => t.replace(/\s*\(.*\)$/, "");

type Case = { q: string; expect: string[] };
const cases: Case[] = [
  ...cat.roles.map((r) => ({ q: `What does a ${r.title} do day to day?`, expect: [`/roles/${r.slug}`] })),
  ...cat.roles.map((r) => ({ q: `How long does it take to become a ${r.title}?`, expect: [`/roles/${r.slug}`] })),
  ...cat.skills.map((s) => ({ q: `What are the best resources to learn ${short(s.title)}?`, expect: [`/skills/${s.slug}`] })),
  ...terms.map((t) => ({ q: `What is ${t.term}?`, expect: [`/glossary/${t.slug}`, `/skills/`] })),
  // Paraphrases that never name the role or skill.
  { q: "I like making things people see and click in the browser. Which job fits me?", expect: ["/roles/frontend-engineer", "/roles/design-engineer"] },
  { q: "Which role keeps websites online at 3am and writes postmortems?", expect: ["/roles/site-reliability-engineer", "/skills/incident-response"] },
  { q: "I want to build chatbots that answer from company documents", expect: ["/roles/ai-engineer", "/skills/rag"] },
  { q: "job where you build dashboards for managers", expect: ["/roles/data-analyst", "/skills/bi-tools"] },
  { q: "how do I put my app on the play store and app store", expect: ["/skills/app-store-publishing"] },
  { q: "career that writes software for tiny chips in devices", expect: ["/roles/embedded-engineer", "/skills/microcontrollers"] },
  { q: "who builds the pipelines that move data into the warehouse every night", expect: ["/roles/data-engineer", "/skills/airflow", "/skills/data-warehouses"] },
  { q: "engineer who works on-site with customers and writes code for them", expect: ["/roles/forward-deployed-engineer"] },
  { q: "how to stop hackers getting into my web app", expect: ["/skills/web-security", "/skills/owasp-top-10", "/roles/application-security-engineer"] },
  { q: "describe servers and networks as code instead of clicking", expect: ["/skills/terraform"] },
  { q: "making games with C#", expect: ["/roles/game-developer", "/skills/unity", "/skills/csharp"] },
  { q: "testing that releases won't break things, automated in the browser", expect: ["/roles/qa-sdet", "/skills/playwright", "/skills/test-automation"] },
  { q: "what should a complete beginner learn first", expect: ["/domains/foundations", "/skills/how-the-internet-works", "/skills/git", "/faq", "/about", "/skills/html", "/skills/python"] },
  { q: "is code journey free and do you sell courses", expect: ["/faq", "/about"] },
  { q: "what questions do they ask in frontend interviews", expect: ["/roles/frontend-engineer", "/skills/interviewing"] },
  { q: "difference between data analyst and data scientist", expect: ["/roles/data-analyst", "/roles/data-scientist"] },
  { q: "how is AI changing jobs for backend developers", expect: ["/roles/backend-engineer"] },
  { q: "what is the test pyramid", expect: ["/skills/testing-basics", "/skills/test-automation", "/skills/test-design"] },
  { q: "keep a copy of results so the database isn't hit every time", expect: ["/skills/caching"] },
  { q: "measure if an LLM feature actually got better after a prompt change", expect: ["/skills/llm-evals", "/skills/prompt-engineering"] },
];

const OFF_TOPIC = [
  "What's a good recipe for butter chicken?",
  "Who won the football World Cup in 2018?",
  "Write me a poem about the sea",
  "What is the capital of Australia?",
  "Should I invest in index funds?",
  "How do I fix a leaking tap?",
  "Recommend a romantic movie for tonight",
  "What are the symptoms of the flu?",
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
const db = createClient(url!, anon!, { auth: { persistSession: false } });

type Match = { url: string; similarity: number };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function embedPatiently(q: string): Promise<number[]> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await embedQuery(q);
    } catch (e) {
      const status = (e as { status?: number }).status ?? 0;
      if (attempt >= 8 || ![429, 500, 503].includes(status)) throw e;
      await sleep(Math.min(2 ** attempt * 4000, 65_000));
    }
  }
}

async function search(q: string): Promise<Match[]> {
  const v = await embedPatiently(q);
  const { data, error } = await db.rpc("match_doc_chunks", { query_embedding: JSON.stringify(v), query_text: q, match_count: 8 });
  if (error) throw error;
  return data as Match[];
}

async function pool<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

const K = 5;
const results = await pool(cases, 2, async (c) => {
  const m = await search(c.q);
  const urls = m.map((x) => x.url.split("#")[0]);
  const rank = urls.slice(0, K).findIndex((u) => c.expect.some((e) => u === e || (e.endsWith("/") && u.startsWith(e))));
  return { ...c, rank, top: urls.slice(0, 3), topSim: m[0]?.similarity ?? 0 };
});
const off = await pool(OFF_TOPIC, 2, async (q) => ({ q, topSim: (await search(q))[0]?.similarity ?? 0 }));

const hits = results.filter((r) => r.rank >= 0);
const mrr = results.reduce((a, r) => a + (r.rank >= 0 ? 1 / (r.rank + 1) : 0), 0) / results.length;
const onSims = results.map((r) => r.topSim).sort((a, b) => a - b);
const offSims = off.map((o) => o.topSim).sort((a, b) => a - b);
const pct = (xs: number[], p: number) => xs[Math.min(xs.length - 1, Math.floor(p * xs.length))];

for (const r of results.filter((r) => r.rank < 0)) console.log(`miss  ${r.q}\n      expected ${r.expect.join(" | ")}\n      got      ${r.top.join(" | ")}`);
console.log(`\nhit@${K}: ${hits.length}/${results.length} (${((hits.length / results.length) * 100).toFixed(1)}%) · MRR ${mrr.toFixed(3)}`);
console.log(`top similarity — on-topic p5 ${pct(onSims, 0.05).toFixed(3)} p50 ${pct(onSims, 0.5).toFixed(3)} · off-topic max ${offSims.at(-1)!.toFixed(3)} median ${pct(offSims, 0.5).toFixed(3)}`);
for (const o of off) console.log(`  off-topic ${o.topSim.toFixed(3)}  ${o.q}`);

const j = process.argv.indexOf("--json");
if (j > -1) fs.writeFileSync(process.argv[j + 1], JSON.stringify({ hitRate: hits.length / results.length, mrr, results, off }, null, 2));
const m = process.argv.indexOf("--min-hit");
if (m > -1 && hits.length / results.length < Number(process.argv[m + 1])) process.exit(1);

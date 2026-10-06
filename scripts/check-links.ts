// Checks every external link in content/ (skill resources, interview practice, market sources).
// Exits 1 if any link is broken (404/410/5xx/DNS failure). Sites that block bots (401/403/429) are reported as warnings.
// Usage: node scripts/check-links.ts [--json report.json]
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");
const UA = "Mozilla/5.0 (compatible; CodeJourneyLinkCheck/1.0; +https://www.codejourney.space/about)";
const CONCURRENCY = 8;

type Link = { url: string; where: string };
const links: Link[] = [];

function collect(obj: unknown, where: string) {
  if (Array.isArray(obj)) obj.forEach((x) => collect(x, where));
  else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (k === "url" && typeof v === "string" && /^https?:\/\//.test(v)) links.push({ url: v, where });
      else collect(v, where);
    }
  }
}

for (const dir of ["skills", "roles"]) {
  for (const f of fs.readdirSync(path.join(ROOT, dir)).filter((x) => x.endsWith(".md"))) {
    const { data, content } = matter(fs.readFileSync(path.join(ROOT, dir, f), "utf8"));
    collect(data, `${dir}/${f}`);
    for (const m of content.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) links.push({ url: m[1], where: `${dir}/${f}` });
  }
}

const unique = new Map<string, string[]>();
for (const l of links) unique.set(l.url, [...(unique.get(l.url) ?? []), l.where]);

async function check(url: string): Promise<{ status: number | string; ok: boolean; blocked: boolean }> {
  for (const method of ["HEAD", "GET"]) {
    try {
      const r = await fetch(url, { method, redirect: "follow", headers: { "User-Agent": UA, Accept: "text/html,*/*" }, signal: AbortSignal.timeout(20_000) });
      if (r.ok) return { status: r.status, ok: true, blocked: false };
      if (method === "HEAD" && [403, 405, 400, 404, 429, 501].includes(r.status)) continue; // some servers reject HEAD
      return { status: r.status, ok: false, blocked: [401, 403, 429, 999].includes(r.status) };
    } catch (e) {
      if (method === "GET") return { status: (e as Error).name === "TimeoutError" ? "timeout" : "network error", ok: false, blocked: false };
    }
  }
  return { status: "unknown", ok: false, blocked: false };
}

const queue = [...unique.keys()];
const results: { url: string; status: number | string; ok: boolean; blocked: boolean; where: string[] }[] = [];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const url = queue.shift()!;
      let r = await check(url);
      if (!r.ok && typeof r.status === "string") r = await check(url); // one retry for network blips
      results.push({ url, ...r, where: unique.get(url)! });
    }
  }),
);

const broken = results.filter((r) => !r.ok && !r.blocked);
const blocked = results.filter((r) => r.blocked);
for (const b of blocked) console.warn(`blocked ${b.status}  ${b.url}  (${b.where.join(", ")})`);
for (const b of broken) console.error(`BROKEN  ${b.status}  ${b.url}  (${b.where.join(", ")})`);
console.log(`\n${results.length} unique links · ${results.length - broken.length - blocked.length} ok · ${blocked.length} blocked by site · ${broken.length} broken`);

const jsonArg = process.argv.indexOf("--json");
if (jsonArg > -1) fs.writeFileSync(process.argv[jsonArg + 1], JSON.stringify({ checkedAt: new Date().toISOString(), broken, blocked }, null, 2));
process.exit(broken.length ? 1 : 0);

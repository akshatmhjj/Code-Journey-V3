// Syncs content/ into Supabase doc_chunks for CJ AI.
// Only new or changed passages are embedded; passages for removed content are deleted.
// Needs: SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, and the Supabase URL.
// Usage: node --env-file-if-exists=.env scripts/rag/ingest.ts [--dry-run]
import { createClient } from "@supabase/supabase-js";
import { buildChunks, type Chunk } from "./chunks.ts";
import { embedDocuments } from "../../src/lib/gemini.ts";

const DRY = process.argv.includes("--dry-run");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function existing() {
  const map = new Map<string, string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from("doc_chunks").select("key, content_hash").range(from, from + 999);
    if (error) throw error;
    for (const r of data) map.set(r.key, r.content_hash);
    if (data.length < 1000) break;
  }
  return map;
}

async function embedWithRetry(batch: Chunk[]) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await embedDocuments(batch.map((c) => ({ title: c.title, text: c.content })));
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (attempt < 5 && (status === 429 || (status ?? 0) >= 500)) {
        const wait = 2 ** attempt * 2000;
        console.warn(`  rate limited (${status}); retrying in ${wait / 1000}s`);
        await sleep(wait);
        continue;
      }
      throw e;
    }
  }
}

const chunks = buildChunks();
const have = await existing();
const changed = chunks.filter((c) => have.get(c.key) !== c.content_hash);
const keep = new Set(chunks.map((c) => c.key));
const stale = [...have.keys()].filter((k) => !keep.has(k));
console.log(`${chunks.length} passages · ${changed.length} new or changed · ${stale.length} to remove${DRY ? " · dry run" : ""}`);
if (DRY) process.exit(0);

for (let i = 0; i < changed.length; i += 100) {
  const batch = changed.slice(i, i + 100);
  const vectors = await embedWithRetry(batch);
  const rows = batch.map((c, j) => ({ ...c, embedding: JSON.stringify(vectors[j]), updated_at: new Date().toISOString() }));
  const { error } = await db.from("doc_chunks").upsert(rows, { onConflict: "key" });
  if (error) throw error;
  console.log(`  embedded ${Math.min(i + 100, changed.length)}/${changed.length}`);
}

for (let i = 0; i < stale.length; i += 200) {
  const { error } = await db.from("doc_chunks").delete().in("key", stale.slice(i, i + 200));
  if (error) throw error;
}
console.log("done");

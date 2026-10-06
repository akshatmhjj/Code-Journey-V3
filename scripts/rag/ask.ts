// Ask CJ AI from the terminal, without signing in — for checking retrieval and answers locally.
// Uses search + the grounded prompt (not the role/skill exact lookup, which needs the Next.js runtime).
// Usage: node --env-file-if-exists=.env scripts/rag/ask.ts "How do I become a data engineer?"
import { createClient } from "@supabase/supabase-js";
import { embedQuery, streamAnswer } from "../../src/lib/gemini.ts";
import { formatSources, SYSTEM_PROMPT, type Source } from "../../src/lib/rag-prompt.ts";

const question = process.argv.slice(2).join(" ").trim();
if (!question) {
  console.error('Usage: npm run rag:ask -- "your question"');
  process.exit(1);
}
const db = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)!,
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY)!,
  { auth: { persistSession: false } },
);

let vector: number[] | null = null;
try {
  vector = await embedQuery(question);
} catch (e) {
  console.warn(`(embedding unavailable: ${(e as { status?: number }).status}; keyword search only)`);
}
const { data, error } = await db.rpc("match_doc_chunks", { ...(vector ? { query_embedding: JSON.stringify(vector) } : {}), query_text: question, match_count: 7 });
if (error) throw error;
const sources = data as Source[];
console.log("\nSources:");
sources.forEach((s, i) => console.log(`  [${i + 1}] ${s.similarity != null ? s.similarity.toFixed(3) : "  kw "}  ${s.url}  — ${s.heading}`));
console.log("\nAnswer:\n");
for await (const d of streamAnswer(SYSTEM_PROMPT, [{ role: "user", content: `Sources:\n\n${formatSources(sources)}\n\nQuestion: ${question}` }])) process.stdout.write(d);
console.log("\n");

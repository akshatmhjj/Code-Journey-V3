// Minimal Gemini REST client for CJ AI. Server-side only: it reads GEMINI_API_KEY.
// Used by the chat route and by scripts (ingest, eval), so it has no Next.js imports.

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
export const CHAT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
export const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
export const EMBED_DIMS = 768;

function key() {
  const k = process.env.GEMINI_API_KEY;
  if (!k) throw new Error("GEMINI_API_KEY is not set");
  return k;
}

async function post(path: string, body: unknown, init: RequestInit = {}) {
  const r = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key() },
    body: JSON.stringify(body),
    ...init,
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    const err = new Error(`Gemini ${r.status}: ${detail.slice(0, 300)}`) as Error & { status: number };
    err.status = r.status;
    throw err;
  }
  return r;
}

/** Embeds passages for storage (up to 100 per call). */
export async function embedDocuments(items: { title: string; text: string }[]): Promise<number[][]> {
  const r = await post(`${EMBED_MODEL}:batchEmbedContents`, {
    requests: items.map((it) => ({
      model: `models/${EMBED_MODEL}`,
      content: { parts: [{ text: it.text }] },
      taskType: "RETRIEVAL_DOCUMENT",
      title: it.title,
      outputDimensionality: EMBED_DIMS,
    })),
  });
  const data = (await r.json()) as { embeddings: { values: number[] }[] };
  return data.embeddings.map((e) => e.values);
}

/** Embeds a user question for search. */
export async function embedQuery(text: string): Promise<number[]> {
  const r = await post(`${EMBED_MODEL}:embedContent`, {
    content: { parts: [{ text }] },
    taskType: "RETRIEVAL_QUERY",
    outputDimensionality: EMBED_DIMS,
  });
  const data = (await r.json()) as { embedding: { values: number[] } };
  return data.embedding.values;
}

export type Turn = { role: "user" | "assistant"; content: string };

/** Streams an answer as text deltas. */
export async function* streamAnswer(system: string, turns: Turn[], signal?: AbortSignal): AsyncGenerator<string> {
  const r = await post(
    `${CHAT_MODEL}:streamGenerateContent?alt=sse`,
    {
      system_instruction: { parts: [{ text: system }] },
      contents: turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] })),
      generationConfig: { temperature: 0.3, topP: 0.9, maxOutputTokens: 900 },
    },
    { signal },
  );
  const reader = r.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line.startsWith("data:")) continue;
      try {
        const json = JSON.parse(line.slice(5));
        const text = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
        if (text) yield text;
      } catch {
        /* partial or keep-alive line */
      }
    }
  }
}

/** Non-streaming single answer (used by evals and the question rewriter). */
export async function generate(system: string, prompt: string, maxOutputTokens = 200): Promise<string> {
  const r = await post(`${CHAT_MODEL}:generateContent`, {
    system_instruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0, maxOutputTokens },
  });
  const data = await r.json();
  return (data?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("").trim();
}

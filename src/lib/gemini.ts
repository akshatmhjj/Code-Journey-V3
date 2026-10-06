// Minimal Gemini REST client for CJ AI. Server-side only: it reads GEMINI_API_KEY.
// Used by the chat route and by scripts (ingest, eval), so it has no Next.js imports.

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
// gemini-2.5-* is closed to new API keys; 3.x models think by default, so answers use a low thinking level.
export const CHAT_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
export const FAST_MODEL = process.env.GEMINI_FAST_MODEL ?? "gemini-flash-lite-latest";
export const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-2";
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

const busy = (e: unknown) => [429, 500, 503].includes((e as { status?: number }).status ?? 0);

/** Streams an answer as text deltas. Falls back to the fast model if the main one is overloaded before streaming starts. */
export async function* streamAnswer(system: string, turns: Turn[], signal?: AbortSignal): AsyncGenerator<string> {
  const body = (thinking: boolean) => ({
    system_instruction: { parts: [{ text: system }] },
    contents: turns.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] })),
    generationConfig: { temperature: 0.3, maxOutputTokens: 1200, ...(thinking ? { thinkingConfig: { thinkingLevel: "low" } } : {}) },
  });
  let r: Response;
  try {
    r = await post(`${CHAT_MODEL}:streamGenerateContent?alt=sse`, body(true), { signal });
  } catch (e) {
    if (!busy(e)) throw e;
    r = await post(`${FAST_MODEL}:streamGenerateContent?alt=sse`, body(false), { signal });
  }
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
        const parts: { text?: string; thought?: boolean }[] = json?.candidates?.[0]?.content?.parts ?? [];
        const text = parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("");
        if (text) yield text;
      } catch {
        /* partial or keep-alive line */
      }
    }
  }
}

/** Non-streaming short answer on the fast model (used by the question rewriter). */
export async function generate(system: string, prompt: string, maxOutputTokens = 200): Promise<string> {
  const r = await post(`${FAST_MODEL}:generateContent`, {
    system_instruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0, maxOutputTokens },
  });
  const data = await r.json();
  return (data?.candidates?.[0]?.content?.parts ?? [])
    .filter((p: { thought?: boolean }) => !p.thought)
    .map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();
}

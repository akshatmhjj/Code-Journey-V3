// CJ AI: answers only from Code Journey's own content, with citations, streamed as server-sent events.
// Events: `sources` (JSON list), `delta` (JSON string), `done`, `error` (JSON {message}).
import { createClient } from "@supabase/supabase-js";
import { embedQuery, generate, streamAnswer, type Turn } from "@/lib/gemini";
import { entitySource, findEntities, formatSources, SYSTEM_PROMPT, type Source } from "@/lib/rag";

export const maxDuration = 30;

const MAX_TURNS = 12;
const MAX_CHARS = 2000;
const DAILY_LIMIT = Number(process.env.CJ_DAILY_LIMIT ?? 40);
const MIN_SIMILARITY = Number(process.env.CJ_MIN_SIMILARITY ?? 0.55);
const MAX_SOURCES = 7;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function json(status: number, body: object) {
  return Response.json(body, { status });
}

/** Turns a follow-up like "what about interviews?" into a standalone search query. */
async function standalone(turns: Turn[]) {
  const last = turns[turns.length - 1].content;
  if (turns.length < 3) return last;
  const history = turns
    .slice(-6, -1)
    .map((t) => `${t.role === "user" ? "User" : "Assistant"}: ${t.content.slice(0, 400)}`)
    .join("\n");
  try {
    const q = await generate(
      "Rewrite the user's last message as one standalone search query about tech careers or skills, using the conversation for context. Reply with the query only.",
      `${history}\nUser: ${last}`,
      60,
    );
    return q || last;
  } catch {
    return last;
  }
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) return json(500, { error: "CJ AI is not configured." });

  // 1. Who's asking? A signed-in user is required.
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return json(401, { error: "Sign in to use CJ AI." });
  const db = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data: auth } = await db.auth.getUser(token);
  if (!auth.user) return json(401, { error: "Sign in to use CJ AI." });

  // 2. Validate input.
  let body: { messages?: { role?: string; content?: unknown }[] };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }
  const turns: Turn[] = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => typeof m?.content === "string" && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: (m.content as string).slice(0, MAX_CHARS) }));
  if (!turns.length || turns[turns.length - 1].role !== "user") return json(400, { error: "Ask a question first." });

  // 3. Daily limit.
  const { data: allowed, error: limitError } = await db.rpc("consume_chat_message", { daily_limit: DAILY_LIMIT });
  if (limitError) return json(503, { error: "CJ AI is unavailable right now. Try again shortly." });
  if (!allowed) return json(429, { error: `You've asked ${DAILY_LIMIT} questions today — that's the daily limit. It resets at midnight UTC.` });

  // 4. Retrieve: exact role/skill pages first, then hybrid search.
  const question = turns[turns.length - 1].content;
  const sources: Source[] = [];
  let confident = false;
  try {
    const query = await standalone(turns);
    const entities = findEntities(`${query} ${question}`);
    for (const e of entities) {
      const s = entitySource(e.kind, e.slug);
      if (s) sources.push(s);
    }
    const vector = await embedQuery(query);
    const { data: matches, error } = await db.rpc("match_doc_chunks", {
      query_embedding: JSON.stringify(vector),
      query_text: query,
      match_count: 10,
    });
    if (error) throw error;
    const top = (matches ?? []) as Source[];
    confident = entities.length > 0 || (top[0]?.similarity ?? 0) >= MIN_SIMILARITY;
    for (const m of top) {
      if (sources.length >= MAX_SOURCES) break;
      if (!sources.some((s) => s.key === m.key)) sources.push(m);
    }
  } catch (e) {
    console.error("CJ AI retrieval failed", e);
    return json(503, { error: "CJ AI is unavailable right now. Try again shortly." });
  }

  // 5. Stream the answer.
  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController, event: string, data: unknown) =>
    controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

  const shown = confident ? sources : sources.slice(0, 3);
  const stream = new ReadableStream({
    async start(controller) {
      send(controller, "sources", shown.map((s, i) => ({ n: i + 1, title: s.title, heading: s.heading, url: s.url })));
      try {
        if (!confident) {
          send(
            controller,
            "delta",
            "Code Journey doesn't cover that yet. I can help with tech careers, the skills each role needs and where to learn them" +
              (shown.length ? " — these pages are the closest match:" : "."),
          );
        } else {
          const prompt = `Sources:\n\n${formatSources(sources)}\n\nQuestion: ${question}`;
          const history = turns.slice(0, -1);
          for await (const delta of streamAnswer(SYSTEM_PROMPT, [...history, { role: "user", content: prompt }], req.signal)) {
            send(controller, "delta", delta);
          }
        }
        send(controller, "done", {});
      } catch (e) {
        const status = (e as { status?: number }).status;
        console.error("CJ AI generation failed", e);
        send(controller, "error", { message: status === 429 ? "CJ AI is busy. Try again in a minute." : "CJ AI couldn't finish that answer. Try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}

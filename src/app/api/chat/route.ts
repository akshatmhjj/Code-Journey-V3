// CJ AI: proxies Gemini on the server so the key never reaches the browser.
// Phase 3 replaces the static prompt with retrieval over Code Journey content.

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const MAX_MESSAGES = 20;
const MAX_CHARS = 4000;

const SYSTEM_PROMPT = `You are CJ AI, the assistant for Code Journey (codejourney.space) — a free map of tech careers. For each role it shows the skills needed, in what order, and the best official docs and free resources to learn them. Code Journey curates; it does not teach courses or sell anything.

WHAT YOU HELP WITH:
1. What a tech role involves and which skills it needs (web, mobile, data, AI, DevOps, testing, security and related fields)
2. Explaining programming and tech concepts in plain English
3. Pointing to official documentation and well-known free resources
4. Finding things on Code Journey: /roles, /skills, /resources, /glossary, /blog

HOW YOU RESPOND:
- Concise and complete. If 3 sentences answer it, use 3.
- Code in triple backticks with the language name. **Bold** for key terms.
- Numbered lists for steps, bullets for options.

WHAT YOU DON'T DO:
- Topics unrelated to tech careers, learning tech, or Code Journey
- Essays, stories, poems; financial, legal or medical advice
- Claim Code Journey has features it does not have (no courses, IDE, certificates or job placement)

Out of scope reply: "I'm CJ AI — I help with tech careers, coding and Code Journey. For that topic, I'd suggest searching elsewhere."`;

function json(status: number, body: object) {
  return Response.json(body, { status });
}

async function getUser(token: string) {
  if (!token) return null;
  const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "" },
  });
  return r.ok ? r.json() : null;
}

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return json(500, { error: "Chat is not configured." });

  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const user = await getUser(token).catch(() => null);
  if (!user) return json(401, { error: "Sign in to use CJ AI." });

  let body: { messages?: { role?: string; content?: unknown }[] };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  const contents = (Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [])
    .filter((m) => typeof m?.content === "string" && m.content.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: (m.content as string).slice(0, MAX_CHARS) }],
    }));
  if (!contents.length) return json(400, { error: "Message is empty." });

  const r = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.6, topP: 0.85, maxOutputTokens: 1024 },
    }),
  });

  if (!r.ok) {
    if (r.status === 429) return json(429, { error: "CJ AI is busy. Try again in a minute." });
    return json(502, { error: "CJ AI is unavailable right now." });
  }
  const data = await r.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) return json(502, { error: "No answer came back. Try rephrasing." });
  return json(200, { text });
}

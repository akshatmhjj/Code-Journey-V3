// Server-side proxy for CJ AI. Keeps the Gemini key off the client.
// Runs as a Vercel Node function in production and via the dev middleware in vite.config.js locally.

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const MAX_MESSAGES = 20;
const MAX_CHARS = 4000;

const SYSTEM_PROMPT = `You are CJ AI, the assistant for Code Journey — a free platform that maps tech careers and points learners to the best resources for each skill. Code Journey curates; it does not sell courses.

WHAT YOU HELP WITH:
1. Explaining programming and tech concepts in plain English
2. What a tech role involves and which skills it needs (web, mobile, data, AI, DevOps, testing and related fields)
3. Pointing to official documentation and well-known free resources
4. Questions about Code Journey pages: tracks, roadmap, glossary, snippets, blog, profile

HOW YOU RESPOND:
- Concise and complete. If 3 sentences answer it, use 3.
- Code in triple backticks with the language name. **Bold** for key terms.
- Numbered lists for steps, bullets for options.

WHAT YOU DON'T DO:
- Topics unrelated to tech, learning tech, or Code Journey
- Essays, stories, poems; financial, legal or medical advice
- Claim Code Journey has features it does not have (there is no IDE, XP, leaderboard or certificate)

Out of scope reply: "I'm CJ AI — I help with tech careers, coding and Code Journey. For that topic, I'd suggest searching elsewhere."`;

function readBody(req) {
  if (req.body) return Promise.resolve(typeof req.body === "string" ? JSON.parse(req.body) : req.body);
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 200_000) reject(new Error("too large")); });
    req.on("end", () => { try { resolve(JSON.parse(raw || "{}")); } catch (e) { reject(e); } });
    req.on("error", reject);
  });
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

// Confirms the bearer token belongs to a signed-in Supabase user.
async function getUser(token, env) {
  if (!token) return null;
  const r = await fetch(`${env.VITE_SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: env.VITE_SUPABASE_ANON_KEY },
  });
  return r.ok ? r.json() : null;
}

export default async function handler(req, res, env = process.env) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST." });
  if (!env.GEMINI_API_KEY) return send(res, 500, { error: "Chat is not configured." });

  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const user = await getUser(token, env).catch(() => null);
  if (!user) return send(res, 401, { error: "Sign in to use CJ AI." });

  let body;
  try { body = await readBody(req); } catch { return send(res, 400, { error: "Invalid request." }); }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const contents = messages
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.slice(0, MAX_CHARS) }],
    }));
  if (!contents.length) return send(res, 400, { error: "Message is empty." });

  const r = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7, topP: 0.85, maxOutputTokens: 1024 },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    }),
  });

  if (!r.ok) {
    if (r.status === 429) return send(res, 429, { error: "Rate limit reached. Please wait a moment and try again." });
    return send(res, 502, { error: "CJ AI is unavailable right now." });
  }

  const data = await r.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return send(res, 502, { error: "No response received." });
  return send(res, 200, { text });
}

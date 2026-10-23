import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Replace the network-facing pieces with stubs. Each test decides what the database and model do.
const rpc = vi.fn();
const getUser = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ auth: { getUser }, rpc }),
}));

const embedQuery = vi.fn();
const generate = vi.fn();
let streamImpl: () => AsyncGenerator<string>;
vi.mock("@/lib/gemini", () => ({
  embedQuery: (...a: unknown[]) => embedQuery(...a),
  generate: (...a: unknown[]) => generate(...a),
  streamAnswer: () => streamImpl(),
}));

vi.mock("@/lib/rag", () => ({
  SYSTEM_PROMPT: "test prompt",
  formatSources: () => "",
  findEntities: () => [],
  entitySource: () => null,
}));

type Route = typeof import("@/app/api/chat/route");
let POST: Route["POST"];

beforeAll(async () => {
  vi.stubEnv("GEMINI_API_KEY", "test");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
  ({ POST } = await import("@/app/api/chat/route"));
});

beforeEach(() => {
  // The route logs its failures on purpose; keep the test output readable.
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  rpc.mockReset();
  getUser.mockReset().mockResolvedValue({ data: { user: { id: "u1" } } });
  embedQuery.mockReset().mockRejectedValue(new Error("no embeddings"));
  generate.mockReset().mockResolvedValue("");
  streamImpl = async function* () {
    yield "Hello";
  };
});

function request() {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { authorization: "Bearer token", "content-type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "What is SQL?" }] }),
  });
}

/** Routes each RPC name to its own answer, and records which ones ran. */
function fakeRpc(answers: Record<string, { data?: unknown; error?: unknown }>) {
  rpc.mockImplementation(async (name: string) => answers[name] ?? { data: null, error: null });
  return () => rpc.mock.calls.map((c) => c[0] as string);
}

describe("CJ AI quota refund", () => {
  it("refunds the question when retrieval fails", async () => {
    const calls = fakeRpc({
      consume_chat_message: { data: true, error: null },
      match_doc_chunks: { data: null, error: { message: "db down" } },
    });

    const res = await POST(request());

    expect(res.status).toBe(503);
    expect(calls()).toContain("refund_chat_message");
  });

  it("refunds when the model fails before any answer text", async () => {
    const calls = fakeRpc({
      consume_chat_message: { data: true, error: null },
      match_doc_chunks: { data: [{ key: "a", title: "SQL", heading: "", url: "/skills/sql", similarity: 0.9 }], error: null },
    });
    streamImpl = async function* () {
      throw Object.assign(new Error("quota"), { status: 429 });
    };

    const res = await POST(request());
    const body = await res.text();

    expect(body).toContain("event: error");
    expect(calls()).toContain("refund_chat_message");
  });

  it("keeps the question counted once an answer has started", async () => {
    const calls = fakeRpc({
      consume_chat_message: { data: true, error: null },
      match_doc_chunks: { data: [{ key: "a", title: "SQL", heading: "", url: "/skills/sql", similarity: 0.9 }], error: null },
    });
    streamImpl = async function* () {
      yield "Partial";
      throw new Error("connection dropped");
    };

    const res = await POST(request());
    await res.text();

    expect(calls()).not.toContain("refund_chat_message");
  });

  it("does not refund when the daily limit is already reached", async () => {
    const calls = fakeRpc({ consume_chat_message: { data: false, error: null } });

    const res = await POST(request());

    expect(res.status).toBe(429);
    expect(calls()).not.toContain("refund_chat_message");
  });
});

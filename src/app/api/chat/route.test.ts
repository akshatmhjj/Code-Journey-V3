import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Replace the network-facing pieces with stubs. Each test decides what the database and model do.
// `rpc` is the user's own client (anon key plus their token). `adminRpc` is the server-only service client.
const rpc = vi.fn();
const adminRpc = vi.fn();
const getUser = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: (_url: string, key: string) => (key === "service-key" ? { rpc: adminRpc } : { auth: { getUser }, rpc }),
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
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key");
  ({ POST } = await import("@/app/api/chat/route"));
});

beforeEach(() => {
  // The route logs its failures on purpose; keep the test output readable.
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  rpc.mockReset();
  adminRpc.mockReset().mockImplementation(async (name: string) => (name === "consume_visitor_chat_message" ? { data: true, error: null } : { data: null, error: null }));
  getUser.mockReset().mockResolvedValue({ data: { user: { id: "u1" } } });
  embedQuery.mockReset().mockRejectedValue(new Error("no embeddings"));
  generate.mockReset().mockResolvedValue("");
  streamImpl = async function* () {
    yield "Hello";
  };
});

/** A question from a signed-in person, or from a visitor when `signedIn` is false. */
function request({ signedIn = true, token = "token" }: { signedIn?: boolean; token?: string } = {}) {
  const headers: Record<string, string> = { "content-type": "application/json", "x-forwarded-for": "203.0.113.7" };
  if (signedIn) headers.authorization = `Bearer ${token}`;
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers,
    body: JSON.stringify({ messages: [{ role: "user", content: "What is SQL?" }] }),
  });
}

/** Routes each RPC name to its own answer, and records which ones ran. */
function fakeRpc(answers: Record<string, { data?: unknown; error?: unknown }>, client = rpc) {
  client.mockImplementation(async (name: string) => answers[name] ?? { data: null, error: null });
  return () => client.mock.calls.map((c) => c[0] as string);
}

const SOURCE = { key: "a", title: "SQL", heading: "", url: "/skills/sql", similarity: 0.9 };

describe("CJ AI quota refund for signed-in people", () => {
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
      match_doc_chunks: { data: [SOURCE], error: null },
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
      match_doc_chunks: { data: [SOURCE], error: null },
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

  it("asks for a new sign-in when the token has expired", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const res = await POST(request());

    expect(res.status).toBe(401);
    expect((await res.json()).error).toMatch(/sign in again/i);
  });
});

describe("CJ AI for visitors who are not signed in", () => {
  it("answers a visitor and counts the question against their IP, not a user", async () => {
    fakeRpc({ match_doc_chunks: { data: [SOURCE], error: null } });

    const res = await POST(request({ signedIn: false }));
    await res.text();

    expect(res.status).toBe(200);
    const names = adminRpc.mock.calls.map((c) => c[0]);
    expect(names).toContain("consume_visitor_chat_message");
    expect(rpc.mock.calls.map((c) => c[0])).not.toContain("consume_chat_message");
  });

  it("never stores the visitor's address: the key sent to the database is a hash", async () => {
    fakeRpc({ match_doc_chunks: { data: [SOURCE], error: null } });

    await (await POST(request({ signedIn: false }))).text();

    const [, args] = adminRpc.mock.calls.find((c) => c[0] === "consume_visitor_chat_message")!;
    expect(args.p_ip_hash).toMatch(/^[0-9a-f]{32}$/);
    expect(args.p_ip_hash).not.toContain("203.0.113.7");
    expect(args.daily_limit).toBe(3);
  });

  it("stops a visitor after their free questions and suggests signing up", async () => {
    adminRpc.mockImplementation(async () => ({ data: false, error: null }));

    const res = await POST(request({ signedIn: false }));

    expect(res.status).toBe(429);
    expect((await res.json()).error).toMatch(/free questions.*sign up/i);
  });

  it("refunds a visitor's question when the answer fails before any text", async () => {
    fakeRpc({ match_doc_chunks: { data: [SOURCE], error: null } });
    streamImpl = async function* () {
      throw Object.assign(new Error("quota"), { status: 429 });
    };

    await (await POST(request({ signedIn: false }))).text();

    expect(adminRpc.mock.calls.map((c) => c[0])).toContain("refund_visitor_chat_message");
  });

  it("refunds a visitor's question when retrieval fails", async () => {
    fakeRpc({ match_doc_chunks: { data: null, error: { message: "db down" } } });

    const res = await POST(request({ signedIn: false }));

    expect(res.status).toBe(503);
    expect(adminRpc.mock.calls.map((c) => c[0])).toContain("refund_visitor_chat_message");
  });
});

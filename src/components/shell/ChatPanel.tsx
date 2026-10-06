"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowUp, MessageCircle, RotateCcw, Square, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Mark } from "@/components/brand/Logo";
import { supabase, useUser } from "@/lib/supabase";
import { useUI } from "./UIProvider";

type SourceRef = { n: number; title: string; heading: string; url: string };
type Msg = {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  sources?: SourceRef[];
  streaming?: boolean;
  rated?: 1 | -1;
};

const STARTERS = [
  "How do I become a Data Engineer?",
  "Frontend or full-stack - which should I pick?",
  "What are the best free resources to learn SQL?",
];

/* Minimal Markdown for answers: code fences, lists, **bold**, `code`, [links](url) and [1] citations. */
function inline(text: string, sources: SourceRef[] = []) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\[\d+\])/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="rounded bg-surface px-1 font-mono text-[0.88em]">{p.slice(1, -1)}</code>;
    const cite = p.match(/^\[(\d+)\]$/);
    if (cite) {
      const s = sources.find((x) => x.n === Number(cite[1]));
      return s ? (
        <Link
          key={i}
          href={s.url}
          title={`${s.title}${s.heading ? ` - ${s.heading}` : ""}`}
          className="mx-px inline-grid h-[1.35em] min-w-[1.35em] place-items-center rounded-full bg-ink px-1 align-[0.12em] font-mono text-[0.7em] font-bold text-canvas no-underline hover:bg-accent hover:text-on-accent"
        >
          {s.n}
        </Link>
      ) : null;
    }
    const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2];
      const safe = href.startsWith("/") || href.startsWith("https://");
      return safe ? (
        <a key={i} href={href} className="link" target={href.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer">
          {link[1]}
        </a>
      ) : (
        <Fragment key={i}>{link[1]}</Fragment>
      );
    }
    // Bare URLs from sources become links.
    return (
      <Fragment key={i}>
        {p.split(/(https:\/\/[^\s)]+)/g).map((seg, k) =>
          seg.startsWith("https://") ? (
            <a key={k} href={seg.replace(/[.,;]+$/, "")} className="link break-all" target="_blank" rel="noopener noreferrer">
              {seg.replace(/[.,;]+$/, "")}
            </a>
          ) : (
            seg
          ),
        )}
      </Fragment>
    );
  });
}

function Answer({ text, sources }: { text: string; sources?: SourceRef[] }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const code: string[] = [];
      while (++i < lines.length && !lines[i].startsWith("```")) code.push(lines[i]);
      blocks.push(
        <pre key={i} className="overflow-x-auto rounded-[var(--radius-md)] border border-line bg-surface p-3 font-mono text-[13px] leading-relaxed">
          {code.join("\n")}
        </pre>,
      );
    } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s/, ""));
      i--;
      const L = ordered ? "ol" : "ul";
      blocks.push(
        <L key={i} className={`${ordered ? "list-decimal" : "list-[square]"} grid gap-1 pl-5`}>
          {items.map((t, k) => (
            <li key={k}>{inline(t, sources)}</li>
          ))}
        </L>,
      );
    } else if (/^#{1,4}\s/.test(line)) {
      blocks.push(
        <p key={i} className="font-display font-bold">
          {inline(line.replace(/^#+\s/, ""), sources)}
        </p>,
      );
    } else if (line.trim()) {
      blocks.push(<p key={i}>{inline(line, sources)}</p>);
    }
  }
  return <div className="grid gap-2.5">{blocks}</div>;
}

/** Reads server-sent events from the chat route. */
async function* readEvents(res: Response) {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    buf += decoder.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const raw = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const event = raw.match(/^event: (.*)$/m)?.[1] ?? "message";
      const data = raw.match(/^data: (.*)$/m)?.[1];
      yield { event, data: data ? JSON.parse(data) : null };
    }
  }
}

export function ChatPanel() {
  const ui = useUI();
  const user = useUser();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (ui.chatOpen) {
      if (ui.chatDraft) setInput(ui.chatDraft);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [ui.chatOpen, ui.chatDraft]);

  // Braces matter: newer browsers return a Promise from scrollIntoView, and React would call it as the cleanup.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs, busy]);

  const update = (fn: (m: Msg) => Msg) => setMsgs((all) => [...all.slice(0, -1), fn(all[all.length - 1])]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const history = msgs.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
    const next = [...history, { role: "user" as const, content: q }];
    setMsgs((m) => [...m.filter((x) => !x.error), { role: "user", content: q }, { role: "assistant", content: "", streaming: true }]);
    setInput("");
    setBusy(true);
    const abort = new AbortController();
    abortRef.current = abort;
    try {
      const { data } = await supabase().auth.getSession();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
        body: JSON.stringify({ messages: next }),
        signal: abort.signal,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Try again.");
      }
      for await (const { event, data: payload } of readEvents(res)) {
        if (event === "sources") update((m) => ({ ...m, sources: payload }));
        else if (event === "delta") update((m) => ({ ...m, content: m.content + payload }));
        else if (event === "error") throw new Error(payload?.message ?? "Something went wrong.");
      }
      update((m) => ({ ...m, streaming: false }));
    } catch (e) {
      if ((e as Error).name === "AbortError") update((m) => ({ ...m, streaming: false, content: m.content || "Stopped." }));
      else update((m) => ({ ...m, streaming: false, error: true, content: (e as Error).message }));
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  async function rate(index: number, rating: 1 | -1) {
    const answer = msgs[index];
    const question = [...msgs.slice(0, index)].reverse().find((m) => m.role === "user")?.content ?? "";
    setMsgs((all) => all.map((m, i) => (i === index ? { ...m, rated: rating } : m)));
    await supabase()
      .from("chat_feedback")
      .insert({ question: question.slice(0, 2000), answer: answer.content.slice(0, 8000), sources: (answer.sources ?? []).map((s) => s.url), rating });
  }

  return (
    <>
      {!ui.chatOpen && (
        <button
          onClick={() => ui.openChat()}
          className="group fixed right-5 bottom-5 z-30 hidden items-center gap-2.5 rounded-full border-2 border-ink bg-canvas py-2 pr-4 pl-2 font-display font-semibold shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5 md:flex"
        >
          <Mark size={30} /> Ask CJ AI
        </button>
      )}
      {ui.chatOpen && (
        <section
          role="dialog"
          aria-label="CJ AI chat"
          className="fixed inset-0 z-50 flex flex-col bg-canvas md:inset-auto md:right-5 md:bottom-5 md:h-[min(680px,calc(100dvh-110px))] md:w-[440px] md:rounded-[var(--radius-lg)] md:border-2 md:border-ink md:shadow-[6px_6px_0_var(--ink)]"
        >
          <header className="flex items-center gap-3 border-b-2 border-ink px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <Mark size={30} />
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold leading-tight">CJ AI</p>
              <p className="text-[12.5px] text-muted">Answers from Code Journey&apos;s own pages, with sources</p>
            </div>
            {msgs.length > 0 && (
              <button onClick={() => setMsgs([])} aria-label="New conversation" className="grid size-10 place-items-center rounded-full hover:bg-raise">
                <RotateCcw size={17} />
              </button>
            )}
            <button onClick={ui.closeChat} aria-label="Close chat" className="grid size-10 place-items-center rounded-full hover:bg-raise">
              <X size={20} />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
            {user === null ? (
              <div className="grid h-full place-content-center gap-4 text-center">
                <MessageCircle size={36} className="mx-auto" />
                <p className="font-display text-xl font-bold">Sign in to ask CJ AI</p>
                <p className="mx-auto max-w-[30ch] text-muted">It&apos;s free. Signing in keeps the assistant from being misused.</p>
                <Link href="/login" onClick={ui.closeChat} className="btn btn-accent mx-auto">
                  Sign in
                </Link>
              </div>
            ) : msgs.length === 0 ? (
              <div className="grid gap-3">
                <p className="text-muted">Ask about a role, a skill, or where to start. Every answer links to the pages it came from.</p>
                {STARTERS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-[var(--radius-md)] border-2 border-line px-3 py-2.5 text-left hover:border-ink">
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid gap-5">
                {msgs.map((m, i) =>
                  m.role === "user" ? (
                    <p key={i} className="ml-8 justify-self-end rounded-[var(--radius-md)] bg-ink px-3.5 py-2.5 text-canvas">
                      {m.content}
                    </p>
                  ) : (
                    <div key={i} className="mr-2 grid gap-3">
                      <div className={`text-[15px] leading-relaxed ${m.error ? "rounded-[var(--radius-md)] border-2 border-accent px-3 py-2" : ""}`}>
                        {m.content ? (
                          <Answer text={m.content} sources={m.sources} />
                        ) : (
                          m.streaming && (
                            <p className="flex items-center gap-2 text-muted">
                              <span className="size-2.5 animate-pulse rounded-full bg-accent" /> Reading the map…
                            </p>
                          )
                        )}
                      </div>
                      {!m.error && m.sources && m.sources.length > 0 && !m.streaming && (
                        <div className="rounded-[var(--radius-md)] border border-line p-3">
                          <p className="eyebrow mb-2">Sources</p>
                          <ol className="grid gap-1.5 text-[13.5px]">
                            {m.sources.map((s) => (
                              <li key={s.n} className="flex gap-2">
                                <span className="font-mono text-faint">{s.n}</span>
                                <Link href={s.url} className="min-w-0 truncate hover:underline">
                                  {s.title.replace(/ \((career route|skill|glossary|blog|field of tech|site guide)\)$/, "")}
                                  {s.heading && <span className="text-muted"> · {s.heading}</span>}
                                </Link>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {!m.error && !m.streaming && m.content && (
                        <div className="flex items-center gap-1 text-muted">
                          <span className="mr-1 text-[12.5px]">{m.rated ? "Thanks for the feedback" : "Was this helpful?"}</span>
                          {([1, -1] as const).map((r) => (
                            <button
                              key={r}
                              disabled={!!m.rated}
                              onClick={() => rate(i, r)}
                              aria-label={r === 1 ? "Helpful" : "Not helpful"}
                              aria-pressed={m.rated === r}
                              className={`grid size-8 place-items-center rounded-full hover:bg-raise disabled:hover:bg-transparent ${m.rated === r ? "text-ink" : ""}`}
                            >
                              {r === 1 ? <ThumbsUp size={15} /> : <ThumbsDown size={15} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {user && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 border-t-2 border-ink p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <label htmlFor="cj-chat-input" className="sr-only">
                Your question
              </label>
              <textarea
                id="cj-chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                maxLength={2000}
                placeholder="Ask about a role or skill…"
                className="max-h-32 min-h-11 flex-1 resize-none rounded-[var(--radius-md)] border-2 border-line bg-canvas px-3 py-2.5 outline-none focus:border-ink"
              />
              {busy ? (
                <button type="button" onClick={() => abortRef.current?.abort()} aria-label="Stop" className="btn btn-ink size-11 shrink-0 p-0">
                  <Square size={15} />
                </button>
              ) : (
                <button type="submit" disabled={!input.trim()} aria-label="Send" className="btn btn-accent size-11 shrink-0 p-0 disabled:opacity-40">
                  <ArrowUp size={19} />
                </button>
              )}
            </form>
          )}
        </section>
      )}
    </>
  );
}

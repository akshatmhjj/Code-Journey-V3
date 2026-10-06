"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowUp, MessageCircle, RotateCcw, X } from "lucide-react";
import { Mark } from "@/components/brand/Logo";
import { supabase, useUser } from "@/lib/supabase";
import { useUI } from "./UIProvider";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

const STARTERS = [
  "What does a Frontend Engineer actually do?",
  "Data Analyst or Data Scientist — what's the difference?",
  "What should I learn first if I'm new to coding?",
];

/* Minimal Markdown for answers: code fences, lists, **bold**, `code`, [links](url). */
function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="rounded bg-surface px-1 font-mono text-[0.88em]">{p.slice(1, -1)}</code>;
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
    return <Fragment key={i}>{p}</Fragment>;
  });
}

function Answer({ text }: { text: string }) {
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
            <li key={k}>{inline(t)}</li>
          ))}
        </L>,
      );
    } else if (/^#{1,4}\s/.test(line)) {
      blocks.push(
        <p key={i} className="font-display font-bold">
          {inline(line.replace(/^#+\s/, ""))}
        </p>,
      );
    } else if (line.trim()) {
      blocks.push(<p key={i}>{inline(line)}</p>);
    }
  }
  return <div className="grid gap-2.5">{blocks}</div>;
}

export function ChatPanel() {
  const ui = useUI();
  const user = useUser();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ui.chatOpen) {
      if (ui.chatDraft) setInput(ui.chatDraft);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [ui.chatOpen, ui.chatDraft]);

  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [msgs, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs.filter((m) => !m.error), { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const { data } = await supabase().auth.getSession();
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
        body: JSON.stringify({ messages: next }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error ?? "Something went wrong. Try again.");
      setMsgs((m) => [...m, { role: "assistant", content: body.text }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "assistant", content: (e as Error).message, error: true }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!ui.chatOpen && (
        <button
          onClick={() => ui.openChat()}
          className="fixed right-5 bottom-5 z-30 hidden items-center gap-2.5 rounded-full border-2 border-ink bg-canvas py-2 pr-4 pl-2 font-display font-semibold shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5 md:flex"
        >
          <Mark size={30} /> Ask CJ AI
        </button>
      )}
      {ui.chatOpen && (
        <section
          role="dialog"
          aria-label="CJ AI chat"
          className="fixed inset-0 z-50 flex flex-col bg-canvas md:inset-auto md:right-5 md:bottom-5 md:h-[min(640px,calc(100dvh-110px))] md:w-[420px] md:rounded-[var(--radius-lg)] md:border-2 md:border-ink md:shadow-[6px_6px_0_var(--ink)]"
        >
          <header className="flex items-center gap-3 border-b-2 border-ink px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <Mark size={30} />
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold leading-tight">CJ AI</p>
              <p className="text-[12.5px] text-muted">Careers, skills and where to learn them</p>
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
                <p className="text-muted">Ask about a role, a skill, or where to start. A few ideas:</p>
                {STARTERS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-[var(--radius-md)] border-2 border-line px-3 py-2.5 text-left hover:border-ink">
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {msgs.map((m, i) =>
                  m.role === "user" ? (
                    <p key={i} className="ml-8 justify-self-end rounded-[var(--radius-md)] bg-ink px-3.5 py-2.5 text-canvas">
                      {m.content}
                    </p>
                  ) : (
                    <div key={i} className={`mr-4 text-[15px] leading-relaxed ${m.error ? "rounded-[var(--radius-md)] border-2 border-accent px-3 py-2" : ""}`}>
                      <Answer text={m.content} />
                    </div>
                  ),
                )}
                {busy && (
                  <p className="flex items-center gap-2 text-muted">
                    <span className="size-2.5 animate-pulse rounded-full bg-accent" /> Thinking…
                  </p>
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
              <button type="submit" disabled={!input.trim() || busy} aria-label="Send" className="btn btn-accent size-11 shrink-0 p-0 disabled:opacity-40">
                <ArrowUp size={19} />
              </button>
            </form>
          )}
        </section>
      )}
    </>
  );
}

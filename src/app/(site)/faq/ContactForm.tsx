"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { supabase, useUser } from "@/lib/supabase";

const TOPICS = [
  ["question", "A question"],
  ["suggestion", "A suggestion"],
  ["bug", "Something's broken"],
  ["partnership", "Working together"],
  ["other", "Something else"],
] as const;

/** "Still have a question?" form. Messages land in the admin inbox. */
export function ContactForm() {
  const user = useUser();
  // null = not typed in yet, so the field shows the signed-in account's details.
  const [emailInput, setEmail] = useState<string | null>(null);
  const [nameInput, setName] = useState<string | null>(null);
  const email = emailInput ?? user?.email ?? "";
  const name = nameInput ?? ((user?.user_metadata?.full_name as string | undefined) ?? "");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  if (state === "sent") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-[var(--radius-lg)] bg-surface p-6">
        <Check size={22} strokeWidth={3} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-display text-xl font-bold">Thanks - we&apos;ve got your message.</p>
          <p className="mt-1 text-muted">We read everything and reply by email, usually within a few days.</p>
          <button onClick={() => setState("idle")} className="mt-3 text-[15px] font-semibold hover:underline">
            Send another
          </button>
        </div>
      </div>
    );
  }

  const field = "w-full rounded-[var(--radius-md)] border-2 border-ink bg-canvas px-4 py-2.5 outline-none focus:shadow-[3px_3px_0_var(--ink)]";

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const f = new FormData(e.currentTarget);
        setState("sending");
        const { data } = await supabase().auth.getSession();
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {}) },
          body: JSON.stringify({
            name,
            email,
            topic: f.get("topic"),
            message: f.get("message"),
            website: f.get("website"),
            page: location.pathname,
          }),
        }).catch(() => null);
        if (res?.ok) return setState("sent");
        setState("idle");
        setError((await res?.json().catch(() => null))?.error ?? "Couldn't send that. Please try again.");
      }}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold">
            Name <span className="font-normal text-muted">(optional)</span>
          </span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold">Email, so we can reply</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} autoComplete="email" className={field} />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold">What&apos;s it about?</span>
        <select name="topic" defaultValue="question" className={`${field} h-11`}>
          {TOPICS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold">Your message</span>
        <textarea required name="message" minLength={10} maxLength={3000} rows={5} className={`${field} resize-y`} />
      </label>
      {/* Hidden from people; bots that fill it are ignored. */}
      <label aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {error && (
        <p role="alert" className="text-[15px] font-semibold">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "sending"} className="btn btn-accent disabled:opacity-50">
          <Send size={17} /> {state === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-sm text-muted">We only use your email to reply.</p>
      </div>
    </form>
  );
}

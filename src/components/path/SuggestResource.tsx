"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePath } from "./PathProvider";

/** "Know a better resource?" form under a skill's resource list. Suggestions are reviewed by hand. */
export function SuggestResource({ skillSlug, skillTitle, existing }: { skillSlug: string; skillTitle: string; existing: string[] }) {
  const path = usePath();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!path || path.signedIn === undefined) return null;

  const intro = (
    <p className="flex items-center gap-2 font-display font-bold">
      <Lightbulb size={18} /> Know a better resource for {skillTitle}?
    </p>
  );

  if (!path.signedIn) {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface px-5 py-4">
        {intro}
        <Link href="/login" className="text-[15px] font-semibold hover:underline">
          Sign in to suggest one
        </Link>
      </div>
    );
  }

  if (state === "sent") {
    return (
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] bg-surface px-5 py-4" role="status">
        <Check size={18} strokeWidth={3} />
        <p className="flex-1">Thanks — we&apos;ll check it out. You can see its status on My Path.</p>
        <button
          onClick={() => {
            setUrl("");
            setTitle("");
            setNote("");
            setState("idle");
          }}
          className="text-[15px] font-semibold hover:underline"
        >
          Suggest another
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface px-5 py-4">
        {intro}
        <button onClick={() => setOpen(true)} className="btn btn-line">
          Suggest a resource
        </button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let clean: string;
    try {
      const u = new URL(url.trim());
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error();
      clean = u.toString();
    } catch {
      setError("That doesn't look like a web address. It should start with https://");
      return;
    }
    const norm = (s: string) => s.replace(/\/+$/, "").toLowerCase();
    if (existing.some((x) => norm(x) === norm(clean))) {
      setError("That one's already on the list — give it a thumbs up instead.");
      return;
    }
    setState("sending");
    const { error: err } = await supabase()
      .from("resource_suggestions")
      .insert({ skill_slug: skillSlug, url: clean, title: title.trim() || null, note: note.trim() || null });
    if (err) {
      setState("idle");
      setError(err.message.includes("suggestion_limit") ? "You've reached today's limit of 5 suggestions. Try again tomorrow." : "Couldn't send that. Please try again.");
      return;
    }
    setState("sent");
  };

  const field = "w-full rounded-[var(--radius-md)] border-2 border-ink bg-canvas px-4 py-2.5 outline-none focus:shadow-[3px_3px_0_var(--ink)]";
  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-[var(--radius-md)] border-2 border-ink p-5">
      {intro}
      <p className="-mt-2 text-[15px] text-muted">
        Free and official resources are most likely to be added. Every suggestion is checked by a person before it goes on the site.
      </p>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold">Link</span>
        <input required type="url" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} maxLength={2048} placeholder="https://" className={field} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold">
          Name <span className="font-normal text-muted">(optional)</span>
        </span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={300} className={field} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-semibold">
          Why is it good? <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={3} className={`${field} resize-y`} />
      </label>
      {error && (
        <p role="alert" className="text-[15px] font-semibold">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={state === "sending"} className="btn btn-accent disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Send suggestion"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-line">
          Cancel
        </button>
      </div>
    </form>
  );
}

"use client";

import { MessageCircle } from "lucide-react";
import { Mark } from "@/components/brand/Logo";
import { useUI } from "./UIProvider";

/** Call-out that opens CJ AI, optionally with a question already filled in. */
export function AskBand({ question, title = "Not sure which way to go?" }: { question?: string; title?: string }) {
  const ui = useUI();
  return (
    <section className="wrap pb-4">
      <div className="flex flex-col items-start gap-6 rounded-[var(--radius-lg)] border-2 border-ink p-6 md:flex-row md:items-center md:p-10">
        <Mark size={56} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-bold">{title}</h2>
          <p className="mt-2 max-w-[56ch] text-muted">
            Ask CJ AI about roles, skills or where to start. It knows the map and points you to the right page.
          </p>
        </div>
        <button onClick={() => ui.openChat(question)} className="btn btn-accent">
          <MessageCircle size={18} /> Ask CJ AI
        </button>
      </div>
    </section>
  );
}

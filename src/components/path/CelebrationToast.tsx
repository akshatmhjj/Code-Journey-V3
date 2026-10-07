"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, PartyPopper, Share2, X } from "lucide-react";
import { supabase, useUser } from "@/lib/supabase";
import { usePath } from "./PathProvider";

const BURST = Array.from({ length: 14 }, (_, i) => i);

/** Pops up when ticking a station finishes a stage or the route. Stays until closed. */
export function CelebrationToast() {
  const path = usePath();
  const user = useUser();
  const [shared, setShared] = useState<"idle" | "copied">("idle");
  const c = path?.celebration;
  if (!c) return null;

  const share = async () => {
    // Share the person's public page if they've turned it on, otherwise the route itself.
    let url = `${location.origin}/roles/${c.roleSlug}`;
    if (user) {
      const { data } = await supabase().from("profiles").select("handle, path_public").eq("id", user.id).maybeSingle();
      if (data?.path_public && data.handle) url = `${location.origin}/u/${data.handle}`;
    }
    const text = c.kind === "route" ? `${c.title} on Code Journey.` : `Just finished ${c.title.replace(/ complete$/, "")} on Code Journey.`;
    if (navigator.share) {
      await navigator.share({ title: c.title, text, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShared("copied");
      setTimeout(() => setShared("idle"), 2500);
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="cj-celebrate fixed inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-[460px] rounded-[var(--radius-lg)] border-2 border-ink bg-canvas p-5 shadow-[6px_6px_0_var(--ink)] md:bottom-6"
    >
      <div aria-hidden="true" className="pointer-events-none absolute top-8 left-10">
        {BURST.map((i) => (
          <span key={i} className="cj-burst" style={{ "--a": `${(i * 360) / BURST.length}deg`, "--d": `${46 + (i % 3) * 14}px` } as React.CSSProperties} />
        ))}
      </div>
      <button
        onClick={() => path.dismissCelebration()}
        aria-label="Close"
        className="absolute top-3 right-3 grid size-9 place-items-center rounded-full hover:bg-raise"
      >
        <X size={18} />
      </button>
      <div className="flex gap-4 pr-8">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
          <PartyPopper size={22} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-xl leading-tight font-bold">{c.title}</p>
          <p className="mt-1 text-[15px] text-muted">{c.detail}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 pl-[60px]">
        <Link href="/me" onClick={() => path.dismissCelebration()} className="btn btn-ink">
          Open My Path
        </Link>
        <button onClick={share} className="btn btn-line">
          {shared === "copied" ? (
            <>
              <Check size={16} /> Link copied
            </>
          ) : (
            <>
              <Share2 size={16} /> Share
            </>
          )}
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { MailX } from "lucide-react";

/** Confirm button rather than unsubscribing on page load, so link scanners in mail apps can't do it by accident. */
export function Unsubscribe() {
  const token = useSearchParams().get("t") ?? "";
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");

  return (
    <div className="wrap max-w-[640px] py-20 md:py-28">
      <MailX size={32} />
      {state === "done" ? (
        <>
          <h1 className="mt-5 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1] font-bold tracking-[-0.03em]">You&apos;re unsubscribed.</h1>
          <p className="mt-4 text-lg text-muted">No more weekly progress emails. Your route and progress are untouched, and you can switch emails back on from My Path any time.</p>
          <Link href="/me" className="btn btn-line mt-8">
            Open My Path
          </Link>
        </>
      ) : (
        <>
          <h1 className="mt-5 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1] font-bold tracking-[-0.03em]">Stop weekly progress emails?</h1>
          <p className="mt-4 text-lg text-muted">You&apos;ll stop getting the weekly summary of your route. Nothing else changes.</p>
          {state === "error" && (
            <p role="alert" className="mt-4 font-semibold">
              That didn&apos;t work - the link may be incomplete. You can also switch emails off from My Path.
            </p>
          )}
          <button
            disabled={!token || state === "working"}
            onClick={async () => {
              setState("working");
              const res = await fetch(`/api/email/unsubscribe?t=${encodeURIComponent(token)}`, { method: "POST" }).catch(() => null);
              setState(res?.ok ? "done" : "error");
            }}
            className="btn btn-accent mt-8 disabled:opacity-50"
          >
            {state === "working" ? "One moment…" : "Unsubscribe"}
          </button>
        </>
      )}
    </div>
  );
}

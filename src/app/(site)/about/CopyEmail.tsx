"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <p className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${email}`} className="font-display text-2xl font-bold underline decoration-accent decoration-[3px] underline-offset-[6px]">
        {email}
      </a>
      <button
        onClick={() =>
          navigator.clipboard.writeText(email).then(
            () => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            },
            () => {},
          )
        }
        className="btn btn-line min-h-9 px-3 text-sm"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
      </button>
    </p>
  );
}

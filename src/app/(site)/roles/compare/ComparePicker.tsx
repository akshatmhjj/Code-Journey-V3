"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftRight, Scale } from "lucide-react";

/** Two role selects and a Compare button. Also forwards old ?a=&b= links to the pair page. */
export function ComparePicker({ roles }: { roles: { slug: string; title: string }[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const valid = (s: string | null) => (s && roles.some((r) => r.slug === s) ? s : null);
  const qa = valid(params.get("a"));
  const qb = valid(params.get("b"));
  const [a, setA] = useState(qa ?? "frontend-engineer");
  const [b, setB] = useState(qb && qb !== qa ? qb : "full-stack-engineer");

  useEffect(() => {
    if (qa && qb && qa !== qb) router.replace(`/roles/compare/${qa}-vs-${qb}`);
  }, [qa, qb, router]);

  const select = (value: string, onChange: (v: string) => void, label: string, other: string) => (
    <label className="grid min-w-0 gap-1.5">
      <span className="font-mono text-[11.5px] tracking-wider text-muted uppercase">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full min-w-0 rounded-full border-2 border-ink bg-canvas px-4 font-display text-lg font-bold outline-none"
      >
        {roles.map((r) => (
          <option key={r.slug} value={r.slug} disabled={r.slug === other}>
            {r.title}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/roles/compare/${a}-vs-${b}`);
      }}
      className="mt-8 grid items-end gap-3 md:grid-cols-[1fr_auto_1fr_auto]"
    >
      {select(a, setA, "Route A", b)}
      <button
        type="button"
        onClick={() => {
          setA(b);
          setB(a);
        }}
        aria-label="Swap the two roles"
        className="grid size-12 place-items-center justify-self-center rounded-full border-2 border-ink hover:bg-raise"
      >
        <ArrowLeftRight size={19} />
      </button>
      {select(b, setB, "Route B", a)}
      <button type="submit" className="btn btn-accent h-12">
        <Scale size={17} /> Compare
      </button>
    </form>
  );
}

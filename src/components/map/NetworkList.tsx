import Link from "next/link";
import type { Domain, RoleEntry } from "@/lib/content";
import { LineGlyph } from "./Line";

/** The network as a list: one row per domain, roles as stations. Works at any width. */
export function NetworkList({ domains, roles, onNavigate }: { domains: Domain[]; roles: RoleEntry[]; onNavigate?: () => void }) {
  return (
    <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {domains
        .filter((d) => d.line !== "hub")
        .map((d) => {
          const stops = roles.filter((r) => r.domain === d.slug);
          return (
            <li key={d.slug} className="min-w-0">
              <Link href={`/domains/${d.slug}`} onClick={onNavigate} className="group flex items-center gap-3">
                <span className="rounded-[5px] bg-ink px-1.5 py-1 font-mono text-[11px] font-bold leading-none tracking-wider text-canvas">
                  {d.code}
                </span>
                <span className="font-display text-lg font-bold group-hover:underline">{d.name}</span>
                <LineGlyph style={d.line} width={48} className="ml-auto shrink-0" />
              </Link>
              <ol className="relative mt-3 ml-[7px] grid gap-2.5 border-l-[3px] border-ink pl-5">
                {stops.map((r) => (
                  <li key={r.slug} className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute top-[0.42em] -left-[30px] size-[15px] rounded-full border-[3px] ${
                        r.live ? "border-ink bg-accent" : "border-line-strong bg-canvas"
                      }`}
                    />
                    <Link
                      href={`/roles/${r.slug}`}
                      onClick={onNavigate}
                      className={r.live ? "font-semibold hover:underline" : "text-muted hover:text-ink hover:underline"}
                    >
                      {r.title}
                    </Link>
                    {!r.live && <span className="ml-2 font-mono text-[10.5px] tracking-wide text-faint uppercase">mapping</span>}
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
    </ul>
  );
}

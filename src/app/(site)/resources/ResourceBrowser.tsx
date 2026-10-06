"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Resource } from "@/lib/content";
import { RESOURCE_LABEL } from "@/lib/site";
import { ResourceList } from "@/components/ui/bits";
import { usePath } from "@/components/path/PathProvider";

type Item = Resource & { skills: { slug: string; title: string }[]; domains: string[] };

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border-2 px-3 py-1 text-[14px] font-medium transition-colors ${on ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
    >
      {children}
    </button>
  );
}

export function ResourceBrowser({ items, domains }: { items: Item[]; domains: { slug: string; name: string; code: string }[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [freeOnly, setFreeOnly] = useState(false);
  const [officialOnly, setOfficialOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const path = usePath();
  const savedUrls = useMemo(() => new Set((path?.saved ?? []).map((r) => r.url)), [path?.saved]);
  const showSaved = !!path?.signedIn && savedOnly;

  const types = useMemo(() => [...new Set(items.map((i) => i.type))], [items]);
  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (!type || i.type === type) &&
        (!domain || i.domains.includes(domain)) &&
        (!freeOnly || i.cost === "free") &&
        (!officialOnly || i.official) &&
        (!showSaved || savedUrls.has(i.url)) &&
        (!query || `${i.title} ${i.provider ?? ""} ${i.skills.map((s) => s.title).join(" ")}`.toLowerCase().includes(query)),
    );
  }, [items, q, type, domain, freeOnly, officialOnly, showSaved, savedUrls]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
      <div className="grid content-start gap-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
        <label className="flex h-12 items-center gap-2 rounded-full border-2 border-ink px-4">
          <Search size={18} />
          <span className="sr-only">Filter resources</span>
          <input id="res-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name or skill" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint" />
        </label>
        <div>
          <p className="eyebrow mb-2.5">Field</p>
          <div className="flex flex-wrap gap-2">
            <Chip on={!domain} onClick={() => setDomain(null)}>All</Chip>
            {domains.map((d) => (
              <Chip key={d.slug} on={domain === d.slug} onClick={() => setDomain(domain === d.slug ? null : d.slug)}>
                {d.name}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-2.5">Type</p>
          <div className="flex flex-wrap gap-2">
            <Chip on={!type} onClick={() => setType(null)}>All</Chip>
            {types.map((t) => (
              <Chip key={t} on={type === t} onClick={() => setType(type === t ? null : t)}>
                {RESOURCE_LABEL[t]}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip on={officialOnly} onClick={() => setOfficialOnly(!officialOnly)}>Official only</Chip>
          <Chip on={freeOnly} onClick={() => setFreeOnly(!freeOnly)}>Free only</Chip>
          {path?.signedIn && (
            <Chip on={savedOnly} onClick={() => setSavedOnly(!savedOnly)}>
              Saved ({savedUrls.size})
            </Chip>
          )}
        </div>
      </div>
      <div className="min-w-0">
        <p className="mb-3 font-mono text-[12px] text-muted" aria-live="polite">
          {shown.length} of {items.length}
        </p>
        {shown.length ? (
          <ResourceList resources={shown} showSkills />
        ) : (
          <p className="border-y-2 border-ink py-10 text-center text-muted">No resources match those filters. Clear one to see more.</p>
        )}
      </div>
    </div>
  );
}

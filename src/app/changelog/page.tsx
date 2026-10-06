import type { Metadata } from "next";
import { getChangelog } from "@/lib/content";
import { PageHead } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new on Code Journey: new routes, skills, resources and features.",
  alternates: { canonical: "/changelog" },
};

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const TAG = { added: "Added", changed: "Changed", fixed: "Fixed", removed: "Removed" } as const;

export default function Changelog() {
  const entries = getChangelog();
  return (
    <>
      <PageHead eyebrow="Changelog" title="What's new on the map." />
      <div className="wrap">
        <ol className="border-l-[5px] border-ink pl-6 md:pl-10">
          {entries.map((e) => (
            <li key={e.version} className="relative pb-14">
              <span aria-hidden="true" className="absolute top-1 -left-[37px] size-6 rounded-full border-[5px] border-ink bg-accent md:-left-[53px]" />
              <p className="font-mono text-[12.5px] text-muted">
                {fmt.format(e.date)} · v{e.version}
              </p>
              <h2 className="mt-2 text-3xl font-bold">{e.title}</h2>
              <ul className="mt-5 grid max-w-3xl gap-3">
                {e.changes.map((c) => (
                  <li key={c.text} className="grid grid-cols-[86px_1fr] items-baseline gap-3">
                    <span className={`justify-self-start rounded-full px-2 py-0.5 font-mono text-[11px] font-bold uppercase ${c.type === "added" ? "bg-ink text-canvas" : "border-2 border-ink"}`}>
                      {TAG[c.type]}
                    </span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";

export type Stop = { label: string; href?: string };

/** Breadcrumb drawn as a line of stations; the last stop is "you are here". Sticks under the header. */
export function Trail({ stops }: { stops: Stop[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="sticky top-[var(--header-h)] z-30 border-b border-line bg-[color-mix(in_oklab,var(--canvas)_94%,transparent)] backdrop-blur-md">
        <ol className="wrap flex h-11 items-center overflow-x-auto font-mono text-[12.5px] whitespace-nowrap [scrollbar-width:none]">
          {stops.map((s, i) => {
            const last = i === stops.length - 1;
            return (
              <li key={i} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="mx-2 h-[3px] w-6 bg-ink sm:w-9" />}
                <span
                  aria-hidden="true"
                  className={`mr-2 size-3 rounded-full border-[3px] ${last ? "border-ink bg-accent" : "border-ink bg-canvas"}`}
                />
                {s.href && !last ? (
                  <Link href={s.href} className="hover:underline">
                    {s.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={last ? "font-semibold" : ""}>
                    {s.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: stops.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.label,
            ...(s.href ? { item: SITE.url + s.href } : {}),
          })),
        }}
      />
    </>
  );
}

import Link from "next/link";
import { Mark } from "@/components/brand/Logo";
import { LineGlyph } from "@/components/map/Line";
import { getCatalog, getLibraryStatus } from "@/lib/content";
import { SITE } from "@/lib/site";
import { ThemeButton } from "./ThemeButton";

const COLS = [
  {
    title: "Explore",
    links: [
      ["/roles", "All roles"],
      ["/skills", "All skills"],
      ["/resources", "Resource library"],
      ["/glossary", "Glossary"],
      ["/snippets", "Snippets"],
    ],
  },
  {
    title: "Code Journey",
    links: [
      ["/about", "About"],
      ["/blog", "Blog"],
      ["/changelog", "Changelog"],
      ["/faq", "FAQ"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
    ],
  },
];

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** The terminus: the whole network as a line legend, plus the usual links. */
export function Footer() {
  const { domains } = getCatalog();
  const status = getLibraryStatus();
  return (
    <footer className="band-ink mt-24">
      <div>
      <div className="wrap grid gap-12 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="max-w-[16ch] font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] font-bold tracking-[-0.03em]">
              Every route starts at one station.
            </p>
            <Link href="/domains/foundations" className="mt-6 inline-flex items-center gap-2 font-display text-lg font-semibold underline decoration-accent decoration-[3px] underline-offset-[6px]">
              Start at Foundations
            </Link>
          </div>
          <div>
            <p className="font-mono text-[12px] tracking-[0.1em] text-muted uppercase">Lines</p>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 xs:grid-cols-2">
              {domains.map((d) => (
                <li key={d.slug}>
                  <Link href={`/domains/${d.slug}`} className="group flex items-center gap-3">
                    <LineGlyph style={d.line} width={44} className="shrink-0" />
                    <span className="font-mono text-[11px] font-bold text-muted">{d.code}</span>
                    <span className="group-hover:underline">{d.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-line pt-10 sm:grid-cols-4">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="font-mono text-[12px] tracking-[0.1em] text-muted uppercase">{c.title}</p>
              <ul className="mt-3 grid gap-2">
                {c.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-1">
            <p className="font-mono text-[12px] tracking-[0.1em] text-muted uppercase">Theme</p>
            <ThemeButton />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 font-mono text-[12px] text-muted">
          <span className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--swap-ink)] p-1 [--canvas:var(--swap-ink)] [--ink:var(--swap-canvas)]">
              <Mark size={22} />
            </span>
            © {new Date().getUTCFullYear()} {SITE.name}. We curate; we don&apos;t sell courses.
          </span>
          <span>
            Library last verified {fmt.format(status.checked)} · {status.resources} resources
          </span>
        </div>
      </div>
      </div>
    </footer>
  );
}

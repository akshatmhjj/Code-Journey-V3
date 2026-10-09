import Link from "next/link";
import { LinePath } from "@/components/map/Line";
import { getLibraryStatus, getNetwork } from "@/lib/content";
import { SITE } from "@/lib/site";
import { DepartureBoard, type Departure } from "./DepartureBoard";
import { InstallApp } from "./InstallApp";
import { ThemeButton } from "./ThemeButton";
import { Ticket } from "./Ticket";

const LINKS = [
  {
    title: "Explore",
    links: [
      ["/roles", "All roles"],
      ["/compass", "Compass quiz"],
      ["/roles/compare", "Compare roles"],
      ["/market", "Pay by role"],
      ["/gap", "Job post checker"],
      ["/skills", "All skills"],
      ["/resources", "Resource library"],
      ["/glossary", "Glossary"],
    ],
  },
  {
    title: "Code Journey",
    links: [
      ["/about", "About"],
      ["/blog", "Blog"],
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

// Short board names, like a real departures display.
function boardName(title: string) {
  return title
    .toUpperCase()
    .replace("CROSS-PLATFORM", "X-PLATFORM")
    .replace("APPLICATION SECURITY", "APPSEC")
    .replace("SITE RELIABILITY ENGINEER", "SITE RELIABILITY / SRE")
    .replace("DEVELOPER ADVOCATE", "DEV ADVOCATE")
    .replace(/ ENGINEER\b/, " ENG");
}

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** The terminus: every line arrives and stops here; a live departures board; the name, big. */
export function Footer() {
  const net = getNetwork();
  const status = getLibraryStatus();
  const domainCode = new Map(net.domains.map((d) => [d.slug, d.code]));
  const departures: Departure[] = [...net.roles]
    .sort((a, b) => Number(b.live) - Number(a.live) || a.wave - b.wave)
    .map((r) => ({ dest: boardName(r.title), code: domainCode.get(r.domain)!, live: r.live, href: `/roles/${r.slug}` }));

  return (
    <footer className="band-ink mt-24">
      <div className="overflow-hidden">
        {/* 1 · Lines arrive from the page above and end at buffer stops */}
        <nav aria-label="Lines" className="wrap">
          <ul className="grid grid-cols-5 gap-x-1 lg:grid-cols-10">
            {net.domains.map((d) => (
              <li key={d.slug} className="min-w-0">
                <Link href={`/domains/${d.slug}`} aria-label={d.name} className="group flex flex-col items-center text-center">
                  <svg viewBox="0 0 40 110" aria-hidden="true" className="h-14 w-10 sm:h-24 lg:h-28">
                    <LinePath d="M20 -4V92" style={d.line} />
                    <rect x="6" y="92" width="28" height="7" rx="2" fill="var(--accent)" className="origin-[20px_95px] transition-transform group-hover:scale-x-125" />
                  </svg>
                  <span className="mt-2 rounded-[4px] bg-ink px-1.5 py-0.5 font-mono text-[10.5px] font-bold tracking-wider text-canvas">{d.code}</span>
                  <span className="mt-1.5 mb-5 hidden text-[13px] leading-tight group-hover:underline sm:block lg:mb-0">{d.name}</span>
                  <span className="mb-5 sm:hidden" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="wrap mt-14 grid gap-12 md:mt-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
          {/* 2 · Departures */}
          <div className="grid content-start gap-6">
            <div>
              <p className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Terminus</p>
              <p className="mt-3 max-w-[17ch] font-display text-[clamp(2rem,4.4vw,3.25rem)] leading-[1] font-bold tracking-[-0.03em]">
                End of the line - or the start of yours.
              </p>
            </div>
            <DepartureBoard departures={departures} />
          </div>

          <div className="grid content-start gap-10">
            <Ticket />
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {LINKS.map((c) => (
                <div key={c.title}>
                  <p className="font-mono text-[12px] tracking-[0.12em] text-muted uppercase">{c.title}</p>
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
            </div>
            <div className="grid gap-1 border-t border-line pt-6 text-[14px]">
              <InstallApp className="mt-2" />
            </div>
          </div>
        </div>

        {/* 3 · The name, full width, ending at the destination dot */}
        <div className="wrap mt-16 md:mt-24">
          <svg viewBox="0 0 1000 172" role="img" aria-label="Code Journey" className="w-full">
            <text
              x="0"
              y="122"
              textLength="905"
              lengthAdjust="spacingAndGlyphs"
              fill="var(--ink)"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 158, letterSpacing: "-0.04em" }}
            >
              Code Journey
            </text>
            <circle cx="958" cy="102" r="22" fill="var(--accent)" stroke="var(--ink)" strokeWidth="6" />
          </svg>
        </div>

        <div className="wrap flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 font-mono text-[12px] text-muted">
          <div className="grid gap-1">
            <span className="text-[11px]">
              Library last verified {fmt.format(status.checked)} · {status.resources} resources
            </span>
            <span>
              © {new Date().getUTCFullYear()} {SITE.name} · We curate; we don&apos;t sell courses.
            </span>
          </div>
          <div className="grid justify-items-end gap-2">
            <ThemeButton compact />
            <span>codejourney.space</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

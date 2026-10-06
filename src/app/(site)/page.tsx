import Link from "next/link";
import { ArrowRight, BadgeCheck, Compass, Gauge, LinkIcon, Repeat2, Sparkles } from "lucide-react";
import { getNetwork, getPosts, getRole, getAllResources, getGlossary } from "@/lib/content";
import { NetworkMap } from "@/components/map/NetworkMap";
import { NetworkList } from "@/components/map/NetworkList";
import { HeroSearch } from "@/components/shell/HeroSearch";
import { AskBand } from "@/components/shell/AskBand";
import { SectionTitle } from "@/components/ui/bits";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function Home() {
  const net = getNetwork();
  const pilot = getRole("frontend-engineer");
  const posts = getPosts().slice(0, 3);
  const stats = [
    { n: net.roles.length, label: "roles on the map" },
    { n: net.skills.length, label: "skills charted" },
    { n: getAllResources().length, label: "resources, every link checked" },
    { n: getGlossary().length, label: "terms in plain English" },
  ];
  const chips = net.roles
    .filter((r) => r.wave === 1)
    .slice(0, 6)
    .map((r) => ({ title: r.title, href: `/roles/${r.slug}` }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(var(--line-strong)_1.2px,transparent_1.2px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div className="wrap relative pt-14 pb-16 md:pt-24 md:pb-24">
          <p className="eyebrow">The map of tech careers · free · no courses sold</p>
          <h1 className="mt-6 max-w-[13ch] text-[clamp(3rem,9vw,7.25rem)] leading-[0.92] font-bold tracking-[-0.045em]">
            Pick a destination. <span className="relative whitespace-nowrap">
              We&apos;ll show
              <svg aria-hidden="true" viewBox="0 0 300 18" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-[0.16em] w-full">
                <path d="M2 9H298" stroke="var(--accent)" strokeWidth="12" strokeLinecap="round" />
              </svg>
            </span>{" "}
            you the route.
          </h1>
          <p className="mt-7 max-w-[56ch] text-lg text-muted md:text-xl">
            Every tech role, the skills it takes in the order you need them, and the best official docs and free resources to learn each one.
          </p>
          <HeroSearch chips={chips} />
          <dl className="mt-14 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-6 border-t-2 border-ink pt-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="font-display text-4xl font-bold tabular-nums">{s.n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Network */}
      <section className="wrap py-20 md:py-28" aria-labelledby="network-title">
        <SectionTitle eyebrow="The network" title="Every field of tech, one map." id="network-title">
          <p className="flex items-center gap-5 text-sm text-muted">
            <span className="flex items-center gap-2">
              <span className="size-3.5 rounded-full border-[3px] border-ink bg-accent" /> Full route
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full border-2 border-faint" /> Being mapped
            </span>
          </p>
        </SectionTitle>
        <p className="mb-10 max-w-[62ch] text-lg text-muted">
          Each line is a field. Each station is a role. All lines leave from Foundations — the skills nearly every route shares — then fan out to where you want to go.
        </p>
        <div className="hidden rounded-[var(--radius-lg)] border-2 border-ink p-4 md:block lg:p-8">
          <NetworkMap domains={net.domains} roles={net.roles} />
        </div>
        <div className="md:hidden">
          <NetworkList domains={net.domains} roles={net.roles} />
        </div>
      </section>

      {/* Three ways in */}
      <section className="border-y-2 border-ink bg-surface">
        <div className="wrap py-20 md:py-24">
          <SectionTitle eyebrow="Three ways in" title="Wherever you're starting from." />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                Icon: Compass,
                who: "New to tech",
                title: "Find the role that fits",
                text: "Read the one-line summary of each role, compare a few, then follow one route from its first station. Every stage tells you what “done” looks like.",
                href: "/roles",
                cta: "Browse roles",
              },
              {
                Icon: Repeat2,
                who: "Switching or levelling up",
                title: "See what's missing",
                text: "Open your target role, skim the must-have skills, and jump straight to the ones you don't have yet. Skip what you already know.",
                href: "/skills",
                cta: "Browse skills",
              },
              {
                Icon: Gauge,
                who: "Already working",
                title: "Get the 60-second brief",
                text: "Every skill opens with a short brief and the official docs at the top. Read the summary, grab the link, get back to work.",
                href: "/resources",
                cta: "Resource library",
              },
            ].map(({ Icon, ...c }) => (
              <Link
                key={c.title}
                href={c.href}
                className="group flex flex-col rounded-[var(--radius-lg)] border-2 border-ink bg-canvas p-6 transition-transform hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--ink)] md:p-7"
              >
                <Icon size={28} strokeWidth={2.2} />
                <p className="eyebrow mt-6">{c.who}</p>
                <h3 className="mt-2 text-2xl font-bold">{c.title}</h3>
                <p className="mt-3 flex-1 text-muted">{c.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-display font-semibold">
                  {c.cta} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Route preview */}
      {pilot && (
        <section className="wrap py-20 md:py-28" aria-labelledby="route-title">
          <SectionTitle eyebrow="What a route looks like" title={`${pilot.title}, start to finish.`} id="route-title">
            <Link href="/roles/frontend-engineer" className="btn btn-ink">
              Open the full route <ArrowRight size={17} />
            </Link>
          </SectionTitle>
          <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
            <span aria-hidden="true" className="absolute top-[13px] right-0 left-0 hidden h-[6px] bg-ink md:block" />
            <span aria-hidden="true" className="absolute top-0 bottom-0 left-[13px] w-[6px] bg-ink md:hidden" />
            {pilot.stages.map((s, i) => (
              <li key={s.name} className="relative pl-12 md:pt-12 md:pl-0">
                <span
                  aria-hidden="true"
                  className={`absolute top-0 left-0 grid size-8 place-items-center rounded-full border-[5px] border-ink font-mono text-[11px] font-bold ${
                    i === 0 ? "bg-accent text-on-accent" : "bg-canvas"
                  }`}
                >
                  {i + 1}
                </span>
                <h3 className="text-xl font-bold">{s.name}</h3>
                {s.weeks && <p className="mt-1 font-mono text-[12px] text-muted">{s.weeks} weeks at ~10 h/week</p>}
                <p className="mt-2 text-muted">{s.summary}</p>
                <p className="mt-3 text-sm">
                  <span className="font-semibold">{s.skills.length} skills</span> · ends with a project
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Principles */}
      <section className="band-ink">
        <div>
          <div className="wrap py-20 md:py-28">
            <SectionTitle eyebrow="How we choose" title="We point. You learn from the best." />
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { Icon: BadgeCheck, t: "Official docs first", d: "The people who build a tool explain it best. Their docs sit at the top of every list." },
                { Icon: Sparkles, t: "Free before paid", d: "Most of tech can be learned for free. Paid picks appear only when they add something, and they're labelled." },
                { Icon: LinkIcon, t: "Every link checked", d: `Each resource shows when it was last verified. The whole library was checked on ${fmt.format(new Date("2026-10-06"))}.` },
                { Icon: Compass, t: "No courses, no affiliates", d: "We don't sell anything and don't earn from clicks, so the only goal is the right recommendation." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="border-t-2 border-ink pt-5">
                  <Icon size={26} />
                  <h3 className="mt-4 text-xl font-bold">{t}</h3>
                  <p className="mt-2 text-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="wrap py-20 md:py-28" aria-labelledby="blog-title">
        <SectionTitle eyebrow="From the blog" title="Short reads for the road." id="blog-title">
          <Link href="/blog" className="btn btn-line">
            All posts
          </Link>
        </SectionTitle>
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group border-t-[3px] border-ink pt-5">
              <p className="font-mono text-[12px] text-muted">
                {p.tag} · {p.readTime}
              </p>
              <h3 className="mt-3 text-2xl leading-tight font-bold group-hover:underline">{p.title}</h3>
              <p className="mt-3 text-muted">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <AskBand />
    </>
  );
}

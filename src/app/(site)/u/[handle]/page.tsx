import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowRight, Check, CircleDot } from "lucide-react";
import { getPathIndex } from "@/lib/content";
import { computeProgress, formatHours, type Statuses } from "@/lib/path";

// Public path pages are personal and change whenever someone ticks a skill, so render on request.
export const dynamic = "force-dynamic";

type PublicPath = { handle: string; name: string; role: string | null; started_at: string | null; statuses: Statuses; updated_at: string | null };

const HANDLE = /^[a-z0-9][a-z0-9_-]{2,29}$/;
const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

const getPublicPath = cache(async (handle: string): Promise<PublicPath | null> => {
  const h = handle.toLowerCase();
  if (!HANDLE.test(h)) return null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_public_path`, {
    method: "POST",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_handle: h }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as PublicPath | null;
});

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = await getPublicPath(handle);
  if (!p) return { title: "Path not found", robots: { index: false } };
  const role = p.role ? getPathIndex().roles.find((r) => r.slug === p.role) : undefined;
  const title = role ? `${p.name}'s route to ${role.title}` : `${p.name} on Code Journey`;
  // Personal pages are shareable but kept out of search results.
  return { title, description: `Follow ${p.name}'s progress on Code Journey, the map of tech careers.`, robots: { index: false, follow: true } };
}

export default async function PublicPathPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = await getPublicPath(handle);
  if (!p) notFound();

  const index = getPathIndex();
  const progress = p.role ? computeProgress(index, p.role, p.statuses) : null;
  const doneCount = Object.values(p.statuses).filter((s) => s === "done").length;

  return (
    <div className="wrap py-12 md:py-16">
      <p className="eyebrow">@{p.handle}</p>
      <h1 className="mt-4 max-w-[18ch] text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-bold tracking-[-0.04em]">
        {progress ? (
          <>
            {p.name} is on the way to <span className="text-hl">{progress.role.title}</span>.
          </>
        ) : (
          `${p.name} is mapping their route.`
        )}
      </h1>
      <p className="mt-4 text-lg text-muted">
        {p.started_at && `On this route since ${longDate.format(new Date(p.started_at))}`}
        {p.started_at && p.updated_at && " · "}
        {p.updated_at && `last progress ${longDate.format(new Date(p.updated_at))}`}
      </p>

      {progress ? (
        <div className="mt-12 grid gap-10">
          <section className="band-ink overflow-hidden rounded-[var(--radius-lg)]" aria-label="Progress">
            <div className="grid gap-5 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 md:p-8">
              <p className="font-display text-[clamp(3.5rem,10vw,6rem)] leading-none font-bold tabular-nums">{progress.percent}%</p>
              <div className="grid gap-2">
                <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-[color-mix(in_oklab,currentColor_15%,transparent)]">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${progress.percent}%` }} />
                </div>
                <p className="text-muted">
                  <span className="font-semibold text-ink">
                    {progress.done} of {progress.total} stations done
                  </span>
                  {progress.learning > 0 && ` · ${progress.learning} in progress`}
                  {progress.hoursLeft[1] > 0 && ` · about ${formatHours(progress.hoursLeft)} to go`}
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="stages-title" className="grid gap-6">
            <h2 id="stages-title" className="text-2xl font-bold">
              The route, stage by stage
            </h2>
            <ol className="grid gap-6">
              {progress.stages.map((s, i) => (
                <li key={s.name} className="grid gap-3 border-t border-line pt-5 md:grid-cols-[220px_1fr] md:gap-8">
                  <div>
                    <p className="font-mono text-[12px] text-muted tabular-nums">
                      Stage {i + 1} · {s.done}/{s.total}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold">
                      {s.name}
                      {i === progress.currentStage && s.done < s.total && <span className="ml-2 font-mono text-[10.5px] tracking-wide text-hl uppercase">here now</span>}
                    </p>
                  </div>
                  <ul className="flex flex-wrap content-start gap-2">
                    {s.skills.map((slug) => {
                      const st = p.statuses[slug];
                      return (
                        <li key={slug}>
                          <Link
                            href={`/skills/${slug}`}
                            className={`inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-[14px] font-semibold ${
                              st === "done" ? "border-ink bg-ink text-canvas" : st === "learning" ? "border-ink" : "border-line text-muted hover:border-ink hover:text-ink"
                            }`}
                          >
                            {st === "done" && <Check size={13} strokeWidth={3} />}
                            {st === "learning" && <CircleDot size={13} />}
                            {index.skills[slug]?.title ?? slug}
                            <span className="sr-only">{st === "done" ? " (done)" : st === "learning" ? " (learning)" : " (to do)"}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : (
        <p className="mt-10 text-lg text-muted">{doneCount > 0 ? `${doneCount} skills done so far.` : "Nothing ticked off yet."}</p>
      )}

      <aside className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] border-2 border-ink p-6 md:p-8">
        <div>
          <p className="font-display text-xl font-bold">Map your own route into tech.</p>
          <p className="mt-1 text-muted">Free. Every skill in order, with the best place to learn each.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {progress && (
            <Link href={`/roles/${progress.role.slug}`} className="btn btn-ink">
              See this route <ArrowRight size={17} />
            </Link>
          )}
          <Link href="/compass" className="btn btn-line">
            Find a role that suits you
          </Link>
        </div>
      </aside>
    </div>
  );
}

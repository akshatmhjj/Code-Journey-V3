"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, LogOut, MessageCircle } from "lucide-react";
import { supabase, useUser } from "@/lib/supabase";
import { computeProgress, formatHours, formatWeeks, type PathIndex } from "@/lib/path";
import { CHAT_DAILY_LIMIT, SITE } from "@/lib/site";
import { ThemePicker } from "@/components/shell/ThemeSettings";
import { usePath } from "@/components/path/PathProvider";
import { SkillProgress } from "@/components/path/SkillProgress";

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

function Card({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-lg)] border-2 border-ink p-6 md:p-7">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

/** Pick or change the destination you're working towards. */
function RoutePicker({ index, value, onChange }: { index: PathIndex; value: string | null; onChange: (slug: string) => void }) {
  const roles = [...index.roles].sort((a, b) => a.title.localeCompare(b.title));
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-muted">{value ? "Change destination" : "Choose your destination"}</span>
      <select
        value={value ?? ""}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="h-11 rounded-full border-2 border-ink bg-canvas px-4 font-display font-semibold outline-none"
      >
        <option value="" disabled>
          Pick a role…
        </option>
        {roles.map((r) => (
          <option key={r.slug} value={r.slug}>
            {r.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function RouteProgress({ index, roleSlug }: { index: PathIndex; roleSlug: string }) {
  const path = usePath();
  const p = computeProgress(index, roleSlug, path?.statuses ?? {});
  if (!p) return null;
  const weeks = formatWeeks(p.hoursLeft);

  return (
    <div className="grid gap-7">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-7">
        <p className="font-display text-[clamp(3rem,8vw,4.5rem)] leading-none font-bold tabular-nums">{p.percent}%</p>
        <div className="grid gap-2">
          <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${p.percent}%` }} />
          </div>
          <p className="text-muted">
            <span className="font-semibold text-ink">
              {p.done} of {p.total} stations
            </span>
            {p.learning > 0 && ` · ${p.learning} in progress`} · {formatHours(p.hoursLeft)} left
            {weeks && ` · ${weeks} at 10 h/week`}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <p className="eyebrow">Stages</p>
        <ol className="grid gap-2.5">
          {p.stages.map((s, i) => (
            <li key={s.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[150px_1fr_auto]">
              <span className={`font-display font-semibold ${i === p.currentStage ? "" : "text-muted"}`}>
                {s.name}
                {i === p.currentStage && s.done < s.total && <span className="ml-2 font-mono text-[10.5px] tracking-wide text-hl uppercase">you are here</span>}
              </span>
              <span aria-hidden="true" className="col-span-2 h-2 overflow-hidden rounded-full bg-surface sm:col-span-1">
                <span className="block h-full rounded-full bg-ink" style={{ width: `${s.percent}%` }} />
              </span>
              <span className="font-mono text-[12.5px] text-muted tabular-nums">
                {s.done}/{s.total}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {p.next.length > 0 && (
        <div className="grid gap-3">
          <p className="eyebrow">Next stations</p>
          <ul className="grid gap-3">
            {p.next.map((slug) => (
              <li key={slug} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line pb-3 last:border-0 last:pb-0">
                <Link href={`/skills/${slug}`} className="font-display text-lg font-semibold hover:underline">
                  {index.skills[slug]?.title ?? slug}
                </Link>
                <SkillProgress slug={slug} compact />
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href={`/roles/${roleSlug}`} className="btn btn-ink justify-self-start">
        Open the full route <ArrowRight size={17} />
      </Link>
    </div>
  );
}

export function MeView({ index }: { index: PathIndex }) {
  const user = useUser();
  const path = usePath();
  const router = useRouter();
  const [asked, setAsked] = useState<number | null>(null);

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase()
      .from("chat_usage")
      .select("messages")
      .eq("user_id", user.id)
      .eq("day", new Date().toISOString().slice(0, 10))
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setAsked(data?.messages ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="wrap py-24" aria-busy="true">
        <div className="h-14 w-72 max-w-full animate-pulse rounded-[var(--radius-md)] bg-surface" />
      </div>
    );
  }

  const name = (user.user_metadata?.full_name as string | undefined)?.split(" ")[0];
  const roleSlug = path?.roleSlug ?? null;
  const role = index.roles.find((r) => r.slug === roleSlug);

  return (
    <div className="wrap py-12 md:py-16">
      <p className="eyebrow">My Path</p>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-bold tracking-[-0.04em]">{name ? `Hi, ${name}.` : "Welcome."}</h1>
      <p className="mt-4 text-lg text-muted">
        {user.email} · member since {longDate.format(new Date(user.created_at))}
      </p>

      <div className="mt-12 grid gap-6">
        {role ? (
          <Card title={role.title} right={<RoutePicker index={index} value={roleSlug} onChange={(s) => path?.setRole(s)} />}>
            <RouteProgress index={index} roleSlug={role.slug} />
          </Card>
        ) : (
          <Card title="Where are you going?">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <Compass size={28} />
                <p className="mt-3 max-w-[52ch] text-lg text-muted">
                  Pick a destination and every skill on that route becomes a station you can tick off. Your progress shows up here and on the route itself.
                </p>
              </div>
              <RoutePicker index={index} value={null} onChange={(s) => path?.setRole(s)} />
            </div>
            <Link href="/roles" className="btn btn-line mt-6">
              Browse all {index.roles.length} routes
            </Link>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="CJ AI">
            <p className="text-muted">Answers about roles, skills and where to learn them — from Code Journey&apos;s own pages, with sources.</p>
            <p className="mt-4 font-display text-lg font-semibold tabular-nums">
              {asked === null ? "—" : `${asked} of ${CHAT_DAILY_LIMIT}`} <span className="font-sans text-sm font-normal text-muted">questions used today</span>
            </p>
            <p className="mt-1 text-sm text-muted">The allowance resets at midnight UTC.</p>
            <Link href="/faq" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
              <MessageCircle size={15} /> How CJ AI works
            </Link>
          </Card>

          <Card title="Look and feel">
            <ThemePicker />
          </Card>
        </div>

        <Card title="Account">
          <dl className="grid gap-3 text-[15px] sm:grid-cols-2">
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="font-semibold">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Member since</dt>
              <dd className="font-semibold">{longDate.format(new Date(user.created_at))}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm text-muted">
            Want a copy of your data, or all of it deleted? Email{" "}
            <a href={`mailto:${SITE.email}`} className="link font-semibold text-ink">
              {SITE.email}
            </a>{" "}
            and we&apos;ll act within 30 days.
          </p>
          <button
            onClick={async () => {
              await supabase().auth.signOut();
              router.push("/");
            }}
            className="btn btn-line mt-5"
          >
            <LogOut size={17} /> Sign out
          </button>
        </Card>
      </div>
    </div>
  );
}

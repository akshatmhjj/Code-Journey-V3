"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase, useUser } from "@/lib/supabase";
import { computeProgress, type PathIndex } from "@/lib/path";
import { milestones } from "@/lib/milestones";
import { CHAT_DAILY_LIMIT } from "@/lib/site";
import { usePath } from "@/components/path/PathProvider";
import type { Streak } from "@/components/path/StreakMilestones";
import {
  AccountSection,
  CjAiSection,
  NoRouteCard,
  PageHeader,
  ProjectsSection,
  RouteHero,
  SavedSection,
  ShareSection,
  StreakSection,
  ThemeSection,
  UpNext,
  WeeklyEmailSection,
  YourSuggestions,
  longDate,
} from "./me-sections";

/** My Path: the signed-in person's route, progress, saved resources and settings. Each section lives in me-sections.tsx. */
export function MeView({ index }: { index: PathIndex }) {
  const user = useUser();
  const path = usePath();
  const router = useRouter();
  const [asked, setAsked] = useState<number | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);

  const statuses = path?.statuses ?? {};
  const doneCount = Object.values(statuses).filter((s) => s === "done").length;
  const roleSlug = path?.roleSlug ?? null;
  const role = index.roles.find((r) => r.slug === roleSlug);
  const progress = role ? computeProgress(index, role.slug, statuses) : null;
  const list = progress ? milestones(progress) : [];

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

  // Re-read the streak after every newly ticked station, so it updates straight away.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase()
      .rpc("my_streak")
      .then(({ data }) => !cancelled && data && setStreak(data as Streak));
    return () => {
      cancelled = true;
    };
  }, [user, doneCount]);

  if (!user) {
    return (
      <div className="wrap py-24" aria-busy="true">
        <div className="h-14 w-72 max-w-full animate-pulse rounded-[var(--radius-md)] bg-surface" />
      </div>
    );
  }

  const name = (user.user_metadata?.full_name as string | undefined)?.split(" ")[0];
  const memberSince = longDate.format(new Date(user.created_at));

  return (
    <>
      <div className="wrap grid gap-12 pt-10 md:gap-16 md:pt-16">
        <PageHeader greeting={name ? `Hi, ${name}.` : "Welcome."} email={user.email} memberSince={memberSince} />
        {role && progress ? (
          <RouteHero index={index} roleSlug={role.slug} roleTitle={role.title} progress={progress} onRouteChange={(s) => path?.setRole(s)} />
        ) : (
          <NoRouteCard index={index} onRouteChange={(s) => path?.setRole(s)} />
        )}
        {progress && <UpNext index={index} next={progress.next} />}
      </div>

      <div className="wrap grid gap-20 py-16 md:gap-28 md:py-24">
        <SavedSection index={index} />
        {role && <ProjectsSection userId={user.id} roleSlug={role.slug} stages={role.stages.map((s) => s.name)} />}
        {progress && <StreakSection streak={streak} list={list} />}
        <YourSuggestions index={index} userId={user.id} />
        <ShareSection userId={user.id} defaultName={name ?? ""} roleTitle={role?.title ?? null} />
        <div className="grid gap-20 lg:grid-cols-2 lg:gap-16">
          <WeeklyEmailSection userId={user.id} email={user.email} hasRole={!!role} />
          <CjAiSection asked={asked} limit={CHAT_DAILY_LIMIT} />
        </div>
        <ThemeSection />
        <AccountSection
          email={user.email}
          memberSince={memberSince}
          onSignOut={async () => {
            await supabase().auth.signOut();
            router.push("/");
          }}
        />
      </div>
    </>
  );
}

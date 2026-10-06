"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase, useUser } from "@/lib/supabase";
import type { SkillStatus, Statuses } from "@/lib/path";

type PathState = {
  /** undefined while the session is still loading. */
  signedIn: boolean | undefined;
  loading: boolean;
  roleSlug: string | null;
  statuses: Statuses;
  setRole: (slug: string | null) => Promise<void>;
  setStatus: (skillSlug: string, status: SkillStatus | null) => Promise<void>;
  /** Bookmarked resources, newest first. */
  saved: SavedResource[];
  toggleSaved: (resource: { url: string; title: string; skillSlug?: string }) => Promise<void>;
};

export type SavedResource = { url: string; title: string; skillSlug: string | null; savedAt: string };

const Ctx = createContext<PathState | null>(null);

export function PathProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const [data, setData] = useState<{ userId: string; roleSlug: string | null; statuses: Statuses; saved: SavedResource[] } | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const db = supabase();
    Promise.all([
      db.from("user_paths").select("role_slug").eq("user_id", user.id).maybeSingle(),
      db.from("user_skill_status").select("skill_slug, status").eq("user_id", user.id),
      db.from("user_saved_resources").select("url, title, skill_slug, saved_at").eq("user_id", user.id).order("saved_at", { ascending: false }),
    ]).then(([path, skills, bookmarks]) => {
      if (cancelled) return;
      const statuses: Statuses = {};
      for (const row of skills.data ?? []) statuses[row.skill_slug] = row.status as SkillStatus;
      const saved = (bookmarks.data ?? []).map((r) => ({ url: r.url, title: r.title, skillSlug: r.skill_slug, savedAt: r.saved_at }));
      setData({ userId: user.id, roleSlug: path.data?.role_slug ?? null, statuses, saved });
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const setRole = useCallback(
    async (slug: string | null) => {
      if (!user) return;
      const previous = data;
      setData((d) => ({ userId: user.id, roleSlug: slug, statuses: d?.statuses ?? {}, saved: d?.saved ?? [] }));
      const db = supabase();
      const { error } = slug
        ? await db.from("user_paths").upsert({ user_id: user.id, role_slug: slug, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
        : await db.from("user_paths").delete().eq("user_id", user.id);
      if (error) setData(previous);
    },
    [user, data],
  );

  const setStatus = useCallback(
    async (skillSlug: string, status: SkillStatus | null) => {
      if (!user) return;
      const previous = data;
      setData((d) => {
        const statuses = { ...(d?.statuses ?? {}) };
        if (status) statuses[skillSlug] = status;
        else delete statuses[skillSlug];
        return { userId: user.id, roleSlug: d?.roleSlug ?? null, statuses, saved: d?.saved ?? [] };
      });
      const db = supabase();
      const { error } = status
        ? await db
            .from("user_skill_status")
            .upsert({ user_id: user.id, skill_slug: skillSlug, status, updated_at: new Date().toISOString() }, { onConflict: "user_id,skill_slug" })
        : await db.from("user_skill_status").delete().eq("user_id", user.id).eq("skill_slug", skillSlug);
      if (error) setData(previous);
    },
    [user, data],
  );

  const toggleSaved = useCallback(
    async ({ url, title, skillSlug }: { url: string; title: string; skillSlug?: string }) => {
      if (!user) return;
      const previous = data;
      const isSaved = !!data?.saved.some((r) => r.url === url);
      setData((d) => {
        const rest = (d?.saved ?? []).filter((r) => r.url !== url);
        const saved = isSaved ? rest : [{ url, title, skillSlug: skillSlug ?? null, savedAt: new Date().toISOString() }, ...rest];
        return { userId: user.id, roleSlug: d?.roleSlug ?? null, statuses: d?.statuses ?? {}, saved };
      });
      const db = supabase();
      const { error } = isSaved
        ? await db.from("user_saved_resources").delete().eq("user_id", user.id).eq("url", url)
        : await db
            .from("user_saved_resources")
            .upsert({ user_id: user.id, url, title: title.slice(0, 300), skill_slug: skillSlug ?? null }, { onConflict: "user_id,url" });
      if (error) setData(previous);
    },
    [user, data],
  );

  const mine = data?.userId === user?.id ? data : null;
  const value = useMemo<PathState>(
    () => ({
      signedIn: user === undefined ? undefined : !!user,
      loading: user === undefined || (!!user && !mine),
      roleSlug: mine?.roleSlug ?? null,
      statuses: mine?.statuses ?? {},
      setRole,
      setStatus,
      saved: mine?.saved ?? [],
      toggleSaved,
    }),
    [user, mine, setRole, setStatus, toggleSaved],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Returns null outside a PathProvider, so components work on pages that don't have one. */
export function usePath() {
  return useContext(Ctx);
}

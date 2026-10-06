"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_THEME, THEMES, type Mode, type ThemeId } from "@/lib/site";
import { supabase, useUser } from "@/lib/supabase";

type Panel = "search" | "network" | "settings" | null;

type UI = {
  panel: Panel;
  open: (p: Exclude<Panel, null>) => void;
  close: () => void;
  chatOpen: boolean;
  chatDraft: string;
  openChat: (draft?: string) => void;
  closeChat: () => void;
  theme: ThemeId;
  mode: Mode;
  setTheme: (t: ThemeId) => void;
  setMode: (m: Mode) => void;
  /** undefined while the session is loading, null when signed out. */
  signedIn: boolean | undefined;
  /** True when the current look differs from what's saved to the account. */
  unsaved: boolean;
  saving: "idle" | "saving" | "saved" | "error";
  saveLook: () => Promise<void>;
};

const Ctx = createContext<UI | null>(null);

function store(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage blocked: the choice still applies for this visit */
  }
}

/** Runs before first paint (inlined in <head>) so the saved theme never flashes. */
export const THEME_SCRIPT = `(function(){try{var d=document.documentElement,t=localStorage.getItem('cj-theme'),m=localStorage.getItem('cj-mode');if(${JSON.stringify(
  THEMES.map((t) => t.id),
)}.indexOf(t)>-1)d.setAttribute('data-cj',t);if(m==='light'||m==='dark')d.setAttribute('data-mode',m);}catch(e){}})();`;

export function UIProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const [panel, setPanel] = useState<Panel>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDraft, setChatDraft] = useState("");
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [mode, setModeState] = useState<Mode>("system");
  // Tagged with the user id, so a sign-out never leaves another account's saved look behind.
  const [saved, setSaved] = useState<{ userId: string; theme: ThemeId; mode: Mode } | null>(null);
  const [saving, setSaving] = useState<UI["saving"]>("idle");
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const d = document.documentElement;
    // Sync React state with what the head script applied.
    /* eslint-disable react-hooks/set-state-in-effect */
    setThemeState((d.getAttribute("data-cj") as ThemeId) ?? DEFAULT_THEME);
    setModeState((d.getAttribute("data-mode") as Mode) ?? "system");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const apply = useCallback((t: ThemeId, m: Mode) => {
    const d = document.documentElement;
    d.setAttribute("data-cj", t);
    if (m === "system") d.removeAttribute("data-mode");
    else d.setAttribute("data-mode", m);
    store("cj-theme", t);
    store("cj-mode", m === "system" ? null : m);
    setThemeState(t);
    setModeState(m);
  }, []);

  const setTheme = useCallback(
    (t: ThemeId) => {
      setSaving("idle");
      apply(t, mode);
    },
    [apply, mode],
  );

  const setMode = useCallback(
    (m: Mode) => {
      setSaving("idle");
      apply(theme, m);
    },
    [apply, theme],
  );

  // On sign-in, load and apply the look saved to the account.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase()
      .from("profiles")
      .select("theme, mode")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data?.theme) return;
        const t = data.theme as ThemeId;
        const m = (data.mode as Mode) ?? "system";
        setSaved({ userId: user.id, theme: t, mode: m });
        apply(t, m);
      });
    return () => {
      cancelled = true;
    };
  }, [user, apply]);

  const saveLook = useCallback(async () => {
    if (!user) return;
    setSaving("saving");
    const { error } = await supabase().from("profiles").upsert({ id: user.id, theme, mode }, { onConflict: "id" });
    if (error) {
      setSaving("error");
      return;
    }
    setSaved({ userId: user.id, theme, mode });
    setSaving("saved");
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaving("idle"), 2500);
  }, [user, theme, mode]);

  useEffect(() => () => void (savedTimer.current && clearTimeout(savedTimer.current)), []);

  // Global shortcuts: ⌘K / Ctrl+K search, "/" search.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPanel((p) => (p === "search" ? null : "search"));
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setPanel("search");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<UI>(
    () => ({
      panel,
      open: (p) => setPanel(p),
      close: () => setPanel(null),
      chatOpen,
      chatDraft,
      openChat: (draft = "") => {
        setChatDraft(draft);
        setChatOpen(true);
        setPanel(null);
      },
      closeChat: () => setChatOpen(false),
      theme,
      mode,
      setTheme,
      setMode,
      signedIn: user === undefined ? undefined : !!user,
      unsaved: !!user && !(saved?.userId === user.id && saved.theme === theme && saved.mode === mode),
      saving,
      saveLook,
    }),
    [panel, chatOpen, chatDraft, theme, mode, setTheme, setMode, user, saved, saving, saveLook],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI() {
  const ui = useContext(Ctx);
  if (!ui) throw new Error("useUI must be used inside <UIProvider>");
  return ui;
}

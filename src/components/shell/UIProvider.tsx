"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_THEME, THEMES, type Mode, type ThemeId } from "@/lib/site";

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
  const [panel, setPanel] = useState<Panel>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDraft, setChatDraft] = useState("");
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [mode, setModeState] = useState<Mode>("system");

  useEffect(() => {
    const d = document.documentElement;
    // Sync React state with what the head script applied.
    /* eslint-disable react-hooks/set-state-in-effect */
    setThemeState((d.getAttribute("data-cj") as ThemeId) ?? DEFAULT_THEME);
    setModeState((d.getAttribute("data-mode") as Mode) ?? "system");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setTheme = useCallback((t: ThemeId) => {
    document.documentElement.setAttribute("data-cj", t);
    store("cj-theme", t);
    setThemeState(t);
  }, []);

  const setMode = useCallback((m: Mode) => {
    const d = document.documentElement;
    if (m === "system") d.removeAttribute("data-mode");
    else d.setAttribute("data-mode", m);
    store("cj-mode", m === "system" ? null : m);
    setModeState(m);
  }, []);

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
    }),
    [panel, chatOpen, chatDraft, theme, mode, setTheme, setMode],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI() {
  const ui = useContext(Ctx);
  if (!ui) throw new Error("useUI must be used inside <UIProvider>");
  return ui;
}

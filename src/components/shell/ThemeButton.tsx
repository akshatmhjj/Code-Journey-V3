"use client";

import { THEMES } from "@/lib/site";
import { useUI } from "./UIProvider";

export function ThemeButton() {
  const ui = useUI();
  const t = THEMES.find((x) => x.id === ui.theme) ?? THEMES[0];
  return (
    <button onClick={() => ui.open("settings")} className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-left hover:underline">
      <span className="flex overflow-hidden rounded-full border border-line-strong">
        {t.colors.map((c) => (
          <span key={c} className="size-4" style={{ background: c }} />
        ))}
      </span>
      {t.name}
      <span className="text-muted">· {ui.mode === "system" ? "System" : ui.mode === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}

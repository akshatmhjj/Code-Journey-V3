"use client";

import { THEMES } from "@/lib/site";
import { useUI } from "./UIProvider";

/** Opens theme settings. `compact` shows just the colour capsule, with the name kept for screen readers. */
export function ThemeButton({ compact = false }: { compact?: boolean }) {
  const ui = useUI();
  const t = THEMES.find((x) => x.id === ui.theme) ?? THEMES[0];
  const mode = ui.mode === "system" ? "System" : ui.mode === "dark" ? "Dark" : "Light";
  const capsule = (
    <span className="flex overflow-hidden rounded-full border border-line-strong">
      {t.colors.map((c) => (
        <span key={c} className={compact ? "size-3" : "size-4"} style={{ background: c }} />
      ))}
    </span>
  );
  if (compact) {
    return (
      <button onClick={() => ui.open("settings")} aria-label={`Theme: ${t.name}, ${mode}. Change theme`} title="Change theme" className="inline-flex">
        {capsule}
      </button>
    );
  }
  return (
    <button onClick={() => ui.open("settings")} className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-left hover:underline">
      {capsule}
      {t.name}
      <span className="text-muted">· {mode}</span>
    </button>
  );
}

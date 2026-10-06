"use client";

import Link from "next/link";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { THEMES, type Mode } from "@/lib/site";
import { Sheet } from "./Sheet";
import { useUI } from "./UIProvider";

const MODES: { id: Mode; label: string; Icon: typeof Sun }[] = [
  { id: "system", label: "System", Icon: Monitor },
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
];

/** Save to the account, so the same look loads next time on any device. */
function SaveLook() {
  const ui = useUI();
  if (ui.signedIn === undefined) return null;

  if (!ui.signedIn) {
    return (
      <p className="border-t border-line pt-4 text-sm text-muted">
        This look is saved on this device.{" "}
        <Link href="/login" className="link font-semibold text-ink">
          Sign in
        </Link>{" "}
        to keep it everywhere.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
      <button onClick={ui.saveLook} disabled={!ui.unsaved || ui.saving === "saving"} className="btn btn-ink disabled:opacity-40">
        {ui.saving === "saving" ? "Saving…" : "Save to my account"}
      </button>
      <p className="text-sm text-muted" role="status">
        {ui.saving === "error" ? (
          <span className="text-ink">Couldn&apos;t save. Try again.</span>
        ) : ui.saving === "saved" ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
            <Check size={15} /> Saved
          </span>
        ) : ui.unsaved ? (
          "Not saved yet"
        ) : (
          "Loads automatically when you sign in"
        )}
      </p>
    </div>
  );
}

/** Theme chooser: four palettes x light/dark/system. Also embedded on /me. */
export function ThemePicker() {
  const ui = useUI();
  return (
    <div className="grid gap-6">
      <fieldset>
        <legend className="eyebrow mb-3">Palette</legend>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => {
            const on = ui.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => ui.setTheme(t.id)}
                aria-pressed={on}
                className={`grid gap-2.5 rounded-[var(--radius-md)] border-2 p-2.5 text-left transition-colors ${
                  on ? "border-ink" : "border-line hover:border-line-strong"
                }`}
              >
                <span className="grid h-14 grid-cols-[2fr_1fr_1fr] grid-rows-2 overflow-hidden rounded-[6px] border border-line">
                  <span className="row-span-2" style={{ background: t.colors[0] }} />
                  <span className="row-span-2" style={{ background: t.colors[1] }} />
                  <span style={{ background: t.colors[2] }} />
                  <span style={{ background: t.colors[3] }} />
                </span>
                <span className="flex items-center justify-between font-display font-bold">
                  {t.name}
                  {on && <Check size={17} />}
                </span>
                <span className="text-[12px] leading-snug text-muted">{t.names.join(" · ")}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-3">Mode</legend>
        <div className="grid grid-cols-3 rounded-full border-2 border-ink p-1">
          {MODES.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => ui.setMode(id)}
              aria-pressed={ui.mode === id}
              className={`flex h-10 items-center justify-center gap-2 rounded-full font-display text-sm font-semibold ${
                ui.mode === id ? "bg-ink text-canvas" : "hover:bg-raise"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </fieldset>
      <SaveLook />
    </div>
  );
}

export function ThemeSettings() {
  const ui = useUI();
  return (
    <Sheet open={ui.panel === "settings"} onClose={ui.close} label="Theme settings" variant="side">
      <div className="overflow-y-auto p-6 pt-5">
        <h2 className="text-2xl font-bold">Make it yours</h2>
        <p className="mt-1.5 mb-6 text-muted">Four palettes, four colours each. Your choice follows you when you sign in.</p>
        <ThemePicker />
      </div>
    </Sheet>
  );
}

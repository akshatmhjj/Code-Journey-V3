"use client";

import { Palette } from "lucide-react";
import { useUI } from "./UIProvider";

export function ThemeIconButton() {
  const ui = useUI();
  return (
    <button onClick={() => ui.open("settings")} aria-label="Theme settings" className="grid size-11 place-items-center rounded-full hover:bg-raise">
      <Palette size={20} />
    </button>
  );
}

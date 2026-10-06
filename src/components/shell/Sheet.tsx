"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Modal built on <dialog>: focus trap, Escape and backdrop come from the browser.
 * variant "center" = command palette, "full" = full-screen overlay, "side" = right-hand panel.
 */
export function Sheet({
  open,
  onClose,
  label,
  variant = "center",
  children,
  hideClose = false,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  variant?: "center" | "full" | "side";
  children: React.ReactNode;
  hideClose?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  const box = {
    center:
      "mx-auto mt-[10vh] w-[min(680px,calc(100vw-1.5rem))] max-h-[78vh] rounded-[var(--radius-lg)] border-2 border-ink",
    full: "m-0 h-[100dvh] max-h-none w-screen max-w-none",
    side: "ml-auto mr-0 my-0 h-[100dvh] max-h-none w-[min(440px,100vw)] border-l-2 border-ink",
  }[variant];

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`${box} overflow-hidden bg-canvas p-0 text-ink shadow-[0_24px_80px_-20px_rgb(0_0_0/0.45)] backdrop:bg-[color-mix(in_oklab,var(--ink)_45%,transparent)] backdrop:backdrop-blur-[2px]`}
    >
      {open && (
        <div className="relative flex h-full max-h-[inherit] flex-col">
          {!hideClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full hover:bg-raise"
            >
              <X size={20} />
            </button>
          )}
          {children}
        </div>
      )}
    </dialog>
  );
}

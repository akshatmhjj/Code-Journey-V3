"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * Modal built on <dialog>: focus trap, Escape and backdrop come from the browser.
 * variant "center" = command palette, "full" = full-screen overlay, "side" = right-hand panel.
 * "full" slides up and "side" slides in from the right, and both slide back out on close (see .sheet-full and .sheet-side in globals.css).
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
  // Content stays mounted until the closing slide finishes, so it doesn't vanish mid-animation.
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open) {
      if (!d.open) {
        d.showModal();
        document.documentElement.style.overflow = "hidden";
      }
      // Read layout once so the off-screen starting position is applied, then slide in from it.
      void d.getBoundingClientRect();
      d.dataset.state = "open";
      return;
    }
    if (!d.open) return;
    const finish = () => {
      delete d.dataset.state;
      d.close();
      document.documentElement.style.overflow = "";
      setMounted(false);
    };
    const animated = (variant === "full" || variant === "side") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animated) {
      finish();
      return;
    }
    d.dataset.state = "closing";
    const fallback = setTimeout(finish, 500);
    const onEnd = (e: TransitionEvent) => {
      if (e.target === d && e.propertyName === "transform") {
        clearTimeout(fallback);
        finish();
      }
    };
    d.addEventListener("transitionend", onEnd);
    return () => {
      clearTimeout(fallback);
      d.removeEventListener("transitionend", onEnd);
    };
  }, [open, variant]);

  const box = {
    center:
      "mx-auto mt-[10vh] w-[min(680px,calc(100vw-1.5rem))] max-h-[78vh] rounded-[var(--radius-lg)] border-2 border-ink",
    full: "sheet-full m-0 h-[100dvh] max-h-none w-screen max-w-none",
    side: "sheet-side ml-auto mr-0 my-0 h-[100dvh] max-h-none w-[min(440px,100vw)] border-l-2 border-ink",
  }[variant];

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      // Escape: let the parent close it, so the slide-down plays instead of an instant close.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`${box} overflow-hidden bg-canvas p-0 text-ink shadow-[0_24px_80px_-20px_rgb(0_0_0/0.45)] backdrop:bg-[color-mix(in_oklab,var(--ink)_45%,transparent)] backdrop:backdrop-blur-[2px]`}
    >
      {mounted && (
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

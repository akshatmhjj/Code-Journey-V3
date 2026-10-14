"use client";

import { useId, useState } from "react";

/**
 * A section that opens and closes with a smooth height change and fade.
 * The height animates with a grid-rows transition, so it runs on the compositor-friendly path and needs no JavaScript animation loop.
 * A closed panel is hidden from view and from keyboard focus. Reduced-motion users get an instant change (see .cj-panel in globals.css).
 */
export function Disclosure({
  id,
  title,
  hint,
  eyebrow,
  variant = "section",
  defaultOpen = false,
  children,
}: {
  id?: string;
  title: React.ReactNode;
  hint?: string;
  eyebrow?: string;
  variant?: "section" | "inline";
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const toggle = () => setOpen((o) => !o);

  if (variant === "inline") {
    return (
      <div id={id} className="grid gap-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          className="inline-flex w-fit cursor-pointer items-center gap-2 font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4"
        >
          {title}
        </button>
        <Panel id={panelId} open={open}>
          {children}
        </Panel>
      </div>
    );
  }

  return (
    <section id={id} className="mt-12 border-t-2 border-ink pt-6 md:mt-16">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-2 text-left"
      >
        <span className="min-w-0">
          {eyebrow && <span className="eyebrow block">{eyebrow}</span>}
          <span className={`${eyebrow ? "mt-2 " : ""}block font-display text-2xl font-bold md:text-3xl`}>{title}</span>
          {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
        </span>
        <span className="shrink-0 rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold">{open ? "Hide" : "Show"}</span>
      </button>
      <Panel id={panelId} open={open}>
        {children}
      </Panel>
    </section>
  );
}

function Panel({ id, open, children }: { id: string; open: boolean; children: React.ReactNode }) {
  return (
    <div id={id} className="cj-panel" data-open={open} inert={!open}>
      <div className="cj-panel-inner">
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}

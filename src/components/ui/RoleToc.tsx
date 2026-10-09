"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Role page "On this page" list. Dots fill in the accent colour as you scroll past each section. */
export function RoleToc({ items, children }: { items: readonly (readonly [string, string])[]; children?: ReactNode }) {
  // Index of the section you are in. -1 = still above the first one, so nothing is filled yet.
  const [current, setCurrent] = useState(-1);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // A section counts as reached once its top crosses a line just under the sticky header.
      const line = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) + 120;
      let found = -1;
      items.forEach(([id], i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) found = i;
      });
      setCurrent(found);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-[calc(var(--header-h)+68px)]">
      <p className="eyebrow mb-4">On this page</p>
      <ol className="grid gap-3 border-l-[3px] border-ink pl-4">
        {items.map(([id, label], i) => {
          const passed = i <= current;
          const here = i === current;
          return (
            <li key={id} className="relative">
              <span
                aria-hidden="true"
                className={`absolute top-[0.45em] -left-[24px] size-3 rounded-full border-[3px] transition-colors ${
                  passed ? "border-accent bg-accent" : "border-ink bg-canvas"
                }`}
              />
              <a href={`#${id}`} aria-current={here ? "location" : undefined} className={`hover:text-ink hover:underline ${here ? "font-semibold text-ink" : "text-muted"}`}>
                {label}
              </a>
            </li>
          );
        })}
      </ol>
      {children && <div className="mt-8">{children}</div>}
    </nav>
  );
}

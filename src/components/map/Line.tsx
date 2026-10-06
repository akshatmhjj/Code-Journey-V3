import { LINE } from "@/lib/lines";
import type { LineStyle } from "@/lib/content";

/** One transit line along an SVG path, drawn in the line's pattern. */
export function LinePath({ d, style, color = "var(--ink)", scale = 1 }: { d: string; style: LineStyle; color?: string; scale?: number }) {
  const l = LINE[style];
  const w = l.width * scale;
  const common = { d, fill: "none", strokeLinejoin: "round" as const };
  if (l.double || l.hollow) {
    return (
      <g>
        <path {...common} stroke={color} strokeWidth={w} strokeLinecap="round" />
        <path {...common} stroke="var(--canvas)" strokeWidth={l.double ? w * 0.36 : w * 0.5} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <path
      {...common}
      stroke={color}
      strokeWidth={w}
      strokeLinecap={style === "dotted" || style === "dashdot" ? "round" : "butt"}
      strokeDasharray={l.dash}
    />
  );
}

/** A short horizontal sample of a line, used in badges and legends. */
export function LineGlyph({ style, width = 40, className }: { style: LineStyle; width?: number; className?: string }) {
  return (
    <svg width={width} height="12" viewBox={`0 0 ${width} 12`} aria-hidden="true" className={className}>
      <LinePath d={`M3 6H${width - 3}`} style={style} scale={0.75} />
    </svg>
  );
}

export type StationKind = "live" | "planned" | "here" | "stop";

/** A station marker. live = has a page, planned = being mapped, here = the current page. */
export function Station({ x, y, kind = "stop", r = 7 }: { x: number; y: number; kind?: StationKind; r?: number }) {
  if (kind === "here") {
    return (
      <g>
        <circle cx={x} cy={y} r={r + 5} fill="var(--accent)" opacity="0.25" />
        <circle cx={x} cy={y} r={r} fill="var(--accent)" stroke="var(--ink)" strokeWidth="3" />
      </g>
    );
  }
  if (kind === "live") return <circle cx={x} cy={y} r={r} fill="var(--accent)" stroke="var(--ink)" strokeWidth="3.5" />;
  if (kind === "planned") return <circle cx={x} cy={y} r={r - 1.5} fill="var(--canvas)" stroke="var(--faint)" strokeWidth="2.5" />;
  return <circle cx={x} cy={y} r={r} fill="var(--canvas)" stroke="var(--ink)" strokeWidth="3.5" />;
}

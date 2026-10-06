import type { LineStyle } from "./content";

/** SVG stroke settings for each domain's line, so lines differ by pattern instead of colour. */
export const LINE: Record<LineStyle, { width: number; dash?: string; double?: boolean; hollow?: boolean; label: string }> = {
  solid: { width: 6, label: "Solid line" },
  double: { width: 7, double: true, label: "Double line" },
  dashed: { width: 6, dash: "14 7", label: "Dashed line" },
  dotted: { width: 6, dash: "0.1 11", label: "Dotted line" },
  thin: { width: 3, label: "Thin line" },
  dashdot: { width: 5, dash: "16 6 0.1 6", label: "Dash-dot line" },
  short: { width: 5, dash: "5 5", label: "Short-dash line" },
  hollow: { width: 8, hollow: true, label: "Hollow line" },
  rail: { width: 6, dash: "2 4", label: "Rail line" },
  hub: { width: 9, hollow: true, label: "Hub" },
};

import type { Domain, RoleEntry } from "@/lib/content";
import { LinePath, Station } from "./Line";

const W = 1200;
const PITCH = 60;
const TOP = 64;
const HUB_X = 74;
const HUB_PITCH = 18;
const BEND_X = 132;
const STOPS_FROM = 400;
const STOPS_TO = 975;
const END_X = 1012;

function wrap(label: string, max = 17) {
  if (label.length <= max) return [label];
  const words = label.split(" ");
  let a = "";
  while (words.length && (a + " " + words[0]).trim().length <= max) a = (a + " " + words.shift()).trim();
  return a ? [a, words.join(" ")] : [label];
}

/** The full network: every domain as a line leaving the Foundations interchange, roles as stations. */
export function NetworkMap({ domains, roles, title = "Code Journey network map" }: { domains: Domain[]; roles: RoleEntry[]; title?: string }) {
  const lines = domains.filter((d) => d.line !== "hub");
  const hub = domains.find((d) => d.line === "hub");
  const n = lines.length;
  const H = TOP * 2 + (n - 1) * PITCH;
  const mid = TOP + ((n - 1) * PITCH) / 2;
  const hubTop = mid - ((n - 1) * HUB_PITCH) / 2;

  const paths = lines.map((d, i) => {
    const yh = hubTop + i * HUB_PITCH;
    const yf = TOP + i * PITCH;
    const run = Math.abs(yf - yh);
    return { d, yf, path: `M${HUB_X} ${yh}H${BEND_X}L${BEND_X + run} ${yf}H${END_X}` };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="netmap-title" className="h-auto w-full">
      <title id="netmap-title">{title}</title>
      {paths.map(({ d, path }) => (
        <LinePath key={d.slug} d={path} style={d.line} />
      ))}

      {/* Trains: decorative, hidden for reduced motion */}
      <g className="trains" aria-hidden="true">
        {paths.map(({ d, path }, i) => (
          <rect key={d.slug} x="-9" y="-3.5" width="18" height="7" rx="3.5" fill="var(--canvas)" stroke="var(--accent)" strokeWidth="2.5">
            <animateMotion dur={`${11 + (i % 4) * 2.5}s`} begin={`${-i * 1.7}s`} repeatCount="indefinite" rotate="auto" path={path} />
          </rect>
        ))}
      </g>

      {/* Foundations interchange */}
      <a href={hub ? `/domains/${hub.slug}` : "/skills"} aria-label="Foundations: shared skills">
        <rect
          x={HUB_X - 17}
          y={hubTop - 20}
          width="34"
          height={(n - 1) * HUB_PITCH + 40}
          rx="17"
          fill="var(--canvas)"
          stroke="var(--ink)"
          strokeWidth="4.5"
        />
        <text x={HUB_X} y={hubTop + (n - 1) * HUB_PITCH + 48} textAnchor="middle" className="fill-ink font-display text-[15px] font-bold">
          Foundations
        </text>
        <text x={HUB_X} y={hubTop + (n - 1) * HUB_PITCH + 66} textAnchor="middle" className="fill-muted font-mono text-[11px] tracking-wider">
          START HERE
        </text>
      </a>

      {paths.map(({ d, yf }) => {
        const stops = roles.filter((r) => r.domain === d.slug);
        const step = (STOPS_TO - STOPS_FROM) / Math.max(stops.length, 1);
        return (
          <g key={d.slug}>
            {stops.map((r, j) => {
              const x = STOPS_FROM + step * (j + 0.5);
              const label = wrap(r.title);
              const body = (
                <>
                  <Station x={x} y={yf} kind={r.live ? "live" : "planned"} r={r.live ? 9 : 7} />
                  <text
                    x={x}
                    y={yf - (label.length === 2 ? 30 : 16)}
                    textAnchor="middle"
                    className={r.live ? "fill-ink font-display text-[14px] font-bold" : "fill-muted text-[13px]"}
                  >
                    {label.map((t, k) => (
                      <tspan key={k} x={x} dy={k ? 14 : 0}>
                        {t}
                      </tspan>
                    ))}
                  </text>
                </>
              );
              return (
                <a key={r.slug} href={`/roles/${r.slug}`} aria-label={r.live ? `${r.title} route` : `${r.title} (being mapped)`}>
                  {body}
                </a>
              );
            })}
            <a href={`/domains/${d.slug}`} aria-label={`${d.name} domain`}>
              <rect x={END_X + 8} y={yf - 14} width="52" height="28" rx="6" fill="var(--ink)" />
              <text x={END_X + 34} y={yf + 4.5} textAnchor="middle" className="fill-canvas font-mono text-[12px] font-bold tracking-wider">
                {d.code}
              </text>
              <text x={END_X + 70} y={yf + 5} className="fill-ink font-display text-[14px] font-semibold">
                {d.name}
              </text>
            </a>
          </g>
        );
      })}
    </svg>
  );
}

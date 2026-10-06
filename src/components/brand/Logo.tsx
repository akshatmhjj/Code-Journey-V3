/** The Route CJ mark: one line draws "cj", from an open start station to the accent destination (the j's dot). */
export function Mark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <g transform="translate(1 0)">
        <path
          d="M29 25.88A14 14 0 1 0 22 52L42 52A8 8 0 0 0 50 44L50 18"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="29" cy="25.88" r="5" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="3.4" />
        <circle cx="50" cy="14" r="7" fill="var(--accent)" stroke="var(--canvas)" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark size={compact ? 30 : 34} />
      <span className="font-display text-[1.15rem] font-bold leading-none tracking-[-0.03em]">
        Code Journey
      </span>
    </span>
  );
}

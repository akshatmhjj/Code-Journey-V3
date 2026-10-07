// Small building blocks for the admin dashboard. Server components, plain HTML and CSS.

const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
export const when = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
export const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
export const num = (n: number) => n.toLocaleString("en-IN");

export function Panel({ title, note, children, className = "" }: { title: string; note?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-[var(--radius-lg)] border-2 border-ink p-4 md:p-6 ${className}`}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">{title}</h2>
        {note && <p className="text-sm text-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/** A headline number with a short label and optional context line. */
export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-[var(--radius-md)] bg-surface p-4">
      <p className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">{label}</p>
      <p className="mt-1.5 font-display text-3xl font-bold tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
    </div>
  );
}

/** One bar per day for the last 30 days. Hover or focus a bar to read its value. */
export function DayBars({ data, label, unit }: { data: { d: string; n: number }[]; label: string; unit: string }) {
  const max = Math.max(1, ...data.map((x) => x.n));
  const total = data.reduce((a, x) => a + x.n, 0);
  return (
    <figure className="min-w-0">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <figcaption className="font-semibold">{label}</figcaption>
        <span className="text-muted tabular-nums">
          {num(total)} in 30 days · peak {num(max === 1 && total === 0 ? 0 : max)}
        </span>
      </div>
      <div className="relative mt-3 flex h-28 items-end gap-[2px] border-b border-line" role="img" aria-label={`${label}: ${num(total)} ${unit} in the last 30 days`}>
        {data.map((x) => (
          <div key={x.d} tabIndex={0} className="group relative flex h-full min-w-0 flex-1 items-end outline-none">
            <div
              className="w-full rounded-t-[4px] bg-accent transition-opacity group-hover:opacity-80 group-focus:opacity-80"
              style={{ height: x.n ? `${Math.max(4, (x.n / max) * 100)}%` : "2px", opacity: x.n ? undefined : 0.35 }}
            />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-[12px] whitespace-nowrap text-canvas group-hover:block group-focus:block">
              {dayFmt.format(new Date(x.d))}: {num(x.n)} {unit}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[11px] text-muted">
        <span>{data[0] && dayFmt.format(new Date(data[0].d))}</span>
        <span>today</span>
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {data.map((x) => (
            <tr key={x.d}>
              <th scope="row">{x.d}</th>
              <td>{x.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Ranked horizontal bars: label, bar, value. */
export function RankBars({ rows, empty = "Nothing yet." }: { rows: { label: React.ReactNode; n: number; key: string }[]; empty?: string }) {
  if (!rows.length) return <p className="text-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.n));
  return (
    <ol className="grid gap-2">
      {rows.map((r) => (
        <li key={r.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-[15px] sm:grid-cols-[minmax(0,200px)_1fr_auto]">
          <span className="min-w-0 truncate">{r.label}</span>
          <span aria-hidden="true" className="col-span-2 h-2.5 rounded-full bg-surface sm:col-span-1">
            <span className="block h-full rounded-full bg-ink" style={{ width: `${(r.n / max) * 100}%` }} />
          </span>
          <span className="row-start-1 font-mono text-[13px] tabular-nums sm:row-auto">{num(r.n)}</span>
        </li>
      ))}
    </ol>
  );
}

/** Two-part bar, e.g. thumbs up vs down, with both shares written out. */
export function SplitBar({ a, b, aLabel, bLabel }: { a: number; b: number; aLabel: string; bLabel: string }) {
  const total = a + b;
  const pa = total ? Math.round((a / total) * 100) : 0;
  return (
    <div>
      <div aria-hidden="true" className="flex h-3 gap-[2px] overflow-hidden rounded-full bg-surface">
        {a > 0 && <span className="h-full rounded-l-full bg-ink" style={{ width: `${pa}%` }} />}
        {b > 0 && <span className="h-full flex-1 rounded-r-full bg-accent" />}
      </div>
      <p className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
        <span>
          <span className="mr-1.5 inline-block size-2.5 rounded-full bg-ink" />
          {aLabel} {num(a)} ({total ? pa : 0}%)
        </span>
        <span>
          <span className="mr-1.5 inline-block size-2.5 rounded-full bg-accent" />
          {bLabel} {num(b)} ({total ? 100 - pa : 0}%)
        </span>
      </p>
    </div>
  );
}

export function Pill({ children, tone = "line" }: { children: React.ReactNode; tone?: "line" | "ink" | "accent" }) {
  const cls = { line: "border-line text-muted", ink: "border-ink bg-ink text-canvas", accent: "border-accent bg-accent text-on-accent" }[tone];
  return <span className={`inline-flex items-center rounded-full border-2 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide uppercase ${cls}`}>{children}</span>;
}

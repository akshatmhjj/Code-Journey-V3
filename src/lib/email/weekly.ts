// The weekly progress email: subject, HTML and plain text from a person's route and progress.
// Pure function, no I/O, so it can be previewed and tested without sending anything.
import { computeProgress, formatHours, type PathIndex, type Statuses } from "@/lib/path";

export type WeeklyInput = {
  name: string | null;
  roleSlug: string;
  statuses: Statuses;
  doneThisWeek: string[];
  siteUrl: string;
  unsubscribeUrl: string;
};

const C = { canvas: "#faf3e1", ink: "#222222", support: "#f5e7c6", accent: "#ff6d1f", muted: "#5b5750" };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function buildWeeklyEmail(index: PathIndex, input: WeeklyInput) {
  const p = computeProgress(index, input.roleSlug, input.statuses);
  if (!p) return null;
  const title = (slug: string) => index.skills[slug]?.title.replace(/\s*\(.*\)$/, "") ?? slug;
  const skillUrl = (slug: string) => `${input.siteUrl}/skills/${slug}`;
  const routeUrl = `${input.siteUrl}/roles/${input.roleSlug}`;
  const meUrl = `${input.siteUrl}/me`;
  const thisWeek = input.doneThisWeek.filter((s) => p.skills.includes(s));
  const stage = p.stages[p.currentStage];
  const finished = p.percent === 100;

  const subject = finished
    ? `You've reached ${p.role.title}`
    : thisWeek.length
      ? `${plural(thisWeek.length, "station")} this week - ${p.percent}% of the way to ${p.role.title}`
      : `${p.percent}% of the way to ${p.role.title} - next stop: ${title(p.next[0])}`;

  const hello = input.name ? `Hi ${input.name},` : "Hi,";
  const lead = finished
    ? `Every station on the ${p.role.title} route is ticked off. That's the whole map for this role - now it's about applying, and going deeper where the jobs you want ask for it.`
    : thisWeek.length
      ? `You ticked off ${plural(thisWeek.length, "station")} this week. Here's where that leaves you.`
      : `No new stations this week - that's fine, weeks like that happen. Here's where you are, so it's easy to pick up again.`;

  const nextLines = p.next.slice(0, 3);

  /* ── Plain text ── */
  const text = [
    hello,
    "",
    lead,
    "",
    `${p.role.title}: ${p.percent}% (${p.done} of ${p.total} stations)`,
    stage && !finished ? `Current stage: ${stage.name} (${stage.done}/${stage.total})` : "",
    p.hoursLeft[1] > 0 ? `About ${formatHours(p.hoursLeft)} left.` : "",
    "",
    thisWeek.length ? `This week: ${thisWeek.map(title).join(", ")}` : "",
    nextLines.length ? `Next stations:\n${nextLines.map((s) => `- ${title(s)}: ${skillUrl(s)}`).join("\n")}` : "",
    "",
    `Your progress: ${meUrl}`,
    `The full route: ${routeUrl}`,
    "",
    "-",
    "You're getting this because you turned on weekly progress emails on Code Journey.",
    `Turn them off: ${input.unsubscribeUrl}`,
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");

  /* ── HTML (tables and inline styles, for email clients) ── */
  const bar = (pct: number, color: string, height = 10) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>` +
    (pct > 0 ? `<td width="${pct}%" style="background:${color};height:${height}px;border-radius:${height}px;font-size:0;line-height:0">&nbsp;</td>` : "") +
    (pct < 100 ? `<td style="background:${C.support};height:${height}px;border-radius:${height}px;font-size:0;line-height:0">&nbsp;</td>` : "") +
    `</tr></table>`;

  const link = (href: string, label: string) => `<a href="${esc(href)}" style="color:${C.ink};font-weight:700;text-decoration:underline">${esc(label)}</a>`;

  const stagesHtml = p.stages
    .map(
      (s, i) => `
      <tr>
        <td style="padding:6px 12px 6px 0;font-size:14px;white-space:nowrap;${i === p.currentStage && !finished ? "font-weight:700" : `color:${C.muted}`}">${esc(s.name)}</td>
        <td width="100%" style="padding:6px 0">${bar(s.percent, C.ink, 6)}</td>
        <td style="padding:6px 0 6px 12px;font-size:13px;color:${C.muted};font-family:ui-monospace,Menlo,monospace;white-space:nowrap">${s.done}/${s.total}</td>
      </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.canvas};color:${C.ink};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden">${esc(lead)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas}">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
  <tr><td style="padding-bottom:24px;font-weight:800;font-size:18px;letter-spacing:-0.01em">
    <span style="display:inline-block;width:10px;height:10px;border-radius:10px;background:${C.accent};margin-right:8px"></span>Code Journey
  </td></tr>
  <tr><td style="font-size:16px;line-height:1.55">
    <p style="margin:0 0 12px">${esc(hello)}</p>
    <p style="margin:0 0 24px">${esc(lead)}</p>
  </td></tr>
  <tr><td style="background:${C.ink};color:${C.canvas};border-radius:16px;padding:24px">
    <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.75;font-family:ui-monospace,Menlo,monospace">Your route</p>
    <p style="margin:6px 0 16px;font-size:22px;font-weight:800">${esc(p.role.title)}</p>
    <p style="margin:0 0 10px"><span style="font-size:44px;font-weight:800;line-height:1">${p.percent}%</span>
      <span style="font-size:14px;opacity:0.8">&nbsp; ${p.done} of ${p.total} stations${p.learning ? ` &middot; ${p.learning} in progress` : ""}</span></p>
    ${bar(p.percent, C.accent)}
    ${p.hoursLeft[1] > 0 ? `<p style="margin:12px 0 0;font-size:14px;opacity:0.8">About ${esc(formatHours(p.hoursLeft))} left.</p>` : ""}
  </td></tr>
  ${
    thisWeek.length
      ? `<tr><td style="padding:28px 0 0">
    <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${C.muted};font-family:ui-monospace,Menlo,monospace">Ticked off this week</p>
    <p style="margin:0;font-size:16px;line-height:1.7">${thisWeek.map((s) => `&#10003; ${link(skillUrl(s), title(s))}`).join("<br>")}</p>
  </td></tr>`
      : ""
  }
  ${
    nextLines.length
      ? `<tr><td style="padding:28px 0 0">
    <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${C.muted};font-family:ui-monospace,Menlo,monospace">Next stations</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${nextLines
        .map(
          (s, i) => `<tr><td style="padding:10px 0;border-top:1px solid ${C.support};font-size:16px">
            <span style="font-family:ui-monospace,Menlo,monospace;color:${C.muted};font-size:13px">${String(i + 1).padStart(2, "0")}</span>&nbsp;&nbsp;${link(skillUrl(s), title(s))}${input.statuses[s] === "learning" ? ` <span style="color:${C.muted};font-size:13px">&middot; in progress</span>` : ""}
          </td></tr>`,
        )
        .join("")}
    </table>
  </td></tr>`
      : ""
  }
  <tr><td style="padding:28px 0 0">
    <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${C.muted};font-family:ui-monospace,Menlo,monospace">Stages</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stagesHtml}</table>
  </td></tr>
  <tr><td style="padding:28px 0 0">
    <a href="${esc(meUrl)}" style="display:inline-block;background:${C.accent};color:${C.ink};font-weight:700;font-size:16px;text-decoration:none;padding:12px 22px;border-radius:999px">Open My Path</a>
    &nbsp; ${link(routeUrl, "See the full route")}
  </td></tr>
  <tr><td style="padding:36px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">
    You're getting this because you turned on weekly progress emails on Code Journey.
    ${link(input.unsubscribeUrl, "Turn them off")} with one click, or from ${link(meUrl, "My Path")}.
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, html, text };
}

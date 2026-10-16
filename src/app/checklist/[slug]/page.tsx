import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDomain, getNetwork, getRole, getRoleEntry, getSkill, getSkillEntry } from "@/lib/content";

// A printable route: one page per stage (A4 when printed), with a tick box for every skill and its best official link.
// Outside the site layout on purpose, so printing gives a clean sheet with no header, footer or chat.

export function generateStaticParams() {
  return getNetwork().roles.map((r) => ({ slug: r.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getRoleEntry(slug);
  return {
    title: entry ? `${entry.title} checklist` : "Checklist",
    robots: { index: false, follow: false },
    alternates: { canonical: `/roles/${slug}` },
  };
}

const CSS = `
@page { size: A4; margin: 14mm; }
.ck { font-family: var(--font-body), system-ui, sans-serif; color: #161616; background: #fff; min-height: 100vh; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.ck-wrap { max-width: 760px; margin: 0 auto; padding: 36px 24px 64px; }
.ck-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 13px; color: #555; border-bottom: 1px solid #161616; padding-bottom: 10px; }
.ck-brand { font-family: var(--font-display), system-ui, sans-serif; font-weight: 700; font-size: 15px; color: #161616; }
.ck h1 { font-family: var(--font-display), system-ui, sans-serif; font-size: 44px; line-height: 1; letter-spacing: -0.03em; margin: 26px 0 10px; }
.ck .lede { font-size: 16px; color: #444; margin: 0 0 16px; max-width: 62ch; }
.ck .meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: 13px; }
.ck .meta span { border: 1px solid #161616; border-radius: 999px; padding: 4px 10px; }
.ck .how { margin: 20px 0 0; font-size: 14px; color: #333; }
.stage { break-inside: avoid; margin-top: 26px; border-top: 2px solid #161616; padding-top: 14px; }
.stage-no { font-family: var(--font-code), ui-monospace, monospace; font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.08em; }
.stage h2 { font-family: var(--font-display), system-ui, sans-serif; font-size: 24px; letter-spacing: -0.02em; margin: 4px 0 4px; }
.stage .summary { margin: 0 0 10px; color: #444; font-size: 14px; }
.skills { list-style: none; margin: 0; padding: 0; }
.skills li { display: grid; grid-template-columns: 14px 1fr; gap: 10px; padding: 8px 0; border-bottom: 1px solid #ddd; break-inside: avoid; }
.box { width: 13px; height: 13px; border: 1.5px solid #161616; border-radius: 3px; margin-top: 4px; }
.skill-title { font-weight: 600; font-size: 15px; }
.skill-meta { font-size: 12.5px; color: #555; margin-top: 2px; }
.skill-link { font-size: 12.5px; color: #161616; word-break: break-all; margin-top: 2px; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
.two div { border: 1px solid #161616; border-radius: 8px; padding: 10px 12px; break-inside: avoid; }
.two b { font-family: var(--font-display), system-ui, sans-serif; font-size: 14px; display: block; margin-bottom: 4px; }
.two p { margin: 0; font-size: 13.5px; }
.ck-foot { margin-top: 32px; border-top: 1px solid #161616; padding-top: 10px; font-size: 12px; color: #555; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.screen-only { font-size: 13px; color: #555; margin-top: 14px; }
@media print {
  .ck-wrap { padding: 0; max-width: none; }
  .screen-only { display: none; }
  .ck h1 { font-size: 36px; }
}
@media (max-width: 640px) {
  .ck-wrap { padding: 24px 18px 48px; }
  .ck h1 { font-size: 34px; }
  .two { grid-template-columns: 1fr; }
}
`;

function totalWeeks(weeks: (string | undefined)[]) {
  let lo = 0;
  let hi = 0;
  for (const w of weeks) {
    const m = w?.match(/(\d+)\D+(\d+)/);
    if (m) {
      lo += +m[1];
      hi += +m[2];
    }
  }
  return hi ? `${Math.round(lo / 4.3)}–${Math.round(hi / 4.3)} months` : null;
}

export default async function Checklist({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getRoleEntry(slug);
  if (!entry) notFound();
  const role = getRole(slug);
  if (!role) notFound();
  const domain = getDomain(entry.domain);
  const skillCount = new Set(role.stages.flatMap((s) => s.skills)).size;
  const jobReady = totalWeeks(role.stages.slice(0, 3).map((s) => s.weeks));
  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <div className="ck">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ck-wrap">
        <div className="ck-top">
          <span className="ck-brand">Code Journey</span>
          <span>codejourney.space/roles/{slug}</span>
        </div>

        <h1>{role.title}</h1>
        <p className="lede">{role.summary}</p>
        <div className="meta">
          <span>{role.stages.length} stages</span>
          <span>{skillCount} skills</span>
          {domain && <span>{domain.name}</span>}
          {jobReady && <span>Job-ready in about {jobReady} at 10 h a week</span>}
        </div>
        <p className="how">
          Work from the top. Tick a skill when you can use it without notes. Build the stage&apos;s project before you start the next stage, and check the &ldquo;You are done when&rdquo; line
          honestly.
        </p>
        <p className="screen-only">To keep this as a PDF, press Ctrl or Cmd + P and choose &ldquo;Save as PDF&rdquo;.</p>

        {role.stages.map((stage, i) => (
          <section key={stage.name} className="stage" aria-labelledby={`stage-${i}`}>
            <p className="stage-no">
              Stage {i + 1}
              {stage.weeks ? ` · ${stage.weeks} weeks at 10 h a week` : ""}
            </p>
            <h2 id={`stage-${i}`}>{stage.name}</h2>
            <p className="summary">{stage.summary}</p>

            <ul className="skills">
              {stage.skills.map((s) => {
                const skill = getSkill(s);
                const title = getSkillEntry(s)?.title ?? s;
                const resource = skill?.resources.find((r) => r.official) ?? skill?.resources[0];
                return (
                  <li key={s}>
                    <span className="box" aria-hidden="true" />
                    <div>
                      <div className="skill-title">{title}</div>
                      {skill?.hours && <div className="skill-meta">About {skill.hours} hours{skill.level ? ` · ${skill.level}` : ""}</div>}
                      {resource && (
                        <div className="skill-link">
                          Start with: {resource.title} · {new URL(resource.url).hostname.replace(/^www\./, "")}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="two">
              <div>
                <b>Build this</b>
                <p>{stage.project}</p>
              </div>
              <div>
                <b>You are done when</b>
                <p>{stage.doneWhen}</p>
              </div>
            </div>
          </section>
        ))}

        <div className="ck-foot">
          <span>Full route, live links and the latest updates: codejourney.space/roles/{slug}</span>
          <span>Route updated {fmt.format(role.updated)}</span>
        </div>
      </div>
    </div>
  );
}

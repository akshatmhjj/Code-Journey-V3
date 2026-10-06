import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCompareRoles, getComparePairs, getNetwork, pairSlug, type CompareRole } from "@/lib/content";
import { lakh, usd } from "@/lib/money";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/ui/JsonLd";
import { Trail } from "@/components/ui/Trail";
import { Compare } from "../Compare";

// Popular pairs are built ahead of time; any other pair renders on first visit and is then cached.
export function generateStaticParams() {
  return getComparePairs().map((p) => ({ pair: pairSlug(p.a, p.b) }));
}

function resolve(pair: string) {
  const [a, b, extra] = pair.split("-vs-");
  if (!a || !b || extra !== undefined || a === b) return null;
  const roles = getCompareRoles();
  const A = roles.find((r) => r.slug === a);
  const B = roles.find((r) => r.slug === b);
  if (!A || !B) return null;
  const listed = getComparePairs().find((p) => (p.a === a && p.b === b) || (p.a === b && p.b === a));
  // Reversed popular pairs point search engines at the listed order; unlisted pairs stay out of the index.
  const canonical = listed ? pairSlug(listed.a, listed.b) : null;
  return { A, B, roles, canonical };
}

function overlap(A: CompareRole, B: CompareRole) {
  const inB = new Set(B.route);
  const shared = A.route.filter((s) => inB.has(s));
  const union = new Set([...A.route, ...B.route]).size;
  return { shared, percent: union ? Math.round((shared.length / union) * 100) : 0 };
}

function payLine(A: CompareRole, B: CompareRole) {
  const a = A.pay.india;
  const b = B.pay.india;
  if (!a || !b) return null;
  if (Math.abs(a.avg - b.avg) < 0.5) return `Average pay in India is similar — about ${lakh(a.avg)} and ${lakh(b.avg)} a year.`;
  const [hi, lo] = a.avg > b.avg ? [A, B] : [B, A];
  return `In India, ${hi.title} roles average ${lakh(hi.pay.india!.avg)} a year, against ${lakh(lo.pay.india!.avg)} for ${lo.title}.`;
}

export async function generateMetadata({ params }: PageProps<"/roles/compare/[pair]">): Promise<Metadata> {
  const { pair } = await params;
  const r = resolve(pair);
  if (!r) return {};
  const { A, B, canonical } = r;
  const { shared } = overlap(A, B);
  const pay = A.pay.india && B.pay.india ? ` Pay: ${lakh(A.pay.india.avg)} vs ${lakh(B.pay.india.avg)} average in India.` : "";
  return {
    title: `${A.title} vs ${B.title}: Skills, Pay and Which to Choose`,
    description: `${A.title} or ${B.title}? ${shared.length} skills in common, time to job-ready (${A.jobReady} vs ${B.jobReady}), interviews and how AI is changing each.${pay}`,
    alternates: { canonical: `/roles/compare/${canonical ?? pair}` },
    robots: canonical ? undefined : { index: false, follow: true },
  };
}

export default async function ComparePair({ params }: PageProps<"/roles/compare/[pair]">) {
  const { pair } = await params;
  const r = resolve(pair);
  if (!r) notFound();
  const { A, B, roles } = r;
  const { shared, percent } = overlap(A, B);
  const titles = Object.fromEntries(getNetwork().skills.map((s) => [s.slug, s.title.replace(/\s*\(.*\)$/, "")]));
  const pay = payLine(A, B);
  const usPay = A.pay.us && B.pay.us && A.pay.us.title !== B.pay.us.title ? ` In the US, medians are ${usd(A.pay.us.median)} and ${usd(B.pay.us.median)}.` : "";

  const answer =
    `The ${A.title} and ${B.title} routes share ${shared.length} skills (${percent}% of the two routes combined). ` +
    `Reaching job-ready takes about ${A.jobReady} for ${A.title} and ${B.jobReady} for ${B.title}, studying around 10 hours a week. ` +
    (pay ? `${pay}${usPay} ` : "") +
    (percent >= 40
      ? "Because so much overlaps, starting one keeps the other open — learn the shared skills first."
      : "They split early, so it's worth choosing before you go deep — the shared skills are mostly foundations.");

  return (
    <>
      <Trail stops={[{ label: "Roles", href: "/roles" }, { label: "Compare", href: "/roles/compare" }, { label: `${A.title} vs ${B.title}` }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `What's the difference between a ${A.title} and a ${B.title}?`,
              acceptedAnswer: { "@type": "Answer", text: `${A.summary} ${B.summary}` },
            },
            {
              "@type": "Question",
              name: `Should I become a ${A.title} or a ${B.title}?`,
              acceptedAnswer: { "@type": "Answer", text: answer },
            },
          ],
          url: `${SITE.url}/roles/compare/${pair}`,
        }}
      />
      <Compare
        roles={roles}
        skillTitles={titles}
        a={A.slug}
        b={B.slug}
        intro={answer}
      />
    </>
  );
}

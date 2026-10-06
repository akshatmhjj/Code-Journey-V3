import Link from "next/link";
import SiteLayout from "./(site)/layout";

export default function NotFound() {
  return (
    <SiteLayout>
    <div className="wrap py-20 md:py-32">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-5 max-w-[14ch] text-[clamp(3rem,9vw,6.5rem)] leading-[0.92] font-bold tracking-[-0.045em]">This station isn&apos;t on the map.</h1>
      <svg aria-hidden="true" viewBox="0 0 600 40" className="mt-10 h-10 w-full max-w-xl">
        <path d="M10 20H330" stroke="var(--ink)" strokeWidth="7" />
        <path d="M330 20H590" stroke="var(--ink)" strokeWidth="7" strokeDasharray="6 10" />
        <circle cx="330" cy="20" r="11" fill="var(--accent)" stroke="var(--ink)" strokeWidth="4" />
        <circle cx="10" cy="20" r="8" fill="var(--canvas)" stroke="var(--ink)" strokeWidth="4" />
      </svg>
      <p className="mt-8 max-w-[50ch] text-lg text-muted">The page may have moved, or the line ends here. Try search, or head back to the network.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-accent">
          Back to the map
        </Link>
        <Link href="/roles" className="btn btn-line">
          All roles
        </Link>
      </div>
    </div>
    </SiteLayout>
  );
}

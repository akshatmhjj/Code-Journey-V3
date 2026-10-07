import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin · Code Journey" },
  robots: { index: false, follow: false, nocache: true },
};

/** The admin area has none of the public site's chrome: no header, footer, dock or CJ AI. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-canvas text-ink">{children}</div>;
}

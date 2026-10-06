import type { Metadata } from "next";
import { getNetwork } from "@/lib/content";
import { NetworkList } from "@/components/map/NetworkList";
import { PageHead } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Fields of Tech: The Code Journey Network",
  description: "Web, mobile, data, AI, cloud, quality, security and more — every field of tech as a line on one map.",
  alternates: { canonical: "/domains" },
};

export default function Domains() {
  const net = getNetwork();
  return (
    <>
      <PageHead eyebrow="Lines" title="Every field of tech." lede="Pick a line to see its roles and skills." />
      <div className="wrap">
        <NetworkList domains={net.domains} roles={net.roles} />
      </div>
    </>
  );
}

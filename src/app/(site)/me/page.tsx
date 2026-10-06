import type { Metadata } from "next";
import { MeView } from "./MeView";

export const metadata: Metadata = { title: "My Path", robots: { index: false } };

export default function Me() {
  return <MeView />;
}

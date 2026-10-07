import { appIcon } from "@/lib/app-icon";

// PNG app icons for the web app manifest. Built once at deploy time, not on each request.
const ICONS = {
  "icon-192.png": { size: 192, maskable: false },
  "icon-512.png": { size: 512, maskable: false },
  "maskable-192.png": { size: 192, maskable: true },
  "maskable-512.png": { size: 512, maskable: true },
} as const;

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(ICONS).map((name) => ({ name }));
}

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const icon = ICONS[(await params).name as keyof typeof ICONS];
  return appIcon(icon.size, { maskable: icon.maskable });
}

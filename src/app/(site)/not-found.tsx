import { NotFoundBody } from "@/components/shell/NotFoundBody";

// A page inside the site calls notFound(): the site layout already draws the header, so only the body is needed here.
export default function SiteNotFound() {
  return <NotFoundBody />;
}

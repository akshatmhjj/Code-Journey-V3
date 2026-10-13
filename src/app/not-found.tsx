import SiteLayout from "./(site)/layout";
import { NotFoundBody } from "@/components/shell/NotFoundBody";

// Unknown addresses fall through to here, outside the site layout, so this one adds the site chrome.
export default function NotFound() {
  return (
    <SiteLayout>
      <NotFoundBody />
    </SiteLayout>
  );
}

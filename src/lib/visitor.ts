// A stable key for one visitor who is not signed in. Salted, and truncated, so the stored value
// cannot be turned back into an address by trying a list of addresses.
// No server-only imports, so the tests can use it.
import { createHash } from "node:crypto";

export function visitorKey(headers: Headers, salt: string) {
  const ip = (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

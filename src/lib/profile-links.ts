// Optional GitHub, LinkedIn and LeetCode links on a public path page. Browser-safe, so the editor and the page share one set of rules.
// The database enforces the same patterns (profiles_*_url_format constraints).

export const GITHUB_URL = /^https:\/\/github\.com\/[A-Za-z0-9][A-Za-z0-9-]{0,38}\/?$/;
export const LINKEDIN_URL = /^https:\/\/(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_%-]{3,100}\/?$/;
export const LEETCODE_URL = /^https:\/\/leetcode\.com\/(u\/)?[A-Za-z0-9_-]{1,40}\/?$/;

/** Trims the value and adds https:// when the person typed only "github.com/name". */
export function normalizeLink(value: string) {
  const v = value.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/** The link when it matches the pattern, otherwise null. Checked again before anything is rendered as an href. */
export function safeLink(url: string | null | undefined, pattern: RegExp) {
  return url && pattern.test(url) ? url : null;
}

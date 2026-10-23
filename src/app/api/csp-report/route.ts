// Receives Content-Security-Policy violation reports from browsers. Reports are logged, not stored.
// Browsers send these as POST with a JSON body; the body is capped so a bad client can't flood the logs.
const MAX_REPORT_CHARS = 2000;

export async function POST(req: Request) {
  const text = (await req.text()).slice(0, MAX_REPORT_CHARS);
  console.warn("CSP violation (report-only)", text);
  return new Response(null, { status: 204 });
}

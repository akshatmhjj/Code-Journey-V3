// Sends a short alert to a team chat when something breaks. Set ALERT_WEBHOOK_URL to turn it on
// (a Slack or Discord incoming webhook works). Without it, alerts only go to the server logs.
// Never throws: a failed alert must not make the original failure worse.
export async function alert(title: string, detail: string) {
  console.error(`ALERT: ${title}`, detail);
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  const text = `${title}\n${detail}`.slice(0, 1500);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Slack reads "text", Discord reads "content". Sending both lets either one work.
      body: JSON.stringify({ text, content: text }),
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {
    console.error("ALERT: webhook failed", e);
  }
}

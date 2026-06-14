import type { ReputationAlert } from "./types";

export async function sendSlackAlerts(
  webhookUrl: string,
  alerts: ReputationAlert[]
): Promise<number> {
  if (!webhookUrl || alerts.length === 0) return 0;

  let sent = 0;

  for (const alert of alerts) {
    const payload = {
      text: `⚠️ *Reputation Early Warning* — ${alert.entityLabel}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "⚠️ Reputation Early Warning",
          },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Entity:*\n${alert.entityLabel}` },
            {
              type: "mrkdwn",
              text: `*Sentiment drop:*\n${alert.driftPercent}%`,
            },
            {
              type: "mrkdwn",
              text: `*Current:*\n${alert.currentSentiment}/100`,
            },
            {
              type: "mrkdwn",
              text: `*Baseline:*\n${alert.baselineSentiment}/100`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: alert.message,
          },
        },
      ],
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10_000),
      });
      if (response.ok) sent += 1;
    } catch {
      // skip failed delivery
    }
  }

  return sent;
}

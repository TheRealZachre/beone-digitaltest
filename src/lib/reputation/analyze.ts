import { getMonitoredEntities, getReputationConfig } from "./config";
import { fetchMentionsForEntity } from "./fetch-mentions";
import { sendSlackAlerts } from "./slack";
import type {
  EntitySentimentReport,
  MonitoredEntity,
  ReputationAlert,
  ReputationScanRequest,
  ReputationScanResponse,
} from "./types";

function averageSentiment(mentions: { sentimentScore: number }[]): number {
  if (mentions.length === 0) return 0;
  return Math.round(
    mentions.reduce((sum, item) => sum + item.sentimentScore, 0) /
      mentions.length
  );
}

function buildEntityReport(
  entity: MonitoredEntity,
  mentions: Awaited<ReturnType<typeof fetchMentionsForEntity>>,
  threshold: number
): EntitySentimentReport {
  const currentSentiment =
    mentions.length > 0 ? averageSentiment(mentions) : entity.baselineSentiment;

  const driftPercent = Math.round(
    currentSentiment - entity.baselineSentiment
  );

  let status: EntitySentimentReport["status"] = "healthy";
  if (driftPercent <= -threshold) status = "alert";
  else if (driftPercent <= -Math.floor(threshold / 2)) status = "watch";

  const trend: EntitySentimentReport["trend"] =
    driftPercent >= 3 ? "improving" : driftPercent <= -3 ? "declining" : "stable";

  return {
    entity,
    currentSentiment,
    baselineSentiment: entity.baselineSentiment,
    driftPercent,
    mentionCount: mentions.length,
    newsCount: mentions.filter((m) => m.source === "news").length,
    socialCount: mentions.filter((m) => m.source === "social").length,
    trend,
    status,
    topMentions: mentions.slice(0, 5),
  };
}

function buildAlerts(
  reports: EntitySentimentReport[],
  threshold: number
): ReputationAlert[] {
  return reports
    .filter((report) => report.driftPercent <= -threshold)
    .map((report) => ({
      id: `alert-${report.entity.id}-${Date.now()}`,
      entityId: report.entity.id,
      entityLabel: report.entity.label,
      severity:
        report.driftPercent <= -(threshold + 5) ? "critical" : "warning",
      driftPercent: report.driftPercent,
      currentSentiment: report.currentSentiment,
      baselineSentiment: report.baselineSentiment,
      message: `${report.entity.label} sentiment dropped ${Math.abs(report.driftPercent)}% (${report.currentSentiment} vs ${report.baselineSentiment} baseline). Review ${report.mentionCount} recent mentions across news and social.`,
      triggeredAt: new Date().toISOString(),
    }));
}

function buildSummary(
  reports: EntitySentimentReport[],
  alerts: ReputationAlert[]
): string {
  if (alerts.length === 0) {
    const watch = reports.filter((r) => r.status === "watch").length;
    return watch > 0
      ? `No threshold breaches. ${watch} entit${watch === 1 ? "y" : "ies"} on watch for early drift.`
      : "All monitored entities are within normal sentiment range.";
  }

  const names = alerts.map((a) => a.entityLabel).join(", ");
  return `${alerts.length} alert${alerts.length === 1 ? "" : "s"} triggered: ${names}. Sentiment dropped 10% or more vs baseline.`;
}

export async function scanReputation(
  request: ReputationScanRequest = {}
): Promise<ReputationScanResponse> {
  const started = Date.now();
  const config = getReputationConfig();
  const entities = getMonitoredEntities();
  const threshold = config.driftThresholdPercent;

  const mentionBatches = await Promise.all(
    entities.map(async (entity) => ({
      entity,
      mentions: await fetchMentionsForEntity(entity),
    }))
  );

  const entityReports = mentionBatches.map(({ entity, mentions }) =>
    buildEntityReport(entity, mentions, threshold)
  );

  const alerts = buildAlerts(entityReports, threshold);

  let slackAlertsSent = 0;
  if (request.sendSlack && config.slackWebhookUrl) {
    slackAlertsSent = await sendSlackAlerts(config.slackWebhookUrl, alerts);
    alerts.forEach((alert, index) => {
      if (index < slackAlertsSent) alert.slackDelivered = true;
    });
  }

  return {
    scannedAt: new Date().toISOString(),
    responseTimeMs: Date.now() - started,
    thresholdPercent: threshold,
    entities: entityReports,
    alerts,
    slackConfigured: Boolean(config.slackWebhookUrl),
    slackAlertsSent,
    summary: buildSummary(entityReports, alerts),
  };
}

export type EntityType = "company" | "product" | "executive";

export type SentimentLabel = "positive" | "neutral" | "negative";

export type AlertSeverity = "critical" | "warning" | "info";

export interface MonitoredEntity {
  id: string;
  label: string;
  type: EntityType;
  searchTerms: string[];
  baselineSentiment: number;
}

export interface MentionSample {
  id: string;
  source: "news" | "social";
  platform?: string;
  title: string;
  url: string;
  publishedAt: string;
  sentimentScore: number;
  sentimentLabel: SentimentLabel;
  excerpt: string;
}

export interface EntitySentimentReport {
  entity: MonitoredEntity;
  currentSentiment: number;
  baselineSentiment: number;
  driftPercent: number;
  mentionCount: number;
  newsCount: number;
  socialCount: number;
  trend: "improving" | "stable" | "declining";
  status: "healthy" | "watch" | "alert";
  topMentions: MentionSample[];
}

export interface ReputationAlert {
  id: string;
  entityId: string;
  entityLabel: string;
  severity: AlertSeverity;
  driftPercent: number;
  currentSentiment: number;
  baselineSentiment: number;
  message: string;
  triggeredAt: string;
  slackDelivered?: boolean;
}

export interface ReputationScanResponse {
  scannedAt: string;
  responseTimeMs: number;
  thresholdPercent: number;
  entities: EntitySentimentReport[];
  alerts: ReputationAlert[];
  slackConfigured: boolean;
  slackAlertsSent: number;
  summary: string;
}

export interface ReputationScanRequest {
  sendSlack?: boolean;
}

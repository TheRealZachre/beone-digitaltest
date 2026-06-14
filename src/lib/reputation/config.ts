import { DEFAULT_EXECUTIVES } from "@/lib/csuite/executives";
import type { MonitoredEntity } from "./types";

export function getReputationConfig() {
  return {
    productName: "Reputation Early Warning",
    companyName: process.env.REPUTATION_COMPANY_NAME ?? "BeOne Medicines",
    driftThresholdPercent: Number(
      process.env.REPUTATION_DRIFT_THRESHOLD ?? "10"
    ),
    slackWebhookUrl: process.env.SLACK_WEBHOOK_URL ?? "",
    userAgent:
      process.env.REPUTATION_USER_AGENT ??
      "SocialInsightsDashboard/1.0 (reputation-monitor)",
    maxMentionsPerEntity: Number(
      process.env.REPUTATION_MAX_MENTIONS ?? "20"
    ),
  };
}

const PRODUCT_ENTITIES: MonitoredEntity[] = [
  {
    id: "sonrotoclax",
    label: "sonrotoclax (BEQALZI™)",
    type: "product",
    searchTerms: ["sonrotoclax", "BEQALZI", "BCL2 inhibitor"],
    baselineSentiment: 74,
  },
  {
    id: "tislelizumab",
    label: "tislelizumab",
    type: "product",
    searchTerms: ["tislelizumab", "PD-1 inhibitor BeOne"],
    baselineSentiment: 71,
  },
  {
    id: "zanubrutinib",
    label: "zanubrutinib (BRUKINSA®)",
    type: "product",
    searchTerms: ["zanubrutinib", "BRUKINSA"],
    baselineSentiment: 76,
  },
];

export function getMonitoredEntities(): MonitoredEntity[] {
  const config = getReputationConfig();

  const company: MonitoredEntity = {
    id: "company",
    label: config.companyName,
    type: "company",
    searchTerms: [config.companyName, "BeOne Medicines", "BeiGene"],
    baselineSentiment: 72,
  };

  const executives: MonitoredEntity[] = DEFAULT_EXECUTIVES.map(
    (executive) => ({
      id: `exec-${executive.id}`,
      label: executive.name,
      type: "executive" as const,
      searchTerms: [executive.name.split(",")[0].trim()],
      baselineSentiment: 68 + (executive.id === "oyler" ? 8 : 4),
    })
  );

  return [company, ...PRODUCT_ENTITIES, ...executives];
}

export const REPUTATION_PRODUCT_NAME = "Reputation Early Warning";
export const REPUTATION_TAGLINE =
  "Sentiment drift detection with Slack alerts when reputation drops 10% or more";

export const REPUTATION_OVERVIEW =
  "Continuous sentiment monitoring on your company name, product names, and named executives. The system compares current mention sentiment against a rolling baseline — and fires a Slack alert when any entity drops 10% or more.";

export const REPUTATION_CAPABILITIES = [
  {
    title: "Multi-entity monitoring",
    description:
      "Company brand, pipeline products (sonrotoclax, tislelizumab, zanubrutinib), and all configured C-suite executives.",
  },
  {
    title: "News + social corpus",
    description:
      "Pulls sentiment signals from Google/Bing news RSS and synced social channel posts mentioning each entity.",
  },
  {
    title: "Drift detection",
    description:
      "Compares current-window sentiment to baseline. Flags watch status at −5% and alert at −10% or worse.",
  },
  {
    title: "Slack early warning",
    description:
      "Posts structured alerts to your Slack channel when threshold is breached (set SLACK_WEBHOOK_URL in .env.local).",
  },
] as const;

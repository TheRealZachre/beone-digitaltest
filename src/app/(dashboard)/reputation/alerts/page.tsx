import { SlackAlertsPanel } from "@/components/reputation/SlackAlertsPanel";
import { ReputationPageShell } from "@/components/reputation/ReputationPageShell";
import { getReputationConfig } from "@/lib/reputation/config";
import {
  REPUTATION_PRODUCT_NAME,
  REPUTATION_TAGLINE,
} from "@/lib/reputation/content";

export default function ReputationAlertsPage() {
  const config = getReputationConfig();

  return (
    <ReputationPageShell
      title={REPUTATION_PRODUCT_NAME}
      subtitle={REPUTATION_TAGLINE}
    >
      <SlackAlertsPanel slackConfigured={Boolean(config.slackWebhookUrl)} />
    </ReputationPageShell>
  );
}

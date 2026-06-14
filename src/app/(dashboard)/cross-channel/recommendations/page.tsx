import { OrchestrationPanel } from "@/components/cross-channel/OrchestrationPanel";
import { CrossChannelPageShell } from "@/components/cross-channel/CrossChannelPageShell";
import {
  CROSS_CHANNEL_PRODUCT_NAME,
  CROSS_CHANNEL_TAGLINE,
} from "@/lib/cross-channel/content";

export default function CrossChannelRecommendationsPage() {
  return (
    <CrossChannelPageShell
      title={CROSS_CHANNEL_PRODUCT_NAME}
      subtitle={CROSS_CHANNEL_TAGLINE}
    >
      <OrchestrationPanel />
    </CrossChannelPageShell>
  );
}

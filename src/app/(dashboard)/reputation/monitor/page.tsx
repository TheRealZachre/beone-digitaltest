import { ReputationMonitor } from "@/components/reputation/ReputationMonitor";
import { ReputationPageShell } from "@/components/reputation/ReputationPageShell";
import {
  REPUTATION_PRODUCT_NAME,
  REPUTATION_TAGLINE,
} from "@/lib/reputation/content";

export default function ReputationMonitorPage() {
  return (
    <ReputationPageShell
      title={REPUTATION_PRODUCT_NAME}
      subtitle={REPUTATION_TAGLINE}
    >
      <ReputationMonitor />
    </ReputationPageShell>
  );
}

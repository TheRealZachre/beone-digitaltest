import { DraftPredictPanel } from "@/components/predictive/DraftPredictPanel";
import { PredictivePageShell } from "@/components/predictive/PredictivePageShell";
import {
  PREDICTIVE_PRODUCT_NAME,
  PREDICTIVE_TAGLINE,
} from "@/lib/predictive/content";

export default function PredictiveDraftPage() {
  return (
    <PredictivePageShell
      title={PREDICTIVE_PRODUCT_NAME}
      subtitle={PREDICTIVE_TAGLINE}
    >
      <DraftPredictPanel />
    </PredictivePageShell>
  );
}

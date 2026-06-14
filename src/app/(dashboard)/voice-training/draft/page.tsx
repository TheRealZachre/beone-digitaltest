import { DraftVoicePanel } from "@/components/voice-training/DraftVoicePanel";
import { VoiceTrainingPageShell } from "@/components/voice-training/VoiceTrainingPageShell";
import { VOICE_TRAINING_PRODUCT_NAME } from "@/lib/voice-training/content";

export default function VoiceTrainingDraftPage() {
  return (
    <VoiceTrainingPageShell
      title="Draft in Voice"
      subtitle={`${VOICE_TRAINING_PRODUCT_NAME} · Content that sounds like the executive`}
    >
      <DraftVoicePanel />
    </VoiceTrainingPageShell>
  );
}

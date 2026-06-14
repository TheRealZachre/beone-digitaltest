import { TrainVoicePanel } from "@/components/voice-training/TrainVoicePanel";
import { VoiceTrainingPageShell } from "@/components/voice-training/VoiceTrainingPageShell";
import { VOICE_TRAINING_PRODUCT_NAME } from "@/lib/voice-training/content";

export default function VoiceTrainingTrainPage() {
  return (
    <VoiceTrainingPageShell
      title="Train Profile"
      subtitle={`${VOICE_TRAINING_PRODUCT_NAME} · Learn voice from past posts`}
    >
      <TrainVoicePanel />
    </VoiceTrainingPageShell>
  );
}

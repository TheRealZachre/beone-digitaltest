import { VoiceCalibrationPanel } from "@/components/csuite/VoiceCalibrationPanel";
import { CsuitePageShell } from "@/components/csuite/CsuitePageShell";
import { CSUITE_PRODUCT_NAME } from "@/lib/csuite/content";

export default function CsuiteVoicePage() {
  return (
    <CsuitePageShell
      title="Voice Calibration"
      subtitle={`${CSUITE_PRODUCT_NAME} · Executive tone & audience settings`}
    >
      <VoiceCalibrationPanel />
    </CsuitePageShell>
  );
}

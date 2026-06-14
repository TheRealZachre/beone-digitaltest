import { ProductionStudio } from "@/components/video-production/ProductionStudio";
import { VideoProductionPageShell } from "@/components/video-production/VideoProductionPageShell";
import { VIDEO_PRODUCTION_PRODUCT_NAME } from "@/lib/video-production/content";

export default function VideoProductionStudioPage() {
  return (
    <VideoProductionPageShell
      title="Production Studio"
      subtitle={`${VIDEO_PRODUCTION_PRODUCT_NAME} · Script to publish workflow`}
    >
      <ProductionStudio />
    </VideoProductionPageShell>
  );
}

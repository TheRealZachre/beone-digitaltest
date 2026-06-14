import { CapabilitiesGrid } from "@/components/video-production/CapabilitiesGrid";
import { DistributionStrategyTable } from "@/components/video-production/DistributionStrategyTable";
import { WorkflowStepsGrid } from "@/components/video-production/WorkflowStepsGrid";
import {
  SubPageLink,
  VideoProductionHero,
  VideoProductionPageShell,
} from "@/components/video-production/VideoProductionPageShell";
import {
  VIDEO_PRODUCTION_OVERVIEW,
  VIDEO_PRODUCTION_PRODUCT_NAME,
  VIDEO_PRODUCTION_TAGLINE,
} from "@/lib/video-production/content";

export default function VideoProductionOverviewPage() {
  return (
    <VideoProductionPageShell
      title={VIDEO_PRODUCTION_PRODUCT_NAME}
      subtitle={VIDEO_PRODUCTION_TAGLINE}
    >
      <VideoProductionHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {VIDEO_PRODUCTION_OVERVIEW}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          End-to-end production workflow
        </h2>
        <WorkflowStepsGrid />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Platform distribution strategy
        </h2>
        <DistributionStrategyTable />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Key capabilities
        </h2>
        <CapabilitiesGrid />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <SubPageLink
          href="/video-production/studio"
          title="Production Studio"
          description="Enter a topic and key messages to generate script, AI presenter plan, production checklist, and distribution calendar."
        />
        <SubPageLink
          href="/video-production/distribution"
          title="Distribution Strategy"
          description="Hub-and-spoke model with YouTube as primary hub and platform-native clips driving traffic back."
        />
      </section>
    </VideoProductionPageShell>
  );
}

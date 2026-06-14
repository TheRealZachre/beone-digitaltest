import { DistributionStrategyTable } from "@/components/video-production/DistributionStrategyTable";
import { VideoProductionPageShell } from "@/components/video-production/VideoProductionPageShell";
import { DISTRIBUTION_STRATEGY } from "@/lib/video-production/content";

export default function VideoProductionDistributionPage() {
  return (
    <VideoProductionPageShell
      title="Distribution Strategy"
      subtitle={`${DISTRIBUTION_STRATEGY.model} · YouTube hub with social spokes`}
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Hub-and-spoke distribution
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          The full-length video lives on YouTube as the SEO-optimized primary
          asset. Each social platform receives a native-format clip engineered
          to drive viewers back to the hub — via link in bio, reply threads,
          end cards, and UTM-tracked captions.
        </p>
      </section>

      <DistributionStrategyTable />
    </VideoProductionPageShell>
  );
}

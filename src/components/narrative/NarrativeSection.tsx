import { BeatPerformanceGrid } from "./BeatPerformanceGrid";
import { NarrativeArcPlot } from "./NarrativeArcPlot";
import { computeBeatStats } from "@/lib/narrative/aggregate";
import { toNarrativePosts } from "@/lib/narrative/scoring";
import type { SocialPost } from "@/lib/types";

interface NarrativeSectionProps {
  posts: SocialPost[];
  maxDays: number;
  arcTitle: string;
  subtitle?: string;
}

export function NarrativeSection({
  posts,
  maxDays,
  arcTitle,
  subtitle,
}: NarrativeSectionProps) {
  const narrativePosts = toNarrativePosts(posts);
  const beatStats = computeBeatStats(narrativePosts);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{arcTitle}</h2>
        {subtitle && (
          <p className="mt-1 max-w-3xl text-sm text-slate-500">{subtitle}</p>
        )}
      </div>

      <NarrativeArcPlot posts={narrativePosts} maxDays={maxDays} />

      <div>
        <h3 className="mb-4 text-base font-semibold text-slate-900">
          Story beat performance
        </h3>
        <BeatPerformanceGrid stats={beatStats} />
      </div>
    </section>
  );
}

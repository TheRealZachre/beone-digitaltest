import { getMultiChannelPosts } from "@/lib/data";
import { inferStoryBeat } from "@/lib/narrative/beats";
import { inferCategory } from "@/lib/social/normalize";
import type { Platform } from "@/lib/types";
import { buildPerformanceBaseline } from "./baseline";
import { getPredictiveConfig } from "./config";
import { analyzeContentSignals, predictMetrics } from "./score";
import { buildOptimizedVariants } from "./variants";
import type { PredictRequest, PredictResponse } from "./types";

function buildSummary(
  liftTop: number,
  platform: Platform,
  variantLabel: string
): string {
  if (liftTop <= 0) {
    return `Your draft is already well-structured for ${platform}. Variants offer marginal refinements — review before swapping.`;
  }

  return `Top variant (${variantLabel}) projects +${liftTop}% engagement lift vs your draft on ${platform}. Publish the leader or blend its optimizations.`;
}

export async function predictPostPerformance(
  request: PredictRequest
): Promise<PredictResponse> {
  const started = Date.now();
  const config = getPredictiveConfig();
  const caption = request.caption.trim();

  if (!caption) {
    throw new Error("Caption is required");
  }

  const platform: Platform = request.platform ?? config.defaultPlatform;
  const storyBeat = inferStoryBeat(caption);
  const category = inferCategory(caption);

  const { posts } = await getMultiChannelPosts();
  const performanceBaseline = buildPerformanceBaseline(
    posts,
    platform,
    storyBeat,
    category,
    config.lookbackDays
  );

  const draftSignals = analyzeContentSignals(caption, platform);
  const baseline = predictMetrics(performanceBaseline, draftSignals);

  const variants = buildOptimizedVariants(
    caption,
    platform,
    baseline,
    performanceBaseline
  );

  const topLift = variants[0]?.liftPercent ?? 0;

  return {
    analyzedAt: new Date().toISOString(),
    responseTimeMs: Date.now() - started,
    platform,
    storyBeat,
    category,
    baseline,
    variants,
    baselineSource: performanceBaseline.source,
    summary: buildSummary(topLift, platform, variants[0]?.label ?? "Variant"),
  };
}

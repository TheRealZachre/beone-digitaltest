import { subDays } from "date-fns";
import { getMultiChannelPosts } from "@/lib/data";
import { getCrossChannelConfig } from "./config";
import { detectLinkedInHits } from "./detect-hits";
import { buildOrchestrationPlan } from "./recommend";
import type {
  CrossChannelAnalyzeRequest,
  CrossChannelAnalyzeResponse,
} from "./types";

function buildSummary(hitCount: number, planCount: number): string {
  if (hitCount === 0) {
    return "No LinkedIn posts crossed the hit threshold in this window. Check back after your next strong organic post.";
  }

  return `${hitCount} LinkedIn hit${hitCount === 1 ? "" : "s"} detected with ${planCount * 3} cross-channel amplification recommendation${planCount === 1 ? "" : "s"} across Instagram, X, and YouTube.`;
}

export async function analyzeCrossChannel(
  request: CrossChannelAnalyzeRequest = {}
): Promise<CrossChannelAnalyzeResponse> {
  const started = Date.now();
  const config = getCrossChannelConfig();
  const lookbackDays = request.lookbackDays ?? config.lookbackDays;
  const maxHits = request.maxHits ?? config.maxHits;

  const { posts: allPosts } = await getMultiChannelPosts();
  const cutoff = subDays(new Date(), lookbackDays);
  const recentPosts = allPosts.filter(
    (post) => new Date(post.publishedAt) >= cutoff
  );

  const hits = detectLinkedInHits(
    recentPosts,
    config.hitThresholdPercent,
    maxHits
  );

  const plans = hits.map((hit) =>
    buildOrchestrationPlan(
      hit,
      recentPosts,
      config.targetPlatforms,
      config.matchWindowDays
    )
  );

  return {
    analyzedAt: new Date().toISOString(),
    responseTimeMs: Date.now() - started,
    lookbackDays,
    hitThresholdPercent: config.hitThresholdPercent,
    totalPostsScanned: recentPosts.length,
    linkedInHits: hits.length,
    plans,
    summary: buildSummary(hits.length, plans.length),
  };
}

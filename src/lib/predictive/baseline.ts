import { subDays } from "date-fns";
import { engagementRate } from "@/lib/metrics";
import type { ContentCategory, Platform, SocialPost, StoryBeat } from "@/lib/types";
import type { PredictionConfidence } from "./types";

export interface PerformanceBaseline {
  avgImpressions: number;
  avgReach: number;
  avgEngagements: number;
  avgEngagementRate: number;
  sampleSize: number;
  source: string;
  confidence: PredictionConfidence;
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function engagementsFromMetrics(post: SocialPost): number {
  const { likes, comments, shares, saves } = post.metrics;
  return likes + comments + shares + saves;
}

function confidenceFromSample(size: number): PredictionConfidence {
  if (size >= 8) return "high";
  if (size >= 3) return "medium";
  return "low";
}

export function buildPerformanceBaseline(
  posts: SocialPost[],
  platform: Platform,
  storyBeat: StoryBeat,
  category: ContentCategory,
  lookbackDays: number
): PerformanceBaseline {
  const cutoff = subDays(new Date(), lookbackDays);
  const platformPosts = posts.filter(
    (post) =>
      post.platform === platform &&
      post.type === "organic" &&
      new Date(post.publishedAt) >= cutoff
  );

  const beatPosts = platformPosts.filter((post) => post.storyBeat === storyBeat);
  const categoryPosts = platformPosts.filter(
    (post) => post.category === category
  );

  let sample = beatPosts.length >= 3 ? beatPosts : categoryPosts;
  let source = `${sample.length} ${platform} posts (${storyBeat})`;

  if (sample.length < 3) {
    sample = platformPosts;
    source = `${sample.length} ${platform} posts (platform average)`;
  }

  if (sample.length === 0) {
    return {
      avgImpressions: 4200,
      avgReach: 3100,
      avgEngagements: 180,
      avgEngagementRate: 4.2,
      sampleSize: 0,
      source: "Industry benchmark (no historical posts)",
      confidence: "low",
    };
  }

  return {
    avgImpressions: Math.round(avg(sample.map((p) => p.metrics.impressions))),
    avgReach: Math.round(avg(sample.map((p) => p.metrics.reach))),
    avgEngagements: Math.round(avg(sample.map(engagementsFromMetrics))),
    avgEngagementRate:
      Math.round(avg(sample.map((p) => engagementRate(p.metrics))) * 10) / 10,
    sampleSize: sample.length,
    source,
    confidence: confidenceFromSample(sample.length),
  };
}

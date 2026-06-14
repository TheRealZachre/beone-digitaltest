import type { ContentCategory, Platform, StoryBeat } from "@/lib/types";

export type PredictionConfidence = "high" | "medium" | "low";

export interface PredictedMetrics {
  impressions: number;
  reach: number;
  engagements: number;
  engagementRate: number;
  confidence: PredictionConfidence;
}

export interface PostVariant {
  id: string;
  label: string;
  strategy: string;
  caption: string;
  predicted: PredictedMetrics;
  liftPercent: number;
  optimizations: string[];
}

export interface PredictRequest {
  caption: string;
  platform?: Platform;
}

export interface PredictResponse {
  analyzedAt: string;
  responseTimeMs: number;
  platform: Platform;
  storyBeat: StoryBeat;
  category: ContentCategory;
  baseline: PredictedMetrics;
  variants: PostVariant[];
  baselineSource: string;
  summary: string;
}

export interface ContentSignals {
  lengthScore: number;
  hookScore: number;
  hashtagScore: number;
  dataScore: number;
  questionScore: number;
  ctaScore: number;
  structureScore: number;
  compositeMultiplier: number;
}

import type { Platform, SocialPost } from "@/lib/types";

export type TargetPlatform = Extract<Platform, "instagram" | "x" | "youtube">;

export type MatchConfidence = "exact" | "theme" | "beat" | "none";

export type AmplificationAction =
  | "boost"
  | "repost"
  | "create"
  | "cross-promote";

export interface LinkedInHit {
  post: SocialPost;
  engagementRate: number;
  hitReason: string;
}

export interface PlatformRecommendation {
  targetPlatform: TargetPlatform;
  action: AmplificationAction;
  matchedPost?: SocialPost;
  matchConfidence: MatchConfidence;
  priority: number;
  rationale: string;
  suggestedCaption?: string;
  formatHint?: string;
  recommendedBudget?: number;
}

export interface OrchestrationPlan {
  linkedInHit: LinkedInHit;
  recommendations: PlatformRecommendation[];
}

export interface CrossChannelAnalyzeRequest {
  lookbackDays?: number;
  maxHits?: number;
}

export interface CrossChannelAnalyzeResponse {
  analyzedAt: string;
  responseTimeMs: number;
  lookbackDays: number;
  hitThresholdPercent: number;
  totalPostsScanned: number;
  linkedInHits: number;
  plans: OrchestrationPlan[];
  summary: string;
}

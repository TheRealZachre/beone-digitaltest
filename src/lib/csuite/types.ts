import type { StoryBeat } from "@/lib/types";

export type WritingStyle =
  | "authoritative"
  | "conversational"
  | "visionary"
  | "data-driven";

export type TargetAudience =
  | "peers"
  | "prospects"
  | "policymakers"
  | "press"
  | "employees"
  | "investors";

export interface ExecutiveProfile {
  id: string;
  name: string;
  title: string;
  avatarInitials: string;
  writingStyles: WritingStyle[];
  passionTopics: string[];
  usePhrases: string[];
  avoidPhrases: string[];
  targetAudiences: TargetAudience[];
  bio: string;
}

export interface CorporateTheme {
  id: string;
  title: string;
  narrative: string;
  storyBeat: StoryBeat;
  sourcePostIds: string[];
  engagementScore: number;
  suggestedAngles: string[];
}

export interface VisualSuggestion {
  type: "chart" | "quote-card" | "photo" | "infographic";
  description: string;
}

export interface PlatformContent {
  platform: "linkedin-post" | "linkedin-article" | "x-post";
  label: string;
  content: string;
  charCount: number;
  structure: string[];
}

export interface GeneratedExecutiveContent {
  executiveId: string;
  executiveName: string;
  theme: CorporateTheme;
  generatedAt: string;
  linkedinPost: PlatformContent;
  linkedinArticle: PlatformContent;
  xPost: PlatformContent;
  platformVariations: { platform: string; note: string }[];
  visualSuggestions: VisualSuggestion[];
  sourceSummary: string;
}

export interface ExecutivePublishedPost {
  id: string;
  executiveId: string;
  executiveName: string;
  platform: "linkedin" | "x";
  contentType: "post" | "article";
  publishedAt: string;
  storyBeat: StoryBeat;
  content: string;
  metrics: {
    impressions: number;
    engagementRate: number;
    followerGrowth: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface MonthlyExecutiveReport {
  timeframe: "monthly";
  periodLabel: string;
  executives: {
    id: string;
    name: string;
    postsPublished: number;
    totalImpressions: number;
    avgEngagementRate: number;
    followerGrowth: number;
  }[];
  posts: ExecutivePublishedPost[];
  topPerformers: ExecutivePublishedPost[];
}

export interface QuarterlyExecutiveReport {
  timeframe: "quarterly";
  periodLabel: string;
  reachGrowthPercent: number;
  engagementVsPeers: number;
  categoryPerformance: {
    storyBeat: StoryBeat;
    postCount: number;
    avgEngagementRate: number;
  }[];
  monthOverMonth: { month: string; impressions: number; engagementRate: number }[];
  peerBenchmark: { label: string; value: number; industryAvg: number }[];
}

export type CsuiteReport = MonthlyExecutiveReport | QuarterlyExecutiveReport;

export interface GenerateContentRequest {
  executiveId: string;
  themeId?: string;
  voiceOverrides?: Partial<
    Pick<
      ExecutiveProfile,
      | "writingStyles"
      | "passionTopics"
      | "usePhrases"
      | "avoidPhrases"
      | "targetAudiences"
    >
  >;
}

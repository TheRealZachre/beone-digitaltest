export type SocialPlatform =
  | "linkedin"
  | "instagram"
  | "facebook"
  | "x"
  | "youtube"
  | "reddit";

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  snippet: string;
  provider: "google-news" | "bing-news" | "newsapi";
}

export interface SubjectSocialPost {
  id: string;
  platform: SocialPlatform;
  author: string;
  authorHandle?: string;
  url: string;
  text: string;
  publishedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    reach?: number;
  };
  imageUrl?: string;
  provider: "apify" | "cache" | "reddit";
}

export interface MediaMonitorSearchRequest {
  subject: string;
  maxNews?: number;
  maxSocial?: number;
  includeCachedSocial?: boolean;
}

export interface MediaMonitorSearchResponse {
  subject: string;
  searchedAt: string;
  responseTimeMs: number;
  newsCount: number;
  socialCount: number;
  news: NewsArticle[];
  socialPosts: SubjectSocialPost[];
  sourcesUsed: string[];
  errors?: Partial<Record<string, string>>;
}

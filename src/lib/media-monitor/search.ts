import { getMediaMonitorConfig } from "./config";
import { fetchNewsForSubject } from "./fetch-news";
import { fetchSocialForSubject } from "./fetch-social";
import type {
  MediaMonitorSearchRequest,
  MediaMonitorSearchResponse,
} from "./types";

export async function searchMediaMonitor(
  request: MediaMonitorSearchRequest
): Promise<MediaMonitorSearchResponse> {
  const started = Date.now();
  const config = getMediaMonitorConfig();
  const subject = request.subject.trim();

  if (!subject) {
    throw new Error("Subject is required.");
  }

  const maxNews = request.maxNews ?? config.maxNews;
  const maxSocial = request.maxSocial ?? config.maxSocial;
  const includeCached = request.includeCachedSocial ?? true;

  const [newsResult, socialResult] = await Promise.all([
    fetchNewsForSubject(subject, maxNews),
    fetchSocialForSubject(subject, maxSocial, includeCached),
  ]);

  const sourcesUsed = ["Google News RSS", "Bing News RSS"];
  if (config.newsApiKey) sourcesUsed.push("NewsAPI");
  if (includeCached) sourcesUsed.push("Synced social channels");
  if (config.apifyToken) sourcesUsed.push("X search");

  const errors: Record<string, string> = {};
  if (newsResult.errors.length > 0) {
    errors.news = newsResult.errors.join("; ");
  }
  if (socialResult.errors.length > 0) {
    errors.social = socialResult.errors.join("; ");
  }

  return {
    subject,
    searchedAt: new Date().toISOString(),
    responseTimeMs: Date.now() - started,
    newsCount: newsResult.articles.length,
    socialCount: socialResult.posts.length,
    news: newsResult.articles,
    socialPosts: socialResult.posts,
    sourcesUsed,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

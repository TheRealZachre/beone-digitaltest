import { getMediaMonitorConfig } from "./config";
import { normalizeNewsTitle, parseRssFeed } from "./parse-rss";
import type { NewsArticle } from "./types";

async function fetchRss(
  url: string,
  provider: NewsArticle["provider"]
): Promise<NewsArticle[]> {
  const config = getMediaMonitorConfig();
  const response = await fetch(url, {
    headers: { "User-Agent": config.userAgent },
    signal: AbortSignal.timeout(20_000),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`${provider} RSS failed (${response.status})`);
  }

  const xml = await response.text();
  return parseRssFeed(xml).map((item, index) => ({
    id: `${provider}-${index}-${normalizeNewsTitle(item.title).slice(0, 40)}`,
    title: item.title,
    url: item.link,
    source: item.source,
    publishedAt: item.publishedAt,
    snippet: item.snippet,
    provider,
  }));
}

async function fetchNewsApi(
  subject: string,
  maxNews: number
): Promise<NewsArticle[]> {
  const config = getMediaMonitorConfig();
  if (!config.newsApiKey) return [];

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", subject);
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", String(Math.min(maxNews, 50)));
  url.searchParams.set("language", "en");

  const response = await fetch(url, {
    headers: { "X-Api-Key": config.newsApiKey },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`NewsAPI failed (${response.status})`);
  }

  const data = (await response.json()) as {
    articles?: {
      title?: string;
      url?: string;
      source?: { name?: string };
      publishedAt?: string;
      description?: string;
    }[];
  };

  return (data.articles ?? [])
    .filter((article) => article.title && article.url)
    .map((article, index) => ({
      id: `newsapi-${index}-${normalizeNewsTitle(article.title ?? "")}`,
      title: article.title ?? "",
      url: article.url ?? "",
      source: article.source?.name ?? "NewsAPI",
      publishedAt: article.publishedAt ?? new Date().toISOString(),
      snippet: article.description ?? "",
      provider: "newsapi" as const,
    }));
}

function dedupeNews(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  const result: NewsArticle[] = [];

  for (const article of articles) {
    const key = normalizeNewsTitle(article.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(article);
  }

  return result.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function fetchNewsForSubject(
  subject: string,
  maxNews: number
): Promise<{ articles: NewsArticle[]; errors: string[] }> {
  const encoded = encodeURIComponent(subject);
  const errors: string[] = [];
  const batches = await Promise.allSettled([
    fetchRss(
      `https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`,
      "google-news"
    ),
    fetchRss(
      `https://www.bing.com/news/search?q=${encoded}&format=rss`,
      "bing-news"
    ),
    fetchNewsApi(subject, maxNews),
  ]);

  const articles: NewsArticle[] = [];
  const labels = ["Google News", "Bing News", "NewsAPI"];

  batches.forEach((result, index) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      const message =
        result.reason instanceof Error
          ? result.reason.message
          : "News fetch failed";
      errors.push(`${labels[index]}: ${message}`);
    }
  });

  return {
    articles: dedupeNews(articles).slice(0, maxNews),
    errors,
  };
}

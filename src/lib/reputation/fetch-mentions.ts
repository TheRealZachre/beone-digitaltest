import { readSocialCache } from "@/lib/data/social-cache";
import { parseRssFeed } from "@/lib/media-monitor/parse-rss";
import { getReputationConfig } from "./config";
import { scoreSentiment, sentimentLabel } from "./sentiment";
import type { MentionSample, MonitoredEntity } from "./types";

async function fetchNewsMentions(
  entity: MonitoredEntity,
  max: number
): Promise<MentionSample[]> {
  const config = getReputationConfig();
  const query = encodeURIComponent(entity.searchTerms[0]);
  const urls = [
    `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`,
    `https://www.bing.com/news/search?q=${query}&format=rss`,
  ];

  const mentions: MentionSample[] = [];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": config.userAgent },
        signal: AbortSignal.timeout(15_000),
        next: { revalidate: 300 },
      });
      if (!response.ok) continue;

      const xml = await response.text();
      const items = parseRssFeed(xml).slice(0, max);

      for (const [index, item] of items.entries()) {
        const text = `${item.title} ${item.snippet}`;
        const sentimentScore = scoreSentiment(text);
        mentions.push({
          id: `news-${entity.id}-${index}-${item.link.slice(-12)}`,
          source: "news",
          title: item.title,
          url: item.link,
          publishedAt: item.publishedAt,
          sentimentScore,
          sentimentLabel: sentimentLabel(sentimentScore),
          excerpt: item.snippet.slice(0, 180),
        });
      }
    } catch {
      // skip failed feed
    }
  }

  const seen = new Set<string>();
  return mentions
    .filter((mention) => {
      const key = mention.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, max);
}

function matchesEntity(text: string, entity: MonitoredEntity): boolean {
  const lower = text.toLowerCase();
  return entity.searchTerms.some((term) =>
    lower.includes(term.toLowerCase())
  );
}

async function fetchSocialMentions(
  entity: MonitoredEntity,
  max: number
): Promise<MentionSample[]> {
  const cache = await readSocialCache();
  if (!cache?.posts?.length) return [];

  return cache.posts
    .filter((post) => matchesEntity(post.caption, entity))
    .slice(0, max)
    .map((post, index) => {
      const sentimentScore = scoreSentiment(post.caption);
      return {
        id: `social-${entity.id}-${post.id}-${index}`,
        source: "social" as const,
        platform: post.platform,
        title: post.caption.slice(0, 100),
        url: "#",
        publishedAt: post.publishedAt,
        sentimentScore,
        sentimentLabel: sentimentLabel(sentimentScore),
        excerpt: post.caption.slice(0, 180),
      };
    });
}

export async function fetchMentionsForEntity(
  entity: MonitoredEntity
): Promise<MentionSample[]> {
  const config = getReputationConfig();
  const perSource = Math.ceil(config.maxMentionsPerEntity / 2);

  const [news, social] = await Promise.all([
    fetchNewsMentions(entity, perSource),
    fetchSocialMentions(entity, perSource),
  ]);

  return [...news, ...social]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, config.maxMentionsPerEntity);
}

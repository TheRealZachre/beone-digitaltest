import { readSocialCache } from "@/lib/data/social-cache";
import { runApifyActor } from "@/lib/social/apify";
import { engagementRate } from "@/lib/metrics";
import { getSocialConfig } from "@/lib/social/config";
import type { SocialPost } from "@/lib/types";
import { getMediaMonitorConfig } from "./config";
import type { SocialPlatform, SubjectSocialPost } from "./types";

const PLATFORM_PROFILE_URL: Record<SocialPlatform, string> = {
  linkedin: "https://www.linkedin.com/company/",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  x: "https://x.com/",
  youtube: "https://www.youtube.com/",
  reddit: "https://www.reddit.com/",
};

function subjectMatches(text: string, subject: string): boolean {
  const haystack = text.toLowerCase();
  const needle = subject.toLowerCase().trim();
  if (!needle) return false;
  if (haystack.includes(needle)) return true;

  const terms = needle.split(/\s+/).filter((term) => term.length > 2);
  if (terms.length === 0) return false;
  const matched = terms.filter((term) => haystack.includes(term)).length;
  return matched >= Math.ceil(terms.length * 0.6);
}

function engagementScore(post: SocialPost): number {
  const metrics = post.metrics;
  return (
    metrics.likes +
    metrics.comments * 2 +
    metrics.shares * 3 +
    metrics.reach * 0.01 +
    engagementRate(metrics)
  );
}

function channelHandle(platform: SocialPost["platform"]): string | undefined {
  const config = getSocialConfig();
  switch (platform) {
    case "linkedin":
      return `@${config.channels.linkedin.handle}`;
    case "instagram":
      return `@${config.channels.instagram.handle}`;
    case "facebook":
      return config.channels.facebook.url;
    case "x":
      return `@${config.channels.x.handle}`;
    case "youtube":
      return config.channels.youtube.channel;
    default:
      return undefined;
  }
}

function profileUrlForPost(post: SocialPost): string {
  const config = getSocialConfig();
  switch (post.platform) {
    case "linkedin":
      return `https://www.linkedin.com/company/${config.channels.linkedin.handle}/`;
    case "instagram":
      return `${PLATFORM_PROFILE_URL.instagram}${config.channels.instagram.handle}/`;
    case "facebook":
      return config.channels.facebook.url;
    case "x":
      return `${PLATFORM_PROFILE_URL.x}${config.channels.x.handle}`;
    case "youtube":
      return `${PLATFORM_PROFILE_URL.youtube}${config.channels.youtube.channel}`;
    default:
      return PLATFORM_PROFILE_URL[post.platform as SocialPlatform] ?? "#";
  }
}

function mapCachedPost(post: SocialPost): SubjectSocialPost {
  const config = getSocialConfig();

  return {
    id: `cache-${post.id}`,
    platform: post.platform as SocialPlatform,
    author: config.companySlug,
    authorHandle: channelHandle(post.platform),
    url: profileUrlForPost(post),
    text: post.caption,
    publishedAt: post.publishedAt,
    engagement: {
      likes: post.metrics.likes,
      comments: post.metrics.comments,
      shares: post.metrics.shares,
      reach: post.metrics.reach,
    },
    imageUrl: post.imageUrl,
    provider: "cache",
  };
}

export async function searchCachedSocialPosts(
  subject: string,
  maxSocial: number
): Promise<SubjectSocialPost[]> {
  const cache = await readSocialCache();
  if (!cache?.posts?.length) return [];

  const supportedPlatforms = new Set([
    "linkedin",
    "instagram",
    "facebook",
    "x",
    "youtube",
  ]);

  return cache.posts
    .filter(
      (post) =>
        supportedPlatforms.has(post.platform) &&
        subjectMatches(post.caption, subject)
    )
    .sort((a, b) => engagementScore(b) - engagementScore(a))
    .slice(0, maxSocial)
    .map(mapCachedPost);
}

function mapApifyTweet(
  record: Record<string, unknown>,
  index: number
): SubjectSocialPost | null {
  const text = String(
    record.full_text ?? record.text ?? record.tweetText ?? record.content ?? ""
  ).trim();
  if (!text) return null;

  const url = String(
    record.url ??
      record.tweetUrl ??
      record.twitterUrl ??
      (record.id_str || record.id
        ? `https://x.com/i/web/status/${record.id_str ?? record.id}`
        : "")
  );

  const user = record.user as Record<string, unknown> | undefined;
  const author = String(
    user?.name ?? record.authorName ?? record.name ?? record.userName ?? "X user"
  );
  const handle = String(
    user?.screen_name ??
      record.authorHandle ??
      record.username ??
      record.screen_name ??
      ""
  );

  const createdAt = String(
    record.created_at ?? record.createdAt ?? record.time ?? new Date().toISOString()
  );

  return {
    id: `x-apify-${record.id_str ?? record.id ?? index}`,
    platform: "x",
    author,
    authorHandle: handle ? `@${handle.replace(/^@/, "")}` : undefined,
    url: url || "#",
    text,
    publishedAt: new Date(createdAt).toISOString(),
    engagement: {
      likes: Number(record.favorite_count ?? record.likes ?? record.likeCount ?? 0),
      comments: Number(record.reply_count ?? record.replies ?? record.replyCount ?? 0),
      shares: Number(record.retweet_count ?? record.retweets ?? record.retweetCount ?? 0),
    },
    imageUrl:
      (() => {
        const media = record.media;
        if (Array.isArray(media) && media[0] && typeof media[0] === "object") {
          const first = media[0] as Record<string, unknown>;
          const url = first.media_url_https ?? first.url;
          if (url) return String(url);
        }
        return record.image ? String(record.image) : undefined;
      })(),
    provider: "apify",
  };
}

export async function searchXPosts(
  subject: string,
  maxSocial: number
): Promise<SubjectSocialPost[]> {
  const config = getMediaMonitorConfig();
  if (!config.apifyToken) return [];

  const records = await runApifyActor<Record<string, unknown>>(
    config.xSearchActor,
    {
      searchTerms: [subject],
      maxTweets: maxSocial,
      maxItems: maxSocial,
      sort: "Latest",
    },
    config.apifyToken,
    120_000
  );

  return records
    .map((record, index) => mapApifyTweet(record, index))
    .filter((post): post is SubjectSocialPost => post !== null)
    .sort(
      (a, b) =>
        b.engagement.likes +
        b.engagement.shares -
        (a.engagement.likes + a.engagement.shares)
    )
    .slice(0, maxSocial);
}

function dedupeSocial(posts: SubjectSocialPost[]): SubjectSocialPost[] {
  const seen = new Set<string>();
  const result: SubjectSocialPost[] = [];

  for (const post of posts) {
    const key = post.text.toLowerCase().slice(0, 120);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(post);
  }

  return result.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function fetchSocialForSubject(
  subject: string,
  maxSocial: number,
  includeCached = true
): Promise<{ posts: SubjectSocialPost[]; errors: string[] }> {
  const errors: string[] = [];
  const batches = await Promise.allSettled([
    includeCached ? searchCachedSocialPosts(subject, maxSocial) : Promise.resolve([]),
    searchXPosts(subject, maxSocial),
  ]);

  const posts: SubjectSocialPost[] = [];
  const labels = ["Synced channels", "X search"];

  batches.forEach((result, index) => {
    if (result.status === "fulfilled") {
      posts.push(...result.value);
    } else {
      const message =
        result.reason instanceof Error
          ? result.reason.message
          : "Social fetch failed";
      errors.push(`${labels[index]}: ${message}`);
    }
  });

  return {
    posts: dedupeSocial(posts).slice(0, maxSocial),
    errors,
  };
}

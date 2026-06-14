import { subDays, subMonths } from "date-fns";
import { inferStoryBeat } from "@/lib/narrative/beats";
import type {
  AudienceSnapshot,
  BrandProfile,
  CompetitorBrand,
  ReportSummary,
  SocialPost,
} from "./types";
import {
  clickThroughRate,
  engagementRate,
} from "./metrics";

const now = new Date();

function daysAgo(n: number): string {
  return subDays(now, n).toISOString();
}

const captions = [
  "Meet our new spring collection — crafted for comfort, designed to stand out. Shop the drop before it's gone. 🌸",
  "3 tips to elevate your morning routine. Save this for later! ☕️",
  "Behind the scenes: how we source sustainable materials for every product we make.",
  "Customer spotlight: @sarahj shares how our gear changed her daily commute.",
  "Flash sale ends tonight! 25% off sitewide with code SPRING25.",
  "Did you know? Our packaging is 100% recyclable. Small choices, big impact. 🌍",
  "Weekend vibes with the crew. Tag someone who needs this energy.",
  "New blog post: The complete guide to building a capsule wardrobe.",
  "POV: unboxing day. Which colorway is your favorite? Comment below 👇",
  "We're hiring! Join a team that puts people and planet first.",
  "Tutorial: 5 ways to style our bestseller for any occasion.",
  "Thank you for 100K followers! Here's a thank-you gift just for you.",
  "Real reviews, real results. See why customers rate us 4.9 stars.",
  "Limited collab dropping Friday. Set your reminders now.",
  "Our CEO on building a brand that lasts — full interview on the blog.",
];

const categories = [
  "product",
  "lifestyle",
  "educational",
  "ugc",
  "promotional",
  "behind-the-scenes",
] as const;

const platforms = [
  "instagram",
  "facebook",
  "tiktok",
  "linkedin",
] as const;

function makePost(i: number, daysBack: number): SocialPost {
  const isPaid = i % 5 === 0;
  const isBoosted = i % 7 === 0 && !isPaid;
  const reach = 8000 + Math.floor(Math.random() * 42000);
  const impressions = Math.round(reach * (1.2 + Math.random() * 0.8));
  const likes = Math.floor(reach * (0.02 + Math.random() * 0.06));
  const comments = Math.floor(likes * (0.05 + Math.random() * 0.1));
  const shares = Math.floor(likes * (0.02 + Math.random() * 0.05));
  const saves = Math.floor(likes * (0.08 + Math.random() * 0.12));
  const clicks = Math.floor(impressions * (0.005 + Math.random() * 0.02));

  const caption = captions[i % captions.length];

  return {
    id: `post-${i}`,
    platform: platforms[i % platforms.length],
    category: categories[i % categories.length],
    storyBeat: inferStoryBeat(caption),
    type: isPaid ? "paid" : isBoosted ? "boosted" : "organic",
    publishedAt: daysAgo(daysBack),
    caption,
    imageUrl: `https://picsum.photos/seed/${i + 42}/600/600`,
    metrics: {
      impressions,
      reach,
      likes,
      comments,
      shares,
      saves,
      clicks,
      spend: isPaid || isBoosted ? 200 + Math.floor(Math.random() * 800) : undefined,
    },
  };
}

export const allPosts: SocialPost[] = Array.from({ length: 45 }, (_, i) =>
  makePost(i, Math.floor(i * 2.1))
);

export function getPostsForTimeframe(
  timeframe: "weekly" | "monthly" | "quarterly"
): SocialPost[] {
  const cutoffs = { weekly: 7, monthly: 30, quarterly: 90 };
  const cutoff = subDays(now, cutoffs[timeframe]);
  return allPosts.filter((p) => new Date(p.publishedAt) >= cutoff);
}

export const competitors: CompetitorBrand[] = [
  {
    name: "Rival Co.",
    followers: 142000,
    avgEngagementRate: 2.8,
    avgPostsPerWeek: 12,
    topCategory: "lifestyle",
  },
  {
    name: "Peak Brands",
    followers: 89000,
    avgEngagementRate: 3.4,
    avgPostsPerWeek: 8,
    topCategory: "product",
  },
  {
    name: "Nova Collective",
    followers: 210000,
    avgEngagementRate: 2.1,
    avgPostsPerWeek: 15,
    topCategory: "ugc",
  },
  {
    name: "Atlas Goods",
    followers: 67000,
    avgEngagementRate: 4.1,
    avgPostsPerWeek: 6,
    topCategory: "educational",
  },
];

export const brand: BrandProfile = {
  name: "BeoneDigitalTest",
  handle: "@vibecodeflow",
  competitors,
};

export const audienceGrowth: AudienceSnapshot[] = Array.from(
  { length: 24 },
  (_, i) => {
    const date = subMonths(now, 23 - i);
    const base = 85000 + i * 1200 + Math.floor(Math.random() * 800);
    return {
      date: date.toISOString(),
      followers: base,
      growth: i === 0 ? 0 : base - (85000 + (i - 1) * 1200),
    };
  }
);

export function buildReportSummary(posts: SocialPost[]): ReportSummary {
  const organic = posts.filter((p) => p.type === "organic");
  const paid = posts.filter((p) => p.type === "paid" || p.type === "boosted");
  const totalSpend = paid.reduce(
    (sum, p) => sum + (p.metrics.spend ?? 0),
    0
  );

  const avgER =
    posts.reduce((sum, p) => sum + engagementRate(p.metrics), 0) /
    (posts.length || 1);
  const avgCTR =
    posts.reduce((sum, p) => sum + clickThroughRate(p.metrics), 0) /
    (posts.length || 1);

  const latest = audienceGrowth[audienceGrowth.length - 1];
  const previous = audienceGrowth[audienceGrowth.length - 2];

  return {
    totalPosts: posts.length,
    organicPosts: organic.length,
    paidPosts: paid.length,
    totalSpend,
    avgEngagementRate: avgER,
    avgCTR,
    totalReach: posts.reduce((s, p) => s + p.metrics.reach, 0),
    totalImpressions: posts.reduce((s, p) => s + p.metrics.impressions, 0),
    audienceGrowth: latest.followers - previous.followers,
  };
}

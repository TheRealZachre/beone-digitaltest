import { engagementRate } from "@/lib/metrics";
import type { SocialPost } from "@/lib/types";
import type { LinkedInHit } from "./types";

export function detectLinkedInHits(
  posts: SocialPost[],
  thresholdPercent: number,
  maxHits: number
): LinkedInHit[] {
  const linkedInOrganic = posts.filter(
    (post) => post.platform === "linkedin" && post.type === "organic"
  );

  const hits = linkedInOrganic
    .map((post) => {
      const rate = engagementRate(post.metrics);
      return { post, rate };
    })
    .filter(({ rate }) => rate >= thresholdPercent)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, maxHits)
    .map(({ post, rate }) => ({
      post,
      engagementRate: rate,
      hitReason: `Organic LinkedIn post at ${rate.toFixed(1)}% ER (≥ ${thresholdPercent}% threshold).`,
    }));

  return hits;
}

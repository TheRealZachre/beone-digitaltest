import { budgetRecommendation, engagementRate } from "@/lib/metrics";
import type { SocialPost } from "@/lib/types";
import { findBestSibling } from "./match";
import type {
  AmplificationAction,
  LinkedInHit,
  OrchestrationPlan,
  PlatformRecommendation,
  TargetPlatform,
} from "./types";

const FORMAT_HINTS: Record<TargetPlatform, string> = {
  instagram: "45–60 sec Reel, 9:16 — hook clip with link in bio to full asset",
  x: "45–60 sec native clip or thread — YouTube link in reply",
  youtube: "Full-length hub (3–20 min) or Short cut from LinkedIn narrative",
};

function truncateCaption(text: string, max = 220): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function adaptCaptionForPlatform(
  sourceCaption: string,
  platform: TargetPlatform
): string {
  const base = truncateCaption(sourceCaption, 180);
  switch (platform) {
    case "instagram":
      return `${base}\n\n🔗 Full story in bio.`;
    case "x":
      return `${truncateCaption(sourceCaption, 240)}\n\n🧵 Thread + clip — link in reply.`;
    case "youtube":
      return `From our LinkedIn audience: ${truncateCaption(sourceCaption, 160)}`;
    default:
      return base;
  }
}

function pickAction(
  hitRate: number,
  sibling?: SocialPost,
  siblingRate?: number
): AmplificationAction {
  if (!sibling) return "create";
  if (siblingRate === undefined) return "repost";

  if (siblingRate < hitRate * 0.5) return "boost";
  if (siblingRate >= hitRate * 0.85) return "cross-promote";
  return "repost";
}

function buildRationale(
  hit: LinkedInHit,
  platform: TargetPlatform,
  action: AmplificationAction,
  confidence: PlatformRecommendation["matchConfidence"],
  sibling?: SocialPost,
  siblingRate?: number
): string {
  const hitRate = hit.engagementRate.toFixed(1);

  if (action === "create") {
    return `LinkedIn hit at ${hitRate}% ER has no strong ${platform} sibling. Create net-new content using the same story beat (${hit.post.storyBeat}).`;
  }

  const siblingEr = siblingRate?.toFixed(1) ?? "—";
  const matchLabel =
    confidence === "exact"
      ? "exact caption match"
      : confidence === "theme"
        ? "theme overlap"
        : "shared story beat";

  switch (action) {
    case "boost":
      return `Found ${matchLabel} on ${platform} (${siblingEr}% ER vs ${hitRate}% on LinkedIn). Boost to close the performance gap.`;
    case "cross-promote":
      return `${platform} sibling already performing (${siblingEr}% ER). Cross-promote with lighter touch — pin, Stories, or quote post.`;
    case "repost":
      return `Related ${platform} post (${siblingEr}% ER, ${matchLabel}). Republish or refresh creative while LinkedIn momentum is high.`;
    default:
      return `Amplify on ${platform} while LinkedIn post is hot.`;
  }
}

function computePriority(
  hitRate: number,
  action: AmplificationAction,
  siblingRate?: number
): number {
  const gap = siblingRate !== undefined ? Math.max(0, hitRate - siblingRate) : hitRate;
  const actionWeight =
    action === "boost" ? 1.2 : action === "create" ? 1.0 : 0.85;
  return Math.round(hitRate * gap * actionWeight);
}

export function buildOrchestrationPlan(
  hit: LinkedInHit,
  allPosts: SocialPost[],
  targetPlatforms: TargetPlatform[],
  matchWindowDays: number
): OrchestrationPlan {
  const recommendations: PlatformRecommendation[] = targetPlatforms.map(
    (platform) => {
      const platformPosts = allPosts.filter((post) => post.platform === platform);
      const { post: sibling, confidence, score } = findBestSibling(
        hit.post,
        platformPosts,
        matchWindowDays
      );

      const siblingRate = sibling
        ? engagementRate(sibling.metrics)
        : undefined;
      const action = pickAction(hit.engagementRate, sibling, siblingRate);
      const budget =
        sibling && (action === "boost" || action === "repost")
          ? budgetRecommendation(sibling)
          : undefined;

      return {
        targetPlatform: platform,
        action,
        matchedPost: sibling,
        matchConfidence: score > 0 ? confidence : "none",
        priority: computePriority(hit.engagementRate, action, siblingRate),
        rationale: buildRationale(
          hit,
          platform,
          action,
          score > 0 ? confidence : "none",
          sibling,
          siblingRate
        ),
        suggestedCaption:
          action === "create"
            ? adaptCaptionForPlatform(hit.post.caption, platform)
            : sibling
              ? adaptCaptionForPlatform(sibling.caption, platform)
              : adaptCaptionForPlatform(hit.post.caption, platform),
        formatHint: FORMAT_HINTS[platform],
        recommendedBudget:
          budget?.eligible ? budget.recommendedBudget : undefined,
      };
    }
  );

  recommendations.sort((a, b) => b.priority - a.priority);

  return { linkedInHit: hit, recommendations };
}

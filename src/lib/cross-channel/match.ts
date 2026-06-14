import type { SocialPost } from "@/lib/types";
import type { MatchConfidence } from "./types";

export function normalizeCaption(text: string): string {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\w\s#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function captionPrefix(text: string, length = 120): string {
  return normalizeCaption(text).slice(0, length);
}

function termOverlap(a: string, b: string): number {
  const termsA = new Set(
    normalizeCaption(a)
      .split(/\s+/)
      .filter((term) => term.length > 2)
  );
  const termsB = normalizeCaption(b)
    .split(/\s+/)
    .filter((term) => term.length > 2);

  if (termsB.length === 0) return 0;

  const matched = termsB.filter((term) => termsA.has(term)).length;
  return matched / termsB.length;
}

function daysBetween(a: string, b: string): number {
  const ms = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return ms / (1000 * 60 * 60 * 24);
}

export function scoreSiblingMatch(
  source: SocialPost,
  candidate: SocialPost,
  windowDays: number
): { confidence: MatchConfidence; score: number } {
  if (source.id === candidate.id) {
    return { confidence: "none", score: 0 };
  }

  const normalizedSource = normalizeCaption(source.caption);
  const normalizedCandidate = normalizeCaption(candidate.caption);

  if (
    normalizedSource.length > 20 &&
    normalizedSource === normalizedCandidate
  ) {
    return { confidence: "exact", score: 100 };
  }

  if (captionPrefix(source.caption) === captionPrefix(candidate.caption)) {
    return { confidence: "exact", score: 95 };
  }

  const overlap = termOverlap(source.caption, candidate.caption);
  if (overlap >= 0.6) {
    return { confidence: "theme", score: 70 + overlap * 20 };
  }

  const withinWindow = daysBetween(source.publishedAt, candidate.publishedAt) <= windowDays;
  if (
    withinWindow &&
    source.storyBeat === candidate.storyBeat &&
    source.category === candidate.category
  ) {
    return { confidence: "beat", score: 55 };
  }

  if (withinWindow && source.storyBeat === candidate.storyBeat) {
    return { confidence: "beat", score: 45 };
  }

  return { confidence: "none", score: 0 };
}

export function findBestSibling(
  source: SocialPost,
  candidates: SocialPost[],
  windowDays: number
): { post?: SocialPost; confidence: MatchConfidence; score: number } {
  let best: { post?: SocialPost; confidence: MatchConfidence; score: number } = {
    confidence: "none",
    score: 0,
  };

  for (const candidate of candidates) {
    const result = scoreSiblingMatch(source, candidate, windowDays);
    if (result.score > best.score) {
      best = { post: candidate, ...result };
    }
  }

  return best;
}

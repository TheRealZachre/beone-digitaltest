import type { Platform } from "@/lib/types";
import { getPredictiveConfig } from "./config";
import type { ContentSignals, PredictedMetrics } from "./types";
import type { PerformanceBaseline } from "./baseline";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function firstLine(text: string): string {
  return text.split(/\n/)[0]?.trim() ?? "";
}

function countHashtags(text: string): number {
  return (text.match(/#\w+/g) ?? []).length;
}

function countNumbers(text: string): number {
  return (text.match(/\b\d+[%kKmMbB]?\b/g) ?? []).length;
}

export function analyzeContentSignals(
  caption: string,
  platform: Platform
): ContentSignals {
  const config = getPredictiveConfig();
  const optimal = config.optimalLength[platform];
  const length = caption.trim().length;
  const hook = firstLine(caption);
  const hashtags = countHashtags(caption);
  const numbers = countNumbers(caption);

  const lengthScore =
    length >= optimal.min && length <= optimal.max
      ? 1.08
      : length < optimal.min * 0.5
        ? 0.88
        : length > optimal.max * 1.4
          ? 0.92
          : 1;

  const hookScore =
    hook.length >= 40 && hook.length <= 140
      ? 1.1
      : hook.length < 25
        ? 0.9
        : 1.02;

  const hashtagScore =
    platform === "linkedin"
      ? hashtags >= 1 && hashtags <= 3
        ? 1.05
        : hashtags > 5
          ? 0.94
          : 1
      : platform === "instagram"
        ? hashtags >= 3 && hashtags <= 8
          ? 1.06
          : 1
        : hashtags <= 2
          ? 1.03
          : 0.97;

  const dataScore = numbers >= 2 ? 1.12 : numbers === 1 ? 1.06 : 0.96;

  const questionScore = /\?/.test(caption) ? 1.07 : 1;

  const ctaScore =
    /learn more|read more|link in|comment|share|join us|register/i.test(caption)
      ? 1.05
      : 1;

  const structureScore =
    caption.split(/\n\s*\n/).filter(Boolean).length >= 2 ? 1.04 : 0.98;

  const compositeMultiplier = clamp(
    lengthScore *
      hookScore *
      hashtagScore *
      dataScore *
      questionScore *
      ctaScore *
      structureScore,
    0.75,
    1.35
  );

  return {
    lengthScore,
    hookScore,
    hashtagScore,
    dataScore,
    questionScore,
    ctaScore,
    structureScore,
    compositeMultiplier,
  };
}

export function predictMetrics(
  baseline: PerformanceBaseline,
  signals: ContentSignals
): PredictedMetrics {
  const multiplier = signals.compositeMultiplier;
  const impressions = Math.round(baseline.avgImpressions * multiplier);
  const reach = Math.round(baseline.avgReach * multiplier);
  const engagementRate =
    Math.round(baseline.avgEngagementRate * multiplier * 10) / 10;
  const engagements = Math.round(reach * (engagementRate / 100));

  return {
    impressions,
    reach,
    engagements,
    engagementRate,
    confidence: baseline.confidence,
  };
}

export function liftPercent(
  baseline: PredictedMetrics,
  variant: PredictedMetrics
): number {
  if (baseline.engagements === 0) return 0;
  return Math.round(
    ((variant.engagements - baseline.engagements) / baseline.engagements) * 100
  );
}

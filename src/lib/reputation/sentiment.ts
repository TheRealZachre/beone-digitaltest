import type { SentimentLabel } from "./types";

const POSITIVE = [
  "approval",
  "approved",
  "breakthrough",
  "innovative",
  "growth",
  "strong",
  "positive",
  "success",
  "durable",
  "milestone",
  "priority review",
  "promising",
  "outperform",
  "upgrade",
  "record",
  "expansion",
  "partnership",
  "patient",
  "hope",
  "leadership",
];

const NEGATIVE = [
  "lawsuit",
  "delay",
  "delayed",
  "failure",
  "failed",
  "controversy",
  "criticism",
  "criticized",
  "recall",
  "deny",
  "denied",
  "reject",
  "rejected",
  "cut",
  "layoff",
  "investigation",
  "probe",
  "warning",
  "risk",
  "concern",
  "decline",
  "drop",
  "underperform",
  "downgrade",
  "setback",
  "halt",
  "paused",
];

export function scoreSentiment(text: string): number {
  const lower = text.toLowerCase();
  let score = 50;

  for (const word of POSITIVE) {
    if (lower.includes(word)) score += 4;
  }
  for (const word of NEGATIVE) {
    if (lower.includes(word)) score -= 6;
  }

  if (/\b(fda|asco|priority review|phase 3)\b/i.test(lower)) score += 5;
  if (/\b(layoff|lawsuit|investigation)\b/i.test(lower)) score -= 8;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function sentimentLabel(score: number): SentimentLabel {
  if (score >= 62) return "positive";
  if (score <= 42) return "negative";
  return "neutral";
}

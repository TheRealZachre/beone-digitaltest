import type { TargetPlatform } from "./types";

export function getCrossChannelConfig() {
  return {
    hitThresholdPercent: Number(
      process.env.CROSS_CHANNEL_HIT_THRESHOLD ?? "3.5"
    ),
    lookbackDays: Number(process.env.CROSS_CHANNEL_LOOKBACK_DAYS ?? "30"),
    maxHits: Number(process.env.CROSS_CHANNEL_MAX_HITS ?? "8"),
    matchWindowDays: Number(process.env.CROSS_CHANNEL_MATCH_WINDOW ?? "7"),
    targetPlatforms: ["instagram", "x", "youtube"] as TargetPlatform[],
  };
}

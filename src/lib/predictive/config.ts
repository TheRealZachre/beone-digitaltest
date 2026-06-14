import type { Platform } from "@/lib/types";

const OPTIMAL_LENGTH: Record<Platform, { min: number; max: number }> = {
  linkedin: { min: 400, max: 1200 },
  instagram: { min: 80, max: 400 },
  facebook: { min: 100, max: 500 },
  x: { min: 120, max: 260 },
  youtube: { min: 200, max: 800 },
  tiktok: { min: 60, max: 200 },
};

export function getPredictiveConfig() {
  return {
    defaultPlatform: (process.env.PREDICTIVE_DEFAULT_PLATFORM ??
      "linkedin") as Platform,
    lookbackDays: Number(process.env.PREDICTIVE_LOOKBACK_DAYS ?? "90"),
    optimalLength: OPTIMAL_LENGTH,
  };
}

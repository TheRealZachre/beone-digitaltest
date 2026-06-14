import { PLATFORM_NAME } from "@/lib/company";
import type { VideoAudience } from "./types";

export function getVideoProductionConfig() {
  return {
    productName: process.env.VIDEO_PRODUCTION_PRODUCT_NAME ?? PLATFORM_NAME,
    suiteName:
      process.env.VIDEO_PRODUCTION_SUITE_NAME ?? "AI Video Production Suite",
    defaultBrand: process.env.VIDEO_PRODUCTION_DEFAULT_BRAND ?? "BeOne Medicines",
    defaultSpokesperson:
      process.env.VIDEO_PRODUCTION_SPOKESPERSON ?? "John V. Oyler",
    hubPlatform: "YouTube" as const,
  };
}

export const AUDIENCE_LABELS: Record<VideoAudience, string> = {
  patients: "Patients & caregivers",
  "healthcare-professionals": "Healthcare professionals",
  investors: "Investors & analysts",
  employees: "Employees & recruits",
  "general-public": "General public",
};

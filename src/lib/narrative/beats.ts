import type { StoryBeat } from "@/lib/types";

/** High-contrast categorical palette — hues spread for arc plot legibility. */
export const BEATS: Record<StoryBeat, { color: string }> = {
  "Brand Vision": { color: "#DC2626" },
  "Scientific Innovation": { color: "#1D4ED8" },
  "Patient-Centered": { color: "#EA580C" },
  "Disease Awareness": { color: "#16A34A" },
  "Corporate Citizenship": { color: "#9333EA" },
  "People & Culture": { color: "#0891B2" },
  "Policy Advocacy": { color: "#DB2777" },
};

export const BEAT_ORDER: StoryBeat[] = [
  "Scientific Innovation",
  "People & Culture",
  "Corporate Citizenship",
  "Patient-Centered",
  "Brand Vision",
  "Disease Awareness",
  "Policy Advocacy",
];

const BEAT_RULES: { beat: StoryBeat; patterns: RegExp[] }[] = [
  {
    beat: "Brand Vision",
    patterns: [
      /one save|save changes|tournament|goalkeeper|tim howard|brand vision/i,
    ],
  },
  {
    beat: "Scientific Innovation",
    patterns: [
      /asco|eha\b|fda|clinical|trial|inhibitor|data|investor|media:|financial results|abstract|oncolog/i,
    ],
  },
  {
    beat: "Patient-Centered",
    patterns: [
      /patient story|you have cancer|advocacy council|caregiver|richard|meet \w+.*cancer/i,
    ],
  },
  {
    beat: "Disease Awareness",
    patterns: [
      /awareness day|awareness poll|world day|ecam|esophageal cancer|wm world|poll:/i,
    ],
  },
  {
    beat: "Corporate Citizenship",
    patterns: [
      /sustainability|responsible business|global impact|esg|partnership|293 patients/i,
    ],
  },
  {
    beat: "People & Culture",
    patterns: [
      /great place to work|team beone|voices of leadership|general manager|hiring|culture|thailand|malaysia|singapore/i,
    ],
  },
  {
    beat: "Policy Advocacy",
    patterns: [
      /step therapy|payer|pbm|insurer|access barrier|policy|medicare|reimbursement/i,
    ],
  },
];

export function inferStoryBeat(text: string): StoryBeat {
  for (const { beat, patterns } of BEAT_RULES) {
    if (patterns.some((p) => p.test(text))) return beat;
  }
  return "Scientific Innovation";
}

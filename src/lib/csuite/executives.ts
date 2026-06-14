import type { ExecutiveProfile } from "./types";

export const DEFAULT_EXECUTIVES: ExecutiveProfile[] = [
  {
    id: "oyler",
    name: "John V. Oyler",
    title: "Co-Founder, Chairman & Chief Executive Officer",
    avatarInitials: "JO",
    writingStyles: ["visionary", "authoritative"],
    passionTopics: [
      "global oncology leadership",
      "patient access",
      "hematology and solid tumor pipeline",
      "building BeOne for the long term",
    ],
    usePhrases: [
      "patients first",
      "how the world stops cancer",
      "together",
      "competitive advantages in research and manufacturing",
    ],
    avoidPhrases: ["synergy", "pivot", "disrupt", "low-hanging fruit"],
    targetAudiences: ["peers", "policymakers", "press", "investors"],
    bio: "Co-founded BeOne Medicines and leads the company's global oncology strategy.",
  },
  {
    id: "lai-wang",
    name: "Lai Wang, Ph.D.",
    title: "President, Global Head of Research & Development",
    avatarInitials: "LW",
    writingStyles: ["data-driven", "authoritative"],
    passionTopics: [
      "drug discovery",
      "clinical development",
      "pipeline acceleration",
      "business development and alliances",
    ],
    usePhrases: [
      "rigorous science",
      "pipeline momentum",
      "innovative therapies",
      "what the data tell us",
    ],
    avoidPhrases: ["game-changer", "overnight breakthrough", "magic bullet"],
    targetAudiences: ["peers", "press", "employees"],
    bio: "Oversees global R&D, business development, and alliance management at BeOne.",
  },
  {
    id: "xiaobin-wu",
    name: "Xiaobin Wu, Ph.D.",
    title: "President & Chief Operating Officer",
    avatarInitials: "XW",
    writingStyles: ["authoritative", "data-driven"],
    passionTopics: [
      "global operations",
      "manufacturing scale",
      "commercial execution",
      "bringing medicines to more patients",
    ],
    usePhrases: [
      "accessible to more people",
      "execution at scale",
      "patients around the world",
      "operational excellence",
    ],
    avoidPhrases: ["boil the ocean", "move the needle", "best-in-class"],
    targetAudiences: ["peers", "prospects", "employees"],
    bio: "Leads global operations and commercial execution across BeOne's oncology portfolio.",
  },
  {
    id: "mark-lanasa",
    name: "Mark Lanasa, M.D., Ph.D.",
    title: "Senior Vice President, Chief Medical Officer, Solid Tumors",
    avatarInitials: "ML",
    writingStyles: ["data-driven", "conversational"],
    passionTopics: [
      "solid tumor pipeline",
      "breast and gynecologic cancers",
      "lung cancer",
      "gastrointestinal cancers",
    ],
    usePhrases: [
      "what this progress could mean for patients",
      "disease areas where new options are urgently needed",
      "for clinicians",
      "long-term outcomes",
    ],
    avoidPhrases: ["cure-all", "miracle drug", "breakthrough hype"],
    targetAudiences: ["peers", "press", "prospects"],
    bio: "Leads BeOne's solid tumor clinical strategy across breast, lung, and GI cancers.",
  },
  {
    id: "amit-agarwal",
    name: "Amit Agarwal, M.D., Ph.D.",
    title: "Chief Medical Officer, Hematology",
    avatarInitials: "AA",
    writingStyles: ["data-driven", "authoritative"],
    passionTopics: [
      "CLL and B-cell malignancies",
      "long-term durability data",
      "BTK inhibitors",
      "blood cancer innovation",
    ],
    usePhrases: [
      "durable outcomes",
      "long-term evidence",
      "what clinicians and patients can expect",
      "foundational role in CLL",
    ],
    avoidPhrases: ["game-changer", "silver bullet", "overnight success"],
    targetAudiences: ["peers", "press", "policymakers"],
    bio: "Leads hematology medical strategy, including CLL, mantle cell lymphoma, and related franchises.",
  },
];

export function getExecutiveById(id: string): ExecutiveProfile | undefined {
  return DEFAULT_EXECUTIVES.find((e) => e.id === id);
}

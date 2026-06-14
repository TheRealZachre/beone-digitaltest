export const VOICE_TRAINING_PRODUCT_NAME = "Voice Profile Training";
export const VOICE_TRAINING_TAGLINE =
  "Learn each executive's writing voice from past posts — draft in their actual voice";

export const VOICE_TRAINING_OVERVIEW =
  "Voice Profile Training learns how each leader actually writes from their published LinkedIn and X posts — sentence rhythm, signature phrases, opener patterns, and what they never say. New drafts inherit that profile so the ghostwritten-by-comms tone disconnect dies.";

export const VOICE_TRAINING_STEPS = [
  {
    step: 1,
    title: "Ingest past posts",
    description:
      "Pulls an executive's historical posts and articles to establish a baseline voice fingerprint.",
  },
  {
    step: 2,
    title: "Extract voice signatures",
    description:
      "Identifies opener patterns, preferred phrases, sentence length, first-person usage, and corporate jargon risk.",
  },
  {
    step: 3,
    title: "Build voice profile",
    description:
      "Creates a per-executive profile with authenticity score, anti-patterns to avoid, and style markers.",
  },
  {
    step: 4,
    title: "Draft in voice",
    description:
      "Generates new LinkedIn posts, articles, or X copy that matches the trained profile — not generic comms tone.",
  },
] as const;

export const GHOSTWRITTEN_MARKERS = [
  "pleased to announce",
  "thrilled to share",
  "excited to unveil",
  "synergy",
  "best-in-class",
  "leverage",
  "low-hanging fruit",
  "move the needle",
  "game-changer",
];

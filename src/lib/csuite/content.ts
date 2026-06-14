export const CSUITE_PRODUCT_NAME = "C-Suite Content Engine";

export const CSUITE_TAGLINE =
  "Executive-grade thought leadership from corporate social signals.";

export const CSUITE_OVERVIEW =
  "An AI-powered application that monitors a company's corporate social media channels and automatically generates executive-grade thought leadership content for individual C-level leaders — bridging corporate brand messaging with authentic executive voice.";

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Monitor corporate channels",
    description:
      "Identifies key themes, announcements, and narratives from recent corporate posts.",
  },
  {
    step: 2,
    title: "Reframe through executive lens",
    description:
      "Reframes that content through the lens of the individual executive's voice and perspective.",
  },
  {
    step: 3,
    title: "Generate multi-format content",
    description:
      "Generates LinkedIn Posts, LinkedIn Articles, and short-form thought leadership copy in an executive tone.",
  },
  {
    step: 4,
    title: "Strengthen with visuals",
    description:
      "Suggests accompanying visuals or data points to strengthen each piece.",
  },
] as const;

export const CONTENT_OUTPUT_TYPES = [
  {
    id: "linkedin-post",
    title: "LinkedIn Posts",
    description:
      "Short-form posts (under 3,000 characters) written in the executive's voice. Includes hook, insight, supporting point, and CTA. Designed for high engagement and shareability.",
  },
  {
    id: "linkedin-article",
    title: "LinkedIn Articles",
    description:
      "Long-form articles (800–2,500 words) positioned as original thought leadership. Grounded in corporate content but written as if from the executive's direct experience and expertise.",
  },
  {
    id: "x-post",
    title: "X / Twitter Posts",
    description:
      "Punchy, conversation-starting posts adapted from longer LinkedIn content for the X audience. Designed to drive replies and retweets.",
  },
  {
    id: "platform-variations",
    title: "Platform Variations",
    description:
      "Each piece is automatically adapted for tone and length across platforms, maintaining executive voice while optimizing for each format.",
  },
] as const;

export const VOICE_CALIBRATION_DIMENSIONS = [
  {
    title: "Preferred writing style",
    options: "Authoritative, conversational, visionary, data-driven",
  },
  {
    title: "Topics of passion",
    description: "Subject matter expertise and themes the executive cares about most.",
  },
  {
    title: "Language patterns",
    description: "Phrases and language patterns to use and avoid.",
  },
  {
    title: "Target audience",
    options: "Peers, prospects, policymakers, press, employees",
  },
] as const;

export const ANALYTICS_REPORT_TYPES = [
  {
    id: "monthly",
    title: "Monthly Report",
    description:
      "Post-by-post performance breakdown for all executive content published that month. Includes impressions, engagement rate, follower growth attributed to content, and top-performing posts.",
  },
  {
    id: "quarterly",
    title: "Quarterly Report",
    description:
      "Trend analysis comparing quarter-over-quarter growth in executive profile reach, engagement benchmarks versus industry peers, and content category performance analysis.",
  },
] as const;

export const CSUITE_NAV = [
  { href: "/csuite", label: "Overview", exact: true },
  { href: "/csuite/generate", label: "Generate Content" },
  { href: "/csuite/voice", label: "Voice Calibration" },
  { href: "/csuite/output", label: "Output Types" },
  { href: "/csuite/reports", label: "Performance Reports" },
] as const;

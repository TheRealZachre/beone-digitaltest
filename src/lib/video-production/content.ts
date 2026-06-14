import { getVideoProductionConfig } from "./config";

const config = getVideoProductionConfig();

export const VIDEO_PRODUCTION_PRODUCT_NAME = config.suiteName;
export const VIDEO_PRODUCTION_BRAND = config.productName;
export const VIDEO_PRODUCTION_TAGLINE =
  "Start-to-finish AI video creation and multi-channel distribution";

export const VIDEO_PRODUCTION_OVERVIEW = `${config.productName} is a start-to-finish, AI-powered video creation and distribution platform. A client provides a topic, key messages, or source content — and ${config.productName} handles everything from scriptwriting to final publish across all social channels.`;

export const WORKFLOW_STEPS = [
  {
    step: 1,
    id: "script",
    title: "Script",
    description:
      "AI generates a full video script based on provided topic, talking points, brand guidelines, and target audience. Script is reviewed and approved before production begins.",
  },
  {
    step: 2,
    id: "presenter",
    title: "AI Presenter",
    description:
      "An AI-generated on-screen presenter (custom-trained to represent the brand or a designated spokesperson) records the script using text-to-video AI. No camera, crew, or studio required.",
  },
  {
    step: 3,
    id: "production",
    title: "Production",
    description:
      "Full video is assembled with B-roll, motion graphics, lower thirds, branded intros/outros, and music. Output is a polished, broadcast-quality video file.",
  },
  {
    step: 4,
    id: "distribution",
    title: "Distribution",
    description:
      "The completed video and its social media clips are automatically published to configured channels per platform specifications.",
  },
] as const;

export const DISTRIBUTION_STRATEGY = {
  model: "Hub-and-spoke",
  summary:
    "The full-length video lives on YouTube; social clips drive traffic back to it.",
  hub: "YouTube",
};

export const PLATFORM_DISTRIBUTION = [
  {
    platform: "YouTube",
    format: "Full-length (3–20 min)",
    length: "3–20 min",
    purpose:
      "Primary hub — full video with SEO-optimized title, description, tags, chapters, and thumbnail",
    aspectRatio: "16:9",
  },
  {
    platform: "Instagram Reels",
    format: "45–60 seconds",
    length: "45–60 sec",
    purpose: "Hook clip driving viewers to full YouTube video via link in bio",
    aspectRatio: "9:16",
  },
  {
    platform: "Facebook Reels / Video",
    format: "45–60 seconds",
    length: "45–60 sec",
    purpose: "Short clip with caption and YouTube link driving traffic",
    aspectRatio: "9:16",
  },
  {
    platform: "LinkedIn Video",
    format: "45–60 seconds",
    length: "45–60 sec",
    purpose:
      "Professional-tone clip aimed at B2B audience; drives to YouTube",
    aspectRatio: "9:16",
  },
  {
    platform: "TikTok",
    format: "45–60 seconds",
    length: "45–60 sec",
    purpose:
      "Trend-native cut optimized for TikTok algorithm with YouTube CTA",
    aspectRatio: "9:16",
  },
  {
    platform: "X / Twitter",
    format: "45–60 seconds",
    length: "45–60 sec",
    purpose: "Clip posted natively with YouTube link in reply thread",
    aspectRatio: "16:9",
  },
] as const;

export const KEY_CAPABILITIES = [
  "Brand voice and visual identity configuration per client",
  "AI avatar selection or custom spokesperson model training",
  "Automated caption generation (SRT / VTT) for all platforms",
  "Platform-native aspect ratio rendering: 16:9 for YouTube, 9:16 for Reels/TikTok",
  "Auto-generated thumbnail options with A/B testing capability",
  "Content calendar scheduling — queue videos for future publish dates",
];

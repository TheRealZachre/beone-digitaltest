export const CROSS_CHANNEL_PRODUCT_NAME = "Cross-Channel Orchestration";
export const CROSS_CHANNEL_TAGLINE =
  "When a LinkedIn post hits, know exactly what to amplify on Instagram, X, and YouTube";

export const CROSS_CHANNEL_OVERVIEW =
  "Channels stop being silos. When a LinkedIn post breaks through, the system scans your Instagram, X, and YouTube corpus for sibling content — then recommends whether to boost, repost, cross-promote, or create net-new clips on each platform.";

export const CROSS_CHANNEL_CAPABILITIES = [
  {
    title: "LinkedIn hit detection",
    description:
      "Flags organic LinkedIn posts at or above the 3.5% engagement-rate amplification threshold — the same bar used for paid boost recommendations.",
  },
  {
    title: "Sibling content matching",
    description:
      "Layers exact caption match, fuzzy term overlap, shared story beat, and publish-window proximity to find related posts on other channels.",
  },
  {
    title: "Per-platform actions",
    description:
      "Recommends boost, repost, cross-promote, or create for Instagram, X, and YouTube — with format hints pulled from the video distribution playbook.",
  },
  {
    title: "Priority scoring",
    description:
      "Ranks recommendations by LinkedIn performance × gap on the target platform so your team knows what to ship first.",
  },
] as const;

export const ACTION_LABELS: Record<
  import("./types").AmplificationAction,
  string
> = {
  boost: "Boost",
  repost: "Repost",
  create: "Create",
  "cross-promote": "Cross-promote",
};

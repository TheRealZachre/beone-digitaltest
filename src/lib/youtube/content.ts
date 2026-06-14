export const YOUTUBE_PRODUCT_NAME = "YouTube SEO Optimizer";

export const YOUTUBE_TAGLINE =
  "Automated SEO intelligence and performance tracking for every video on your channel.";

export const YOUTUBE_PROBLEM = {
  title: "The problem it solves",
  body: "Today, generating an SEO package for a YouTube video requires manually uploading a transcript, prompting an AI tool to generate title, description, and tags, then copying and pasting each element back into YouTube Studio — one video at a time. This application automates the entire workflow and adds a performance intelligence layer that currently does not exist.",
};

export const YOUTUBE_OVERVIEW =
  "Transforms what is currently a manual, copy-paste process into a fully automated intelligence platform — connecting directly to a YouTube channel, analyzing every published video, rating and ranking each one, and tracking ongoing SEO and brand visibility impact over time.";

export const CORE_CAPABILITIES = [
  { label: "YouTube channel API connection", category: "integration" },
  { label: "Video SEO score (0–100 rating)", category: "scoring" },
  { label: "Automated transcript extraction", category: "automation" },
  { label: "Search ranking by keyword", category: "intelligence" },
  { label: "AI-generated SEO title (under 70 chars)", category: "automation" },
  { label: "Click-through rate from search", category: "intelligence" },
  { label: "AI-generated video description", category: "automation" },
  { label: "Impressions & view velocity tracking", category: "intelligence" },
  { label: "Keyword-optimized tag generation", category: "automation" },
  { label: "Brand visibility trend over time", category: "intelligence" },
  { label: "Chapter marker suggestions", category: "automation" },
  { label: "Competitive channel benchmarking", category: "intelligence" },
] as const;

export const SEO_SCORE_FACTORS = [
  {
    weight: 25,
    label: "Title optimization",
    detail: "Keyword placement & click appeal",
    color: "#DC2626",
  },
  {
    weight: 20,
    label: "Description quality",
    detail: "Keyword density, CTA & links",
    color: "#1D4ED8",
  },
  {
    weight: 15,
    label: "Tag relevance",
    detail: "Alignment with title & transcript",
    color: "#EA580C",
  },
  {
    weight: 15,
    label: "Thumbnail performance",
    detail: "Estimated CTR benchmarks",
    color: "#9333EA",
  },
  {
    weight: 15,
    label: "Watch time & retention",
    detail: "Average view duration",
    color: "#16A34A",
  },
  {
    weight: 10,
    label: "Engagement signals",
    detail: "Likes, comments & shares",
    color: "#0891B2",
  },
] as const;

export const VISIBILITY_METRICS = [
  {
    title: "Monthly impressions growth",
    description:
      "Track impressions from YouTube search and suggested videos month over month.",
  },
  {
    title: "Share of voice",
    description:
      "Measure target keyword visibility versus competitor channels in your category.",
  },
  {
    title: "Subscriber attribution",
    description:
      "Identify which videos are driving new channel subscriptions and growth.",
  },
  {
    title: "Geographic reach expansion",
    description:
      "See where new viewers are discovering the channel and how reach is spreading.",
  },
  {
    title: "Top search queries",
    description:
      "Surface the search terms driving traffic to each video in your library.",
  },
] as const;

export const SEO_PACKAGE_OUTPUTS = [
  {
    title: "Optimized title",
    description:
      "Under 70 characters with keyword research built in for search and click appeal.",
  },
  {
    title: "Full video description",
    description:
      "Keyword-rich opening, chapter markers, links, and a clear call to action.",
  },
  {
    title: "Up to 15 optimized tags",
    description:
      "Ranked by search volume and relevance to the video transcript and title.",
  },
  {
    title: "Thumbnail text overlays",
    description:
      "Suggested text overlay options designed to improve click-through rate.",
  },
  {
    title: "End screen & card placements",
    description:
      "Recommended end screen and card placements to extend watch time and conversions.",
  },
  {
    title: "Optional auto-publish",
    description:
      "Push SEO updates directly back to YouTube Studio via API when approved.",
    optional: true,
  },
] as const;

export const YOUTUBE_NAV = [
  { href: "/youtube", label: "Overview", exact: true },
  { href: "/youtube/channel", label: "Channel Analyzer" },
  { href: "/youtube/analyze", label: "Video SEO Tool" },
  { href: "/youtube/seo-score", label: "SEO Scoring" },
  { href: "/youtube/visibility", label: "Brand Visibility" },
  { href: "/youtube/seo-packages", label: "SEO Packages" },
] as const;

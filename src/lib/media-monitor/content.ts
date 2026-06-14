export const MEDIA_MONITOR_PRODUCT_NAME = "Media Monitor";
export const MEDIA_MONITOR_TAGLINE =
  "Pull news coverage and major social posts for any subject";

export const MEDIA_MONITOR_OVERVIEW =
  "Enter a company, executive, product, or topic to aggregate recent news articles and high-engagement social posts. News is pulled from Google News and Bing News RSS feeds, with optional NewsAPI enrichment. Social results combine your synced channel posts with live X search when sync credentials are configured.";

export const MEDIA_MONITOR_SOURCES = [
  {
    title: "News feeds",
    description:
      "Google News RSS, Bing News RSS, and optional NewsAPI (NEWS_API_KEY) for broader trade and wire coverage.",
  },
  {
    title: "Synced social channels",
    description:
      "Major posts from LinkedIn, Instagram, Facebook, X, and YouTube already in your dashboard cache, ranked by engagement.",
  },
  {
    title: "Live X search",
    description:
      "Recent posts mentioning the subject via live X search when sync credentials are set.",
  },
];

export function getMediaMonitorConfig() {
  return {
    userAgent:
      process.env.MEDIA_MONITOR_USER_AGENT ??
      "SocialInsightsDashboard/1.0 (media-monitor; demo@local)",
    apifyToken: process.env.APIFY_TOKEN,
    newsApiKey: process.env.NEWS_API_KEY,
    defaultSubject:
      process.env.MEDIA_MONITOR_DEFAULT_SUBJECT ?? "BeOne Medicines",
    maxNews: Number(process.env.MEDIA_MONITOR_MAX_NEWS ?? "30"),
    maxSocial: Number(process.env.MEDIA_MONITOR_MAX_SOCIAL ?? "30"),
    xSearchActor:
      process.env.MEDIA_MONITOR_X_ACTOR ?? "apidojo/tweet-scraper",
  };
}

export function getWikipediaConfig() {
  return {
    apiBase: "https://en.wikipedia.org/w/api.php",
    userAgent:
      process.env.WIKIPEDIA_USER_AGENT ??
      "SocialInsightsDashboard/1.0 (https://github.com/local/social-insights-dashboard; demo@local)",
    companyPage:
      process.env.WIKIPEDIA_COMPANY_PAGE ?? "BeOne Medicines",
    ceoPage: process.env.WIKIPEDIA_CEO_PAGE ?? "John V. Oyler",
    companyName: process.env.WIKIPEDIA_COMPANY_NAME ?? "BeOne Medicines",
    ceoName: process.env.WIKIPEDIA_CEO_NAME ?? "John V. Oyler",
    legacyNames: ["BeiGene", "BeiGene, Ltd."],
    currentBrand: "BeOne Medicines",
  };
}

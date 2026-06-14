export const WEBSITE_SEO_PRODUCT_NAME = "Website SEO Audit & Advisor";

export const WEBSITE_SEO_TAGLINE =
  "On-demand website audits with actionable fixes — not just a score.";

export const WEBSITE_SEO_OVERVIEW =
  "An intelligent on-demand tool that scans any website and delivers a comprehensive, actionable analysis of its search engine performance — not just a score, but exactly what is working, what is broken, why it matters, and precisely how to fix it.";

export const SEARCH_ENGINE_COVERAGE = [
  {
    engine: "Google",
    detail:
      "Core Web Vitals, Page Experience signals, and Search Console data readiness.",
    status: "analyzed" as const,
  },
  {
    engine: "Bing",
    detail:
      "Webmaster Tools integration signals and Bing-specific ranking factors.",
    status: "analyzed" as const,
  },
  {
    engine: "Yahoo",
    detail:
      "Powered by Bing's index; surfaced through dedicated Yahoo ranking analysis.",
    status: "analyzed" as const,
  },
  {
    engine: "DuckDuckGo & Brave",
    detail:
      "Emerging engine visibility based on indexability and privacy-friendly markup.",
    status: "partial" as const,
  },
  {
    engine: "AI search surfaces",
    detail:
      "Visibility signals for ChatGPT Search, Perplexity, and Google AI Overviews (SGE).",
    status: "partial" as const,
  },
] as const;

export const AUDIT_COVERAGE_AREAS = [
  "Technical SEO health check",
  "On-page SEO (titles, meta, H-tags)",
  "Page speed & Core Web Vitals",
  "Keyword gap & ranking analysis",
  "Mobile-friendliness assessment",
  "Internal linking structure",
  "Crawlability & indexation review",
  "Schema markup / structured data",
  "XML sitemap & robots.txt audit",
  "Backlink profile overview",
  "Broken links & redirect chains",
  "Competitor domain comparison",
] as const;

export const AUDIT_OUTPUT_SECTIONS = [
  {
    title: "Executive Summary",
    description:
      "Overall SEO health score and top 5 priority action items.",
  },
  {
    title: "Section-by-section findings",
    description:
      "What is working well and what needs improvement across every audit area.",
  },
  {
    title: "Priority matrix",
    description:
      "Issues ranked by impact (high / medium / low) and effort to fix.",
  },
  {
    title: "Detailed fix instructions",
    description:
      "Step-by-step guidance in plain language for internal teams or developers.",
  },
  {
    title: "Ranking snapshot",
    description:
      "Current keyword positions across Google, Bing, and Yahoo.",
  },
  {
    title: "30/60/90-day improvement roadmap",
    description:
      "Sequenced action plan for sustained SEO growth.",
  },
] as const;

export const WEBSITE_SEO_NAV = [
  { href: "/website-seo", label: "Overview", exact: true },
  { href: "/website-seo/audit", label: "Run Audit" },
  { href: "/website-seo/coverage", label: "Search Coverage" },
  { href: "/website-seo/output", label: "Audit Output" },
] as const;

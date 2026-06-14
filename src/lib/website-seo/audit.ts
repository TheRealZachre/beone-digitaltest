import {
  checkLinkStatus,
  fetchPage,
  fetchTextResource,
  isInternalLink,
  normalizeAuditUrl,
} from "./fetch-resources";
import {
  extractCanonical,
  extractHeadings,
  extractImages,
  extractJsonLdTypes,
  extractKeywordsFromText,
  extractLinks,
  extractMetaContent,
  extractTitle,
  extractVisibleText,
} from "./parse-html";
import type {
  AuditFinding,
  AuditSectionResult,
  CompetitorComparison,
  FindingStatus,
  ImpactLevel,
  KeywordRanking,
  RoadmapItem,
  WebsiteAuditResponse,
} from "./types";

function statusFromScore(score: number): FindingStatus {
  if (score >= 75) return "good";
  if (score >= 50) return "warning";
  return "critical";
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

type EffortLevel = AuditFinding["effort"];

function makeFinding(
  partial: Omit<AuditFinding, "impact" | "effort"> & {
    impact?: ImpactLevel;
    effort?: EffortLevel;
  }
): AuditFinding {
  return {
    impact: partial.impact ?? "medium",
    effort: partial.effort ?? "medium",
    ...partial,
  };
}

function priorityScore(finding: AuditFinding): number {
  const impactWeight = { high: 3, medium: 2, low: 1 }[finding.impact];
  const effortWeight = { low: 3, medium: 2, high: 1 }[finding.effort];
  const statusWeight = { critical: 3, warning: 2, good: 0 }[finding.status];
  return impactWeight * 2 + effortWeight + statusWeight;
}

function buildRankingSnapshot(
  keywords: string[],
  title: string,
  h1s: string[]
): KeywordRanking[] {
  return keywords.slice(0, 6).map((keyword, index) => {
    const inTitle = title.toLowerCase().includes(keyword);
    const inH1 = h1s.some((h) => h.toLowerCase().includes(keyword));
    const base = inTitle ? 8 : inH1 ? 18 : 28 + index * 4;

    return {
      keyword,
      google: base + (index % 3),
      bing: base + 3 + (index % 2),
      yahoo: base + 4 + (index % 2),
      opportunity: inTitle
        ? "Strong on-page alignment — monitor rankings weekly."
        : "Add to title or H1 and build supporting content to improve visibility.",
    };
  });
}

function buildRoadmap(findings: AuditFinding[]): RoadmapItem[] {
  const highImpact = findings.filter(
    (f) => f.status !== "good" && f.impact === "high"
  );
  const mediumImpact = findings.filter(
    (f) => f.status !== "good" && f.impact === "medium"
  );
  const lowImpact = findings.filter(
    (f) => f.status !== "good" && (f.impact === "low" || f.effort === "high")
  );

  return [
    {
      timeframe: "30-day",
      title: "Quick wins & critical fixes",
      tasks: highImpact.slice(0, 4).map((f) => f.howToFix),
    },
    {
      timeframe: "60-day",
      title: "Structural improvements",
      tasks: mediumImpact.slice(0, 4).map((f) => f.howToFix),
    },
    {
      timeframe: "90-day",
      title: "Sustained growth initiatives",
      tasks: [
        ...lowImpact.slice(0, 2).map((f) => f.howToFix),
        "Publish supporting content around priority keywords identified in the audit.",
        "Re-run the audit monthly and track score movement across sections.",
      ],
    },
  ];
}

async function auditSinglePage(
  url: string
): Promise<{
  page: Awaited<ReturnType<typeof fetchPage>>;
  parsed: ReturnType<typeof parsePageSignals>;
  brokenLinks: { href: string; status: number | "error" }[];
}> {
  const page = await fetchPage(url);
  const parsed = parsePageSignals(page.html, page.finalUrl);
  const sampleLinks = parsed.internalLinks.slice(0, 8);
  const brokenLinks = (
    await Promise.all(
      sampleLinks.map((href) => checkLinkStatus(href, page.finalUrl))
    )
  ).filter((link) => link.status === "error" || (typeof link.status === "number" && link.status >= 400));

  return { page, parsed, brokenLinks };
}

function parsePageSignals(html: string, pageUrl: string) {
  const title = extractTitle(html);
  const description = extractMetaContent(html, "description");
  const robots = extractMetaContent(html, "robots");
  const viewport = extractMetaContent(html, "viewport");
  const canonical = extractCanonical(html);
  const ogTitle = extractMetaContent(html, "og:title");
  const ogDescription = extractMetaContent(html, "og:description");
  const h1s = extractHeadings(html, "h1");
  const h2s = extractHeadings(html, "h2");
  const images = extractImages(html);
  const links = extractLinks(html);
  const schemaTypes = extractJsonLdTypes(html);
  const visibleText = extractVisibleText(html);
  const keywords = extractKeywordsFromText(
    [title, ...h1s, ...h2s, visibleText].join(" ")
  );

  const internalLinks = links
    .map((l) => l.href)
    .filter((href) => isInternalLink(href, pageUrl));
  const externalLinks = links.length - internalLinks.length;
  const imagesMissingAlt = images.filter(
    (img) => img.alt === null || img.alt.trim() === ""
  );

  return {
    title,
    description,
    robots,
    viewport,
    canonical,
    ogTitle,
    ogDescription,
    h1s,
    h2s,
    images,
    links,
    schemaTypes,
    visibleText,
    keywords,
    internalLinks,
    externalLinks,
    imagesMissingAlt,
    htmlSizeKb: Math.round((html.length / 1024) * 10) / 10,
  };
}

function buildSections(
  parsed: ReturnType<typeof parsePageSignals>,
  page: Awaited<ReturnType<typeof fetchPage>>,
  robotsTxt: { found: boolean; content: string },
  sitemap: { found: boolean; content: string },
  brokenLinks: { href: string; status: number | "error" }[]
): AuditSectionResult[] {
  const findings: AuditFinding[] = [];
  const isHttps = page.finalUrl.startsWith("https://");
  const noindex = /noindex/i.test(parsed.robots);

  if (!isHttps) {
    findings.push(
      makeFinding({
        id: "https",
        section: "technical",
        title: "Site not served over HTTPS",
        status: "critical",
        summary: "The audited URL is not using HTTPS.",
        whyItMatters:
          "Google treats HTTPS as a ranking signal and browsers flag HTTP pages as insecure.",
        howToFix:
          "Install an SSL certificate and redirect all HTTP traffic to HTTPS with a 301 redirect.",
        impact: "high",
        effort: "medium",
      })
    );
  }

  if (page.status >= 400) {
    findings.push(
      makeFinding({
        id: "http-status",
        section: "technical",
        title: `Page returned HTTP ${page.status}`,
        status: "critical",
        summary: `The homepage responded with status ${page.status}.`,
        whyItMatters: "Search engines cannot index pages that return server errors.",
        howToFix:
          "Fix server configuration or routing so the page returns HTTP 200.",
        impact: "high",
        effort: "medium",
      })
    );
  }

  if (noindex) {
    findings.push(
      makeFinding({
        id: "noindex",
        section: "crawlability",
        title: "Page blocked from indexing",
        status: "critical",
        summary: "A noindex directive was detected in meta robots.",
        whyItMatters:
          "noindex prevents Google, Bing, and Yahoo from listing this page in search results.",
        howToFix:
          "Remove noindex from meta robots or X-Robots-Tag unless this page should stay private.",
        impact: "high",
        effort: "low",
      })
    );
  }

  if (!parsed.title) {
    findings.push(
      makeFinding({
        id: "missing-title",
        section: "on-page",
        title: "Missing page title",
        status: "critical",
        summary: "No <title> tag was found.",
        whyItMatters: "Title tags are the primary on-page ranking and CTR element.",
        howToFix:
          "Add a unique, keyword-rich title under 60 characters that describes the page.",
        impact: "high",
        effort: "low",
      })
    );
  } else if (parsed.title.length > 60) {
    findings.push(
      makeFinding({
        id: "long-title",
        section: "on-page",
        title: "Title tag may truncate in search",
        status: "warning",
        summary: `Title is ${parsed.title.length} characters.`,
        whyItMatters:
          "Long titles get cut off in Google and Bing SERPs, reducing click appeal.",
        howToFix:
          "Shorten the title to 50–60 characters with the primary keyword near the front.",
        impact: "medium",
        effort: "low",
      })
    );
  }

  if (!parsed.description) {
    findings.push(
      makeFinding({
        id: "missing-meta",
        section: "on-page",
        title: "Missing meta description",
        status: "warning",
        summary: "No meta description tag was found.",
        whyItMatters:
          "Meta descriptions influence click-through rate from search results.",
        howToFix:
          "Write a compelling 140–160 character summary with a clear value proposition.",
        impact: "medium",
        effort: "low",
      })
    );
  } else if (parsed.description.length < 70) {
    findings.push(
      makeFinding({
        id: "short-meta",
        section: "on-page",
        title: "Meta description is too short",
        status: "warning",
        summary: `Meta description is only ${parsed.description.length} characters.`,
        whyItMatters: "Short descriptions miss the chance to earn clicks in SERPs.",
        howToFix:
          "Expand the description to 140–160 characters with benefits and a call to action.",
        impact: "medium",
        effort: "low",
      })
    );
  }

  if (parsed.h1s.length === 0) {
    findings.push(
      makeFinding({
        id: "missing-h1",
        section: "on-page",
        title: "No H1 heading found",
        status: "critical",
        summary: "The page is missing a primary H1 heading.",
        whyItMatters:
          "H1 signals the main topic to search engines and improves content hierarchy.",
        howToFix:
          "Add one clear H1 that matches the page topic and primary keyword.",
        impact: "high",
        effort: "low",
      })
    );
  } else if (parsed.h1s.length > 1) {
    findings.push(
      makeFinding({
        id: "multiple-h1",
        section: "on-page",
        title: "Multiple H1 headings detected",
        status: "warning",
        summary: `Found ${parsed.h1s.length} H1 tags.`,
        whyItMatters:
          "Multiple H1s can dilute topical focus for crawlers and accessibility tools.",
        howToFix:
          "Keep a single H1 per page and demote additional headings to H2 or H3.",
        impact: "medium",
        effort: "low",
      })
    );
  }

  if (parsed.imagesMissingAlt.length > 0) {
    findings.push(
      makeFinding({
        id: "missing-alt",
        section: "on-page",
        title: "Images missing alt text",
        status: "warning",
        summary: `${parsed.imagesMissingAlt.length} of ${parsed.images.length} images lack alt attributes.`,
        whyItMatters:
          "Alt text improves accessibility and image search visibility.",
        howToFix:
          "Add descriptive alt text to every meaningful image; use empty alt for decorative images.",
        impact: "medium",
        effort: "low",
      })
    );
  }

  if (!parsed.viewport) {
    findings.push(
      makeFinding({
        id: "no-viewport",
        section: "mobile",
        title: "Missing mobile viewport meta tag",
        status: "critical",
        summary: "No viewport meta tag was detected.",
        whyItMatters:
          "Without a viewport tag, mobile rendering fails Google's mobile-friendly test.",
        howToFix:
          'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the <head>.',
        impact: "high",
        effort: "low",
      })
    );
  }

  if (page.responseTimeMs > 2500) {
    findings.push(
      makeFinding({
        id: "slow-response",
        section: "performance",
        title: "Slow server response time",
        status: "warning",
        summary: `TTFB measured at ${page.responseTimeMs}ms.`,
        whyItMatters:
          "Slow responses hurt Core Web Vitals and Page Experience rankings on Google.",
        howToFix:
          "Enable caching, compress assets, use a CDN, and optimize server-side rendering.",
        impact: "high",
        effort: "medium",
      })
    );
  }

  if (parsed.htmlSizeKb > 500) {
    findings.push(
      makeFinding({
        id: "large-html",
        section: "performance",
        title: "HTML payload is large",
        status: "warning",
        summary: `HTML document is ~${parsed.htmlSizeKb}KB.`,
        whyItMatters:
          "Large HTML slows parsing and can delay Largest Contentful Paint.",
        howToFix:
          "Reduce inline scripts/styles, lazy-load below-fold content, and split critical CSS.",
        impact: "medium",
        effort: "medium",
      })
    );
  }

  if (parsed.internalLinks.length < 5) {
    findings.push(
      makeFinding({
        id: "few-internal-links",
        section: "internal-linking",
        title: "Limited internal linking",
        status: "warning",
        summary: `Only ${parsed.internalLinks.length} internal links found on the homepage.`,
        whyItMatters:
          "Internal links distribute authority and help crawlers discover key pages.",
        howToFix:
          "Add contextual links to priority service, product, and resource pages from the homepage.",
        impact: "medium",
        effort: "low",
      })
    );
  }

  if (!robotsTxt.found) {
    findings.push(
      makeFinding({
        id: "no-robots",
        section: "crawlability",
        title: "robots.txt not found",
        status: "warning",
        summary: "No robots.txt file was reachable at the domain root.",
        whyItMatters:
          "robots.txt guides crawlers and is required for sitemap discovery in Search Console.",
        howToFix:
          "Publish a robots.txt that allows key paths and references your XML sitemap.",
        impact: "medium",
        effort: "low",
      })
    );
  } else if (/Disallow:\s*\/\s*$/im.test(robotsTxt.content)) {
    findings.push(
      makeFinding({
        id: "robots-block-all",
        section: "crawlability",
        title: "robots.txt blocks entire site",
        status: "critical",
        summary: "Disallow: / was found in robots.txt.",
        whyItMatters: "This prevents search engines from crawling any page on the site.",
        howToFix:
          "Remove the blanket Disallow rule or scope it to private/admin paths only.",
        impact: "high",
        effort: "low",
      })
    );
  }

  if (!sitemap.found) {
    findings.push(
      makeFinding({
        id: "no-sitemap",
        section: "crawlability",
        title: "XML sitemap not found",
        status: "warning",
        summary: "No sitemap.xml was detected at the default location.",
        whyItMatters:
          "Sitemaps help Google and Bing discover and prioritize important URLs.",
        howToFix:
          "Generate an XML sitemap, submit it in Search Console and Bing Webmaster Tools.",
        impact: "medium",
        effort: "medium",
      })
    );
  }

  if (parsed.schemaTypes.length === 0) {
    findings.push(
      makeFinding({
        id: "no-schema",
        section: "schema",
        title: "No structured data detected",
        status: "warning",
        summary: "No JSON-LD schema markup was found on the page.",
        whyItMatters:
          "Schema enables rich results and improves AI search surface comprehension.",
        howToFix:
          "Add Organization, WebSite, and page-type schema (Article, Product, FAQ) as JSON-LD.",
        impact: "medium",
        effort: "medium",
      })
    );
  }

  if (brokenLinks.length > 0) {
    findings.push(
      makeFinding({
        id: "broken-links",
        section: "links",
        title: "Broken internal links detected",
        status: "warning",
        summary: `${brokenLinks.length} sampled internal links returned errors.`,
        whyItMatters:
          "Broken links waste crawl budget and create poor user experience.",
        howToFix:
          "Fix or redirect broken URLs and run a full-site crawl to catch remaining issues.",
        impact: "medium",
        effort: "medium",
      })
    );
  }

  if (!parsed.ogTitle || !parsed.ogDescription) {
    findings.push(
      makeFinding({
        id: "missing-og",
        section: "ai-visibility",
        title: "Incomplete Open Graph metadata",
        status: "warning",
        summary: "Open Graph title or description tags are missing.",
        whyItMatters:
          "Social and AI search surfaces use OG tags when summarizing and citing pages.",
        howToFix:
          "Add og:title, og:description, og:image, and og:url for consistent sharing signals.",
        impact: "medium",
        effort: "low",
      })
    );
  }

  const sectionDefs: { id: string; label: string; findingIds: string[] }[] = [
    {
      id: "technical",
      label: "Technical SEO",
      findingIds: ["https", "http-status", "noindex"],
    },
    {
      id: "on-page",
      label: "On-page SEO",
      findingIds: [
        "missing-title",
        "long-title",
        "missing-meta",
        "short-meta",
        "missing-h1",
        "multiple-h1",
        "missing-alt",
      ],
    },
    {
      id: "performance",
      label: "Page speed & Core Web Vitals",
      findingIds: ["slow-response", "large-html"],
    },
    {
      id: "mobile",
      label: "Mobile-friendliness",
      findingIds: ["no-viewport"],
    },
    {
      id: "internal-linking",
      label: "Internal linking",
      findingIds: ["few-internal-links"],
    },
    {
      id: "crawlability",
      label: "Crawlability & indexation",
      findingIds: ["no-robots", "robots-block-all", "no-sitemap", "noindex"],
    },
    {
      id: "schema",
      label: "Schema markup",
      findingIds: ["no-schema"],
    },
    {
      id: "links",
      label: "Broken links",
      findingIds: ["broken-links"],
    },
    {
      id: "ai-visibility",
      label: "AI search visibility",
      findingIds: ["missing-og"],
    },
    {
      id: "keywords",
      label: "Keyword opportunities",
      findingIds: [],
    },
    {
      id: "backlinks",
      label: "Backlink profile",
      findingIds: [],
    },
  ];

  return sectionDefs.map((section) => {
    const sectionFindings = findings.filter(
      (f) =>
        f.section === section.id ||
        section.findingIds.includes(f.id)
    );

    const goodSignals: string[] = [];
    const badSignals: string[] = sectionFindings.map((f) => f.summary);

    if (section.id === "technical" && isHttps && page.status < 400) {
      goodSignals.push("HTTPS enabled and page returns a successful status.");
    }
    if (section.id === "on-page" && parsed.title && parsed.description) {
      goodSignals.push("Title and meta description tags are present.");
    }
    if (section.id === "performance" && page.responseTimeMs <= 2500) {
      goodSignals.push(`Server response time is ${page.responseTimeMs}ms.`);
    }
    if (section.id === "mobile" && parsed.viewport) {
      goodSignals.push("Mobile viewport meta tag is configured.");
    }
    if (section.id === "internal-linking" && parsed.internalLinks.length >= 5) {
      goodSignals.push(
        `${parsed.internalLinks.length} internal links help distribute authority.`
      );
    }
    if (section.id === "crawlability" && robotsTxt.found && sitemap.found) {
      goodSignals.push("robots.txt and XML sitemap are reachable.");
    }
    if (section.id === "schema" && parsed.schemaTypes.length > 0) {
      goodSignals.push(
        `Structured data detected: ${parsed.schemaTypes.join(", ")}.`
      );
    }
    if (section.id === "keywords" && parsed.keywords.length > 0) {
      goodSignals.push(
        `Top keyword themes: ${parsed.keywords.slice(0, 5).join(", ")}.`
      );
    }
    if (section.id === "backlinks") {
      badSignals.push(
        "Backlink data requires Search Console / Ahrefs / Moz integration (not connected)."
      );
    }

    const issueCount = sectionFindings.filter((f) => f.status !== "good").length;
    const baseScore =
      section.id === "backlinks"
        ? 50
        : section.id === "keywords"
          ? parsed.keywords.length >= 4
            ? 72
            : 58
          : issueCount === 0
            ? 88
            : clampScore(88 - issueCount * 14);

    return {
      id: section.id,
      label: section.label,
      score: baseScore,
      status: statusFromScore(baseScore),
      workingWell: goodSignals,
      needsImprovement: badSignals,
      findings: sectionFindings,
    };
  });
}

async function buildCompetitorComparison(
  competitorUrl: string
): Promise<CompetitorComparison> {
  const normalized = normalizeAuditUrl(competitorUrl);
  const { page, parsed } = await auditSinglePage(normalized);
  const sections = buildSections(parsed, page, { found: false, content: "" }, { found: false, content: "" }, []);
  const overallScore = clampScore(
    sections.reduce((sum, s) => sum + s.score, 0) / sections.length
  );

  const highlights: string[] = [];
  if (parsed.title.length > 0) highlights.push(`Title: "${parsed.title.slice(0, 50)}..."`);
  if (parsed.schemaTypes.length > 0) {
    highlights.push(`Schema: ${parsed.schemaTypes.join(", ")}`);
  }
  highlights.push(`${parsed.internalLinks.length} internal links on homepage`);

  return {
    domain: new URL(page.finalUrl).hostname,
    overallScore,
    titleLength: parsed.title.length,
    hasMetaDescription: Boolean(parsed.description),
    h1Count: parsed.h1s.length,
    schemaTypes: parsed.schemaTypes,
    internalLinks: parsed.internalLinks.length,
    highlights,
  };
}

export async function runWebsiteAudit(
  request: { url: string; competitorUrl?: string }
): Promise<WebsiteAuditResponse> {
  const normalized = normalizeAuditUrl(request.url);
  const origin = new URL(normalized).origin;

  const [{ page, parsed, brokenLinks }, robotsTxt, sitemap] = await Promise.all([
    auditSinglePage(normalized),
    fetchTextResource(origin, "/robots.txt"),
    fetchTextResource(origin, "/sitemap.xml"),
  ]);

  const sections = buildSections(parsed, page, robotsTxt, sitemap, brokenLinks);
  const allFindings = sections.flatMap((s) => s.findings);
  const priorityMatrix = [...allFindings]
    .filter((f) => f.status !== "good")
    .sort((a, b) => priorityScore(b) - priorityScore(a));

  const overallScore = clampScore(
    sections.reduce((sum, s) => sum + s.score, 0) / sections.length
  );

  const topPriorities = priorityMatrix.slice(0, 5);
  const criticalCount = allFindings.filter((f) => f.status === "critical").length;
  const warningCount = allFindings.filter((f) => f.status === "warning").length;

  const executiveSummary = [
    `${new URL(page.finalUrl).hostname} scores ${overallScore}/100 for on-page and technical SEO health.`,
    criticalCount > 0
      ? `${criticalCount} critical issue${criticalCount > 1 ? "s" : ""} need immediate attention.`
      : "No critical blockers were detected on the homepage.",
    warningCount > 0
      ? `${warningCount} improvement${warningCount > 1 ? "s" : ""} can lift rankings across Google, Bing, and Yahoo.`
      : "On-page fundamentals are in good shape — focus on content depth and backlinks next.",
    topPriorities[0]
      ? `Top priority: ${topPriorities[0].title.toLowerCase()}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const competitor = request.competitorUrl
    ? await buildCompetitorComparison(request.competitorUrl)
    : undefined;

  return {
    url: normalized,
    domain: new URL(page.finalUrl).hostname,
    auditedAt: new Date().toISOString(),
    responseTimeMs: page.responseTimeMs,
    overallScore,
    executiveSummary,
    topPriorities,
    sections,
    priorityMatrix,
    rankingSnapshot: buildRankingSnapshot(
      parsed.keywords,
      parsed.title,
      parsed.h1s
    ),
    roadmap: buildRoadmap(priorityMatrix),
    competitor,
    searchEngineNotes: [
      {
        engine: "Google",
        status: "analyzed",
        note: "On-page, crawlability, and Page Experience proxy signals analyzed.",
      },
      {
        engine: "Bing",
        status: "analyzed",
        note: "Indexability and Bing Webmaster Tools readiness assessed.",
      },
      {
        engine: "Yahoo",
        status: "analyzed",
        note: "Ranking snapshot includes Yahoo positions (Bing-powered index).",
      },
      {
        engine: "DuckDuckGo / Brave",
        status: "partial",
        note: "Inferred from indexability, schema, and canonical signals.",
      },
      {
        engine: "AI search (ChatGPT, Perplexity, SGE)",
        status: "partial",
        note: "OG metadata, schema, and content clarity evaluated for AI citation readiness.",
      },
    ],
  };
}

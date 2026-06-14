import { readSocialCache } from "@/lib/data/social-cache";
import { getWikipediaConfig } from "./config";
import { fetchWikipediaArticle } from "./fetch-page";
import {
  daysSince,
  mentionsTerm,
  parseWikipediaArticle,
} from "./parse-article";
import type {
  EffortLevel,
  FindingStatus,
  ImpactLevel,
  WikipediaAuditResponse,
  WikipediaAuditRequest,
  WikipediaFinding,
  WikipediaPageSnapshot,
  WikipediaRoadmapItem,
} from "./types";

function statusFromScore(score: number): FindingStatus {
  if (score >= 75) return "good";
  if (score >= 50) return "warning";
  return "critical";
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function makeFinding(
  partial: Omit<WikipediaFinding, "impact" | "effort"> & {
    impact?: ImpactLevel;
    effort?: EffortLevel;
  }
): WikipediaFinding {
  return {
    impact: partial.impact ?? "medium",
    effort: partial.effort ?? "medium",
    ...partial,
  };
}

function priorityScore(finding: WikipediaFinding): number {
  const impactWeight = { high: 3, medium: 2, low: 1 }[finding.impact];
  const effortWeight = { low: 3, medium: 2, high: 1 }[finding.effort];
  const statusWeight = { critical: 3, warning: 2, good: 0 }[finding.status];
  return impactWeight * 2 + effortWeight + statusWeight;
}

async function getNarrativeSignals(): Promise<string[]> {
  const cache = await readSocialCache();
  if (!cache?.posts?.length) return [];

  const signals = new Set<string>();
  const rules: { pattern: RegExp; label: string }[] = [
    { pattern: /fda|priority review|regulatory/i, label: "FDA / regulatory milestones" },
    { pattern: /asco|eha|congress|conference/i, label: "Major congress presentations (ASCO, EHA)" },
    { pattern: /financial results|earnings|investor/i, label: "Investor and financial results news" },
    { pattern: /great place to work|gptw|culture/i, label: "Employer brand and culture recognition" },
    { pattern: /patient story|advocacy|caregiver/i, label: "Patient-centered storytelling" },
    { pattern: /pipeline|clinical trial|inhibitor/i, label: "Pipeline and clinical trial updates" },
    { pattern: /sustainability|esg|citizenship/i, label: "ESG and corporate citizenship" },
    { pattern: /policy|access|reimbursement|payer/i, label: "Policy and access advocacy" },
  ];

  for (const post of cache.posts.slice(0, 80)) {
    for (const rule of rules) {
      if (rule.pattern.test(post.caption)) {
        signals.add(rule.label);
      }
    }
  }

  return Array.from(signals).slice(0, 8);
}

function buildPageSnapshot(
  page: Awaited<ReturnType<typeof fetchWikipediaArticle>>,
  role: "company" | "ceo",
  config: ReturnType<typeof getWikipediaConfig>
): WikipediaPageSnapshot {
  if (!page.exists) {
    return {
      title: page.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`,
      exists: false,
      wordCount: 0,
      referenceCount: 0,
      sectionCount: 0,
      sections: [],
      hasInfobox: false,
      hasLeadImage: false,
      maintenanceFlags: [],
      categories: [],
      mentionsLegacyName: false,
      mentionsCurrentName: false,
      score: 0,
      status: "critical",
      workingWell: [],
      needsImprovement: ["Article does not exist or could not be resolved."],
    };
  }

  const parsed = parseWikipediaArticle(page.wikitext, page.extract);
  const staleDays = daysSince(page.lastEdited);
  const textBlob = `${page.wikitext ?? ""} ${page.extract ?? ""}`;

  let score = 70;
  const workingWell: string[] = [];
  const needsImprovement: string[] = [];

  if (parsed.hasInfobox) {
    score += 6;
    workingWell.push("Infobox present — baseline credibility for scanners and search snippets.");
  } else {
    score -= 12;
    needsImprovement.push("Add or complete the infobox with headquarters, industry, key people, and website.");
  }

  if (parsed.referenceCount >= 15) {
    score += 8;
    workingWell.push(
      `${parsed.referenceCount} references — meets Wikipedia's verifiability bar for a ${role === "company" ? "corporate" : "biographical"} article.`
    );
  } else if (parsed.referenceCount >= 5) {
    score += 2;
    needsImprovement.push(
      `Only ${parsed.referenceCount} references — add more independent press, SEC filings, and trade coverage.`
    );
  } else {
    score -= 15;
    needsImprovement.push(
      "Very few citations — article is vulnerable to maintenance tags or deletion review."
    );
  }

  if (staleDays != null && staleDays <= 120) {
    score += 5;
    workingWell.push(
      `Recently edited (${staleDays} days ago) — page is actively maintained.`
    );
  } else if (staleDays != null && staleDays > 365) {
    score -= 12;
    needsImprovement.push(
      `Last substantive edit was ${staleDays} days ago — schedule a quarterly Wikipedia review.`
    );
  }

  if (parsed.maintenanceFlags.length === 0) {
    score += 5;
    workingWell.push("No maintenance templates flagged on the live article.");
  } else {
    score -= parsed.maintenanceFlags.length * 8;
    needsImprovement.push(
      `Maintenance flags present: ${parsed.maintenanceFlags.join(", ")}.`
    );
  }

  if (role === "company" && parsed.sections.length >= 4) {
    score += 4;
    workingWell.push("Structured sections (R&D, history, references) support neutral long-form coverage.");
  }

  if (role === "ceo" && parsed.hasLeadImage) {
    score += 4;
    workingWell.push("Lead image improves recognition in search and knowledge panels.");
  } else if (role === "ceo" && !parsed.hasLeadImage) {
    needsImprovement.push("Add a neutral, properly licensed lead photograph to the CEO infobox.");
  }

  const mentionsCurrent = mentionsTerm(textBlob, [
    config.currentBrand,
    "BeOne",
  ]);
  const mentionsLegacy = mentionsTerm(textBlob, config.legacyNames);

  if (mentionsCurrent) score += 3;
  if (role === "company" && mentionsLegacy && mentionsCurrent) {
    workingWell.push("Rebrand context documented — legacy BeiGene naming appears alongside BeOne.");
  }

  return {
    title: page.title,
    url: page.url ?? `https://en.wikipedia.org/wiki/${page.title.replace(/ /g, "_")}`,
    exists: true,
    lastEdited: page.lastEdited,
    byteSize: page.byteSize,
    wordCount: parsed.wordCount,
    referenceCount: parsed.referenceCount,
    sectionCount: parsed.sections.length,
    sections: parsed.sections,
    hasInfobox: parsed.hasInfobox,
    hasLeadImage: parsed.hasLeadImage,
    maintenanceFlags: parsed.maintenanceFlags,
    categories: page.categories,
    mentionsLegacyName: mentionsLegacy,
    mentionsCurrentName: mentionsCurrent,
    score: clampScore(score),
    status: statusFromScore(clampScore(score)),
    workingWell,
    needsImprovement,
  };
}

function buildCompanyFindings(
  snapshot: WikipediaPageSnapshot,
  ceoName: string,
  narrativeSignals: string[],
  config: ReturnType<typeof getWikipediaConfig>
): WikipediaFinding[] {
  const findings: WikipediaFinding[] = [];

  if (!snapshot.exists) {
    return [
      makeFinding({
        id: "company-missing",
        page: "company",
        section: "Existence",
        title: "Company Wikipedia article not found",
        status: "critical",
        summary: `No article resolved for ${config.companyName}.`,
        whyItMatters:
          "Corporate Wikipedia pages anchor investor research, journalist fact-checking, and AI knowledge panels.",
        howToFix:
          "Confirm notability with independent coverage, then draft a neutral article with third-party references before any promotional language.",
        impact: "high",
        effort: "high",
      }),
    ];
  }

  if (snapshot.maintenanceFlags.includes("Needs update")) {
    findings.push(
      makeFinding({
        id: "company-update-template",
        page: "company",
        section: "Maintenance",
        title: "Article carries a 'needs update' template",
        status: "warning",
        summary:
          "Wikipedia editors have flagged that portions of the company article are out of date.",
        whyItMatters:
          "Maintenance banners appear at the top of the article for every reader — including press, investors, and recruits.",
        howToFix:
          "Identify outdated pipeline, leadership, or financial paragraphs; replace with cited, independent sources published in the last 12 months. Request banner removal on the article talk page once addressed.",
        impact: "high",
        effort: "medium",
      })
    );
  }

  const text = `${snapshot.sections.join(" ")} ${snapshot.categories.join(" ")}`;
  if (!mentionsTerm(text, ["leadership", "management", "people"])) {
    findings.push(
      makeFinding({
        id: "company-leadership-gap",
        page: "company",
        section: "Structure",
        title: "No dedicated leadership section",
        status: "warning",
        summary:
          "The company article does not appear to have a leadership or management section.",
        whyItMatters:
          "Executives and board changes are high-search queries during news cycles; a leadership section improves neutrality and discoverability.",
        howToFix: `Add a neutral Leadership section citing SEC filings, annual reports, and trade press. Link to ${ceoName}'s article where appropriate.`,
        impact: "medium",
        effort: "medium",
      })
    );
  }

  if (narrativeSignals.length > 0) {
    const pageText = `${snapshot.sections.join(" ")} ${snapshot.categories.join(" ")}`;
    const missingSignals = narrativeSignals.filter((signal) => {
      const keywords = signal
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 4)
        .slice(0, 2);
      return !keywords.some((word) => pageText.toLowerCase().includes(word));
    });

    if (missingSignals.length > 0) {
      findings.push(
        makeFinding({
          id: "company-narrative-gap",
          page: "company",
          section: "Recency",
          title: "Recent corporate milestones underrepresented",
          status: "warning",
          summary: `Your live social channels emphasize ${missingSignals.slice(0, 3).join(", ")} — topics that may not yet be reflected on Wikipedia.`,
          whyItMatters:
            "Wikipedia lags social channels by months; proactive updates prevent outdated narratives from hardening in search and AI summaries.",
          howToFix:
            "For each milestone, identify two independent reliable sources (trade press, regulatory filings). Add concise, neutral sentences to History or R&D with inline citations — not marketing copy.",
          impact: "high",
          effort: "medium",
        })
      );
    }
  }

  if (snapshot.referenceCount < 25) {
    findings.push(
      makeFinding({
        id: "company-reference-density",
        page: "company",
        section: "Verifiability",
        title: "Expand independent reference coverage",
        status: snapshot.referenceCount < 10 ? "critical" : "warning",
        summary: `${snapshot.referenceCount} references on a ${snapshot.wordCount.toLocaleString()}-word article.`,
        whyItMatters:
          "Pharma articles attract scrutiny; thin sourcing invites COI or promotional tone challenges.",
        howToFix:
          "Add citations from FiercePharma, Endpoints, SEC 10-K/10-Q, FDA approval letters, and peer-reviewed journals. Avoid press releases as sole sources.",
        impact: "high",
        effort: "medium",
      })
    );
  }

  return findings;
}

function buildCeoFindings(
  snapshot: WikipediaPageSnapshot,
  companyName: string,
  config: ReturnType<typeof getWikipediaConfig>
): WikipediaFinding[] {
  const findings: WikipediaFinding[] = [];

  if (!snapshot.exists) {
    return [
      makeFinding({
        id: "ceo-missing",
        page: "ceo",
        section: "Existence",
        title: "CEO Wikipedia article not found",
        status: "warning",
        summary: `No article resolved for ${config.ceoName}.`,
        whyItMatters:
          "Executive knowledge panels pull from Wikipedia when available; absence cedes narrative to secondary profiles.",
        howToFix:
          "If notability thresholds are met (significant coverage in independent sources), create a neutral biographical article focused on career facts — not corporate promotion.",
        impact: "medium",
        effort: "high",
      }),
    ];
  }

  if (snapshot.wordCount < 400) {
    findings.push(
      makeFinding({
        id: "ceo-article-depth",
        page: "ceo",
        section: "Depth",
        title: "CEO article is thin for a public-company founder",
        status: "warning",
        summary: `Article is ~${snapshot.wordCount} words — below typical depth for a Fortune/Global 500 CEO profile.`,
        whyItMatters:
          "Short biographies read as stubs and are more likely to be challenged or merged.",
        howToFix:
          "Expand Career and BeOne sections with cited milestones: founding story, major regulatory wins, and board roles — each tied to independent journalism or filings.",
        impact: "medium",
        effort: "medium",
      })
    );
  }

  if (snapshot.mentionsLegacyName && !snapshot.sections.some((s) => /beone/i.test(s))) {
    findings.push(
      makeFinding({
        id: "ceo-rebrand-section",
        page: "ceo",
        section: "Branding",
        title: "Rebrand narrative may need a dedicated section refresh",
        status: "warning",
        summary:
          "Legacy BeiGene naming appears but the article structure may not reflect the BeOne rebrand.",
        whyItMatters:
          "Inconsistent naming confuses search engines and AI models during the brand transition.",
        howToFix: `Ensure the BeOne section documents the rebrand with dated, cited sources. Cross-link to the ${companyName} article and align infobox employer fields.`,
        impact: "medium",
        effort: "low",
      })
    );
  }

  if (!snapshot.hasLeadImage) {
    findings.push(
      makeFinding({
        id: "ceo-photo",
        page: "ceo",
        section: "Visuals",
        title: "Add a properly licensed CEO photograph",
        status: "warning",
        summary: "No lead image detected in the article lead or infobox.",
        whyItMatters:
          "Images increase click-through from search and improve Google knowledge panel completeness.",
        howToFix:
          "Upload a neutral headshot under a Creative Commons or company-provided license via Wikimedia Commons, then reference it in the infobox.",
        impact: "low",
        effort: "low",
      })
    );
  }

  return findings;
}

function buildCrossFindings(
  company: WikipediaPageSnapshot,
  ceo: WikipediaPageSnapshot,
  ceoName: string,
  companyName: string
): WikipediaFinding[] {
  if (!company.exists || !ceo.exists) return [];

  const findings: WikipediaFinding[] = [];
  const ceoFirst = ceoName.split(" ")[0] ?? ceoName;

  if (!mentionsTerm(company.sections.join(" "), [ceoName, ceoFirst])) {
    findings.push(
      makeFinding({
        id: "cross-company-ceo-link",
        page: "cross",
        section: "Cross-linking",
        title: "Company article should link to CEO biography",
        status: "warning",
        summary: `The company article sections do not clearly reference ${ceoName}.`,
        whyItMatters:
          "Bidirectional linking between company and executive articles is standard on Wikipedia and improves reader navigation.",
        howToFix: `Add a wikilink to [[${ceo.title}]] in the lead paragraph or a Leadership subsection with a neutral role description.`,
        impact: "medium",
        effort: "low",
      })
    );
  }

  if (!mentionsTerm(ceo.sections.join(" "), [companyName, "BeOne"])) {
    findings.push(
      makeFinding({
        id: "cross-ceo-company-link",
        page: "cross",
        section: "Cross-linking",
        title: "CEO article should reference current company name",
        status: "warning",
        summary: `${ceoName}'s article may not prominently reference ${companyName}.`,
        whyItMatters:
          "Executive profiles without clear employer context look incomplete in knowledge panels.",
        howToFix: `Lead with current role at [[${company.title}]] and ensure infobox employer fields match the company article naming.`,
        impact: "medium",
        effort: "low",
      })
    );
  }

  const companyStale = daysSince(company.lastEdited) ?? 0;
  const ceoStale = daysSince(ceo.lastEdited) ?? 0;
  if (Math.abs(companyStale - ceoStale) > 90) {
    findings.push(
      makeFinding({
        id: "cross-edit-parity",
        page: "cross",
        section: "Governance",
        title: "Company and CEO pages edited on different cadences",
        status: "warning",
        summary: `Company page updated ${companyStale} days ago; CEO page ${ceoStale} days ago.`,
        whyItMatters:
          "Mismatched freshness signals disorganized reputation management during news events.",
        howToFix:
          "Establish a quarterly Wikipedia review calendar that updates both articles after earnings, major regulatory news, and leadership announcements.",
        impact: "medium",
        effort: "low",
      })
    );
  }

  return findings;
}

function buildRoadmap(findings: WikipediaFinding[]): WikipediaRoadmapItem[] {
  const actionable = findings.filter((finding) => finding.status !== "good");
  const high = actionable.filter((finding) => finding.impact === "high");
  const medium = actionable.filter((finding) => finding.impact === "medium");
  const low = actionable.filter((finding) => finding.impact === "low");

  return [
    {
      timeframe: "30-day",
      title: "Urgent fixes & maintenance",
      tasks: high.slice(0, 4).map((finding) => finding.howToFix),
    },
    {
      timeframe: "60-day",
      title: "Structural & cross-link improvements",
      tasks: medium.slice(0, 4).map((finding) => finding.howToFix),
    },
    {
      timeframe: "90-day",
      title: "Sustained reputation hygiene",
      tasks: [
        ...low.slice(0, 2).map((finding) => finding.howToFix),
        "Review both articles after each earnings cycle and major congress (ASCO, ESMO, EHA).",
        "Monitor article talk pages for editor concerns before they become maintenance banners.",
      ],
    },
  ];
}

function buildExecutiveSummary(
  company: WikipediaPageSnapshot,
  ceo: WikipediaPageSnapshot,
  findings: WikipediaFinding[],
  companyName: string,
  ceoName: string
): string {
  const critical = findings.filter((finding) => finding.status === "critical").length;
  const warning = findings.filter((finding) => finding.status === "warning").length;

  if (!company.exists && !ceo.exists) {
    return `Neither ${companyName} nor ${ceoName} resolved to live Wikipedia articles. Reputation governance should start with notability assessment and neutral, well-sourced drafts.`;
  }

  const maintenance =
    [...company.maintenanceFlags, ...ceo.maintenanceFlags].join(", ") ||
    "none";

  return `${companyName}'s Wikipedia article scores ${company.score}/100 (${company.status}); ${ceoName}'s biography scores ${ceo.score}/100 (${ceo.status}). The audit surfaced ${critical} critical and ${warning} warning items — including maintenance flags (${maintenance}). Priority actions focus on verifiable updates, rebrand consistency, and aligning public milestones from your social channels with cited, neutral Wikipedia prose.`;
}

export async function auditWikipediaPages(
  request: WikipediaAuditRequest = {}
): Promise<WikipediaAuditResponse> {
  const started = Date.now();
  const config = getWikipediaConfig();

  const companyQuery = request.companyPage ?? config.companyPage;
  const ceoQuery = request.ceoPage ?? config.ceoPage;
  const companyName = request.companyName ?? config.companyName;
  const ceoName = request.ceoName ?? config.ceoName;

  const [companyRaw, ceoRaw, narrativeSignals] = await Promise.all([
    fetchWikipediaArticle(companyQuery),
    fetchWikipediaArticle(ceoQuery),
    getNarrativeSignals(),
  ]);

  const company = buildPageSnapshot(companyRaw, "company", config);
  const ceo = buildPageSnapshot(ceoRaw, "ceo", config);

  const findings = [
    ...buildCompanyFindings(company, ceoName, narrativeSignals, config),
    ...buildCeoFindings(ceo, companyName, config),
    ...buildCrossFindings(company, ceo, ceoName, companyName),
  ].sort((a, b) => priorityScore(b) - priorityScore(a));

  const overallScore = clampScore(
    company.exists && ceo.exists
      ? company.score * 0.6 + ceo.score * 0.4
      : company.exists
        ? company.score
        : ceo.score
  );

  return {
    companyName,
    ceoName,
    auditedAt: new Date().toISOString(),
    responseTimeMs: Date.now() - started,
    overallScore,
    executiveSummary: buildExecutiveSummary(
      company,
      ceo,
      findings,
      companyName,
      ceoName
    ),
    company,
    ceo,
    topPriorities: findings.slice(0, 5),
    findings,
    roadmap: buildRoadmap(findings),
    narrativeSignals,
  };
}

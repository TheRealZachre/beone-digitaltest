import type { WebsiteAuditResponse } from "./types";

export function formatAuditForExport(result: WebsiteAuditResponse): string {
  const lines = [
    "=== WEBSITE SEO AUDIT REPORT ===",
    "",
    `Domain: ${result.domain}`,
    `URL: ${result.url}`,
    `Audited: ${new Date(result.auditedAt).toLocaleString()}`,
    `Overall score: ${result.overallScore}/100`,
    "",
    "EXECUTIVE SUMMARY",
    result.executiveSummary,
    "",
    "TOP 5 PRIORITIES",
    ...result.topPriorities.map(
      (f, i) =>
        `${i + 1}. [${f.impact.toUpperCase()} impact / ${f.effort} effort] ${f.title}\n   Fix: ${f.howToFix}`
    ),
    "",
    "SECTION SCORES",
    ...result.sections.map(
      (s) => `- ${s.label}: ${s.score}/100`
    ),
    "",
    "PRIORITY MATRIX",
    ...result.priorityMatrix.map(
      (f) =>
        `- ${f.title} (${f.impact} impact, ${f.effort} effort): ${f.howToFix}`
    ),
    "",
    "RANKING SNAPSHOT",
    ...result.rankingSnapshot.map(
      (r) =>
        `- "${r.keyword}": Google #${r.google}, Bing #${r.bing}, Yahoo #${r.yahoo}`
    ),
    "",
    "30/60/90 ROADMAP",
    ...result.roadmap.flatMap((phase) => [
      `${phase.timeframe.toUpperCase()} — ${phase.title}`,
      ...phase.tasks.map((t) => `  • ${t}`),
      "",
    ]),
  ];

  if (result.competitor) {
    lines.push(
      "COMPETITOR COMPARISON",
      `Domain: ${result.competitor.domain} (score ${result.competitor.overallScore})`,
      ...result.competitor.highlights.map((h) => `- ${h}`),
      ""
    );
  }

  return lines.join("\n");
}

import type { WikipediaAuditResponse } from "./types";

export function formatWikipediaAuditForExport(
  result: WikipediaAuditResponse
): string {
  const lines: string[] = [
    `Wikipedia Reputation Audit — ${result.companyName}`,
    `CEO: ${result.ceoName}`,
    `Audited: ${new Date(result.auditedAt).toLocaleString()}`,
    `Overall score: ${result.overallScore}/100`,
    "",
    "EXECUTIVE SUMMARY",
    result.executiveSummary,
    "",
    `COMPANY PAGE (${result.company.score}/100)`,
    result.company.url,
    `Last edited: ${result.company.lastEdited ?? "unknown"}`,
    `References: ${result.company.referenceCount}`,
    `Sections: ${result.company.sections.join(", ") || "none"}`,
    "",
    `CEO PAGE (${result.ceo.score}/100)`,
    result.ceo.url,
    `Last edited: ${result.ceo.lastEdited ?? "unknown"}`,
    `References: ${result.ceo.referenceCount}`,
    "",
    "TOP PRIORITIES",
    ...result.topPriorities.map(
      (finding, index) =>
        `${index + 1}. [${finding.impact}] ${finding.title}\n   ${finding.howToFix}`
    ),
    "",
    "FULL FINDINGS",
    ...result.findings.map(
      (finding) =>
        `- [${finding.page}/${finding.status}] ${finding.title}: ${finding.summary}\n  Fix: ${finding.howToFix}`
    ),
    "",
    "ROADMAP",
    ...result.roadmap.flatMap((item) => [
      `${item.timeframe.toUpperCase()} — ${item.title}`,
      ...item.tasks.map((task) => `  • ${task}`),
    ]),
  ];

  if (result.narrativeSignals.length > 0) {
    lines.push("", "NARRATIVE SIGNALS FROM SOCIAL CHANNELS", ...result.narrativeSignals);
  }

  return lines.join("\n");
}

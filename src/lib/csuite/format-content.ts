import type { GeneratedExecutiveContent } from "./types";

export function formatGeneratedContentForExport(
  result: GeneratedExecutiveContent
): string {
  return [
    "=== C-SUITE CONTENT PACKAGE ===",
    "",
    `Executive: ${result.executiveName}`,
    `Theme: ${result.theme.title}`,
    `Generated: ${new Date(result.generatedAt).toLocaleString()}`,
    `Source: ${result.sourceSummary}`,
    "",
    "--- LINKEDIN POST ---",
    result.linkedinPost.content,
    "",
    "--- LINKEDIN ARTICLE ---",
    result.linkedinArticle.content,
    "",
    "--- X / TWITTER ---",
    result.xPost.content,
    "",
    "--- VISUAL SUGGESTIONS ---",
    ...result.visualSuggestions.map((v) => `• [${v.type}] ${v.description}`),
  ].join("\n");
}

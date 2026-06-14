import type { SeoPackage, VideoAnalyzeResponse } from "./types";

export function formatSeoPackageForExport(result: VideoAnalyzeResponse): string {
  const { generated } = result;
  const chapters = generated.chapterMarkers
    .map((c) => `${c.time} ${c.title}`)
    .join("\n");

  return [
    "=== YOUTUBE SEO PACKAGE ===",
    "",
    "TITLE:",
    generated.title,
    `(${generated.titleCharCount} characters)`,
    "",
    "DESCRIPTION:",
    generated.description,
    "",
    "TAGS:",
    generated.tags.join(", "),
    "",
    "THUMBNAIL OVERLAYS:",
    ...generated.thumbnailOverlays.map((t) => `• ${t}`),
    "",
    "CHAPTER MARKERS:",
    chapters,
    "",
    "END SCREEN SUGGESTIONS:",
    ...generated.endScreenSuggestions.map((t) => `• ${t}`),
    "",
    result.keywords.length > 0
      ? `KEYWORDS: ${result.keywords.join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatTagsForStudio(tags: string[]): string {
  return tags.join(", ");
}

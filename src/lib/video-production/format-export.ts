import type { VideoProductionPackage } from "./types";

export function formatVideoProductionForExport(
  pkg: VideoProductionPackage
): string {
  const lines = [
    `${pkg.productName} — Video Production Package`,
    `Topic: ${pkg.topic}`,
    `Generated: ${new Date(pkg.generatedAt).toLocaleString()}`,
    "",
    "SCRIPT",
    `Title: ${pkg.script.title}`,
    `Duration: ~${pkg.script.estimatedDurationMinutes} min`,
    "",
    ...pkg.script.sections.flatMap((section) => [
      `[${section.label}] (${section.durationSeconds}s)`,
      section.narration,
      section.bRoll ? `B-roll: ${section.bRoll}` : "",
      section.lowerThird ? `Lower third: ${section.lowerThird}` : "",
      "",
    ]),
    "YOUTUBE SEO",
    `Title: ${pkg.youtubeSeo.title}`,
    `Tags: ${pkg.youtubeSeo.tags.join(", ")}`,
    pkg.youtubeSeo.description,
    "",
    "PLATFORM CLIPS",
    ...pkg.platformClips.map(
      (clip) =>
        `${clip.platform} (${clip.aspectRatio}, ${clip.lengthSeconds}s)\n${clip.caption}\n${clip.publishNotes}`
    ),
    "",
    "SCHEDULE",
    ...pkg.schedule.map(
      (item) =>
        `${item.platform}: ${new Date(item.scheduledAt).toLocaleString()} — ${item.status}`
    ),
  ];

  return lines.join("\n");
}

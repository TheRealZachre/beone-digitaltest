import type { VoiceDraftResult, VoiceProfile } from "./types";

export function formatVoiceProfileForExport(profile: VoiceProfile): string {
  return [
    `Voice Profile — ${profile.executiveName}`,
    profile.title,
    `Trained: ${new Date(profile.trainedAt).toLocaleString()}`,
    `Authenticity: ${profile.metrics.authenticityScore}/100`,
    "",
    profile.voiceSummary,
    "",
    "METRICS",
    `Posts analyzed: ${profile.metrics.postsAnalyzed}`,
    `Avg words/sentence: ${profile.metrics.avgWordsPerSentence}`,
    `First-person rate: ${profile.metrics.firstPersonRate}%`,
    "",
    "SIGNATURES",
    ...profile.signatures.map(
      (sig) => `${sig.label}: ${sig.examples.join(" | ")}`
    ),
    "",
    "PREFERRED PHRASES",
    ...profile.preferredPhrases,
    "",
    "AVOID",
    ...profile.avoidPhrases,
  ].join("\n");
}

export function formatVoiceDraftForExport(draft: VoiceDraftResult): string {
  return [
    `Voice Draft — ${draft.executiveName}`,
    `Topic: ${draft.topic}`,
    `Format: ${draft.format}`,
    "",
    draft.content,
    "",
    "Voice match notes:",
    ...draft.voiceMatchNotes.map((note) => `• ${note}`),
  ].join("\n");
}

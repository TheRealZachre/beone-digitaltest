import { getExecutiveById } from "@/lib/csuite/executives";
import { EXECUTIVE_PUBLISHED_POSTS } from "@/lib/csuite/executive-posts";
import type { ExecutivePublishedPost } from "@/lib/csuite/types";
import { GHOSTWRITTEN_MARKERS } from "./content";
import type { VoiceAntiPattern, VoiceMetrics, VoiceProfile, VoiceSignature } from "./types";

const CORPORATE_JARGON = [
  ...GHOSTWRITTEN_MARKERS,
  "proud to",
  "delighted to",
  "innovative solutions",
  "cutting-edge",
  "world-class",
  "leading provider",
];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
}

function countMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce(
    (sum, pattern) => sum + (text.match(pattern)?.length ?? 0),
    0
  );
}

function buildMetrics(posts: ExecutivePublishedPost[]): VoiceMetrics {
  const allText = posts.map((p) => p.content).join(" ");
  const allSentences = posts.flatMap((p) => sentences(p.content));
  const wordsInSentences = allSentences.map((s) => wordCount(s));
  const avgWordsPerSentence =
    wordsInSentences.length > 0
      ? Math.round(
          wordsInSentences.reduce((a, b) => a + b, 0) / wordsInSentences.length
        )
      : 18;

  const totalWords = wordCount(allText);
  const firstPersonMatches = allText.match(/\b(I|my|we|our)\b/gi)?.length ?? 0;
  const questionMatches = allText.match(/\?/g)?.length ?? 0;
  const dataRefs = countMatches(allText, [
    /\b\d+%/g,
    /\b\d+-month/gi,
    /\bdata\b/gi,
    /\bevidence\b/gi,
    /\btrial\b/gi,
    /\bphase\b/gi,
  ]);

  let jargonHits = 0;
  for (const term of CORPORATE_JARGON) {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    jargonHits += allText.match(regex)?.length ?? 0;
  }

  const authenticityScore = Math.max(
    35,
    Math.min(98, 92 - jargonHits * 6 + firstPersonMatches * 2)
  );

  return {
    postsAnalyzed: posts.length,
    avgWordsPerSentence: avgWordsPerSentence,
    avgPostLength: posts.length
      ? Math.round(totalWords / posts.length)
      : 0,
    firstPersonRate:
      totalWords > 0
        ? Math.round((firstPersonMatches / totalWords) * 1000) / 10
        : 0,
    questionRate:
      posts.length > 0
        ? Math.round((questionMatches / posts.length) * 100) / 100
        : 0,
    dataReferenceRate:
      posts.length > 0 ? Math.round((dataRefs / posts.length) * 10) / 10 : 0,
    authenticityScore: Math.round(authenticityScore),
  };
}

function buildSignatures(
  posts: ExecutivePublishedPost[],
  preferredPhrases: string[]
): VoiceSignature[] {
  const openers = posts
    .map((p) => sentences(p.content)[0] ?? p.content.slice(0, 80))
    .filter(Boolean);

  const signatures: VoiceSignature[] = [
    {
      label: "Opener pattern",
      examples: [...new Set(openers)].slice(0, 3),
      strength: "high",
    },
  ];

  if (preferredPhrases.length > 0) {
    signatures.push({
      label: "Signature phrases",
      examples: preferredPhrases.slice(0, 4),
      strength: "high",
    });
  }

  const patientLens = posts.filter((p) =>
    /patient|clinician|physician|care team/i.test(p.content)
  );
  if (patientLens.length >= 2) {
    signatures.push({
      label: "Patient/clinician lens",
      examples: patientLens.map((p) => p.content.slice(0, 90)).slice(0, 2),
      strength: "medium",
    });
  }

  const policyOrAccess = posts.filter((p) =>
    /access|policy|payer|global/i.test(p.content)
  );
  if (policyOrAccess.length >= 1) {
    signatures.push({
      label: "Systems-thinking",
      examples: policyOrAccess.map((p) => p.content.slice(0, 90)).slice(0, 2),
      strength: "medium",
    });
  }

  return signatures;
}

function buildAntiPatterns(posts: ExecutivePublishedPost[]): VoiceAntiPattern[] {
  const combined = posts.map((p) => p.content).join(" ");
  const results: VoiceAntiPattern[] = [];

  for (const phrase of GHOSTWRITTEN_MARKERS) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const count = combined.match(regex)?.length ?? 0;
    if (count > 0) {
      results.push({
        phrase,
        reason: "Reads as corporate comms — not this executive's natural voice",
        detectedInPosts: count,
      });
    }
  }

  return results.slice(0, 5);
}

function buildVoiceSummary(
  name: string,
  metrics: VoiceMetrics,
  styles: string[]
): string {
  const styleLabel = styles.join(" + ");
  return `${name}'s voice profile is trained on ${metrics.postsAnalyzed} posts. Writing reads ${styleLabel} with ~${metrics.avgWordsPerSentence}-word sentences, ${metrics.firstPersonRate}% first-person usage, and an authenticity score of ${metrics.authenticityScore}/100. Drafts should mirror their opener rhythm and signature phrases — not generic announcement copy.`;
}

export function trainVoiceProfile(executiveId: string): VoiceProfile {
  const executive = getExecutiveById(executiveId);
  if (!executive) {
    throw new Error(`Executive not found: ${executiveId}`);
  }

  const posts = EXECUTIVE_PUBLISHED_POSTS.filter(
    (post) => post.executiveId === executiveId
  );

  if (posts.length === 0) {
    throw new Error(`No published posts found for ${executive.name}`);
  }

  const metrics = buildMetrics(posts);
  const sampleOpeners = [
    ...new Set(posts.map((p) => sentences(p.content)[0]).filter(Boolean)),
  ].slice(0, 4) as string[];

  const antiPatterns = buildAntiPatterns(posts);

  return {
    executiveId: executive.id,
    executiveName: executive.name,
    title: executive.title,
    trainedAt: new Date().toISOString(),
    writingStyles: executive.writingStyles,
    metrics,
    signatures: buildSignatures(posts, executive.usePhrases),
    sampleOpeners,
    preferredPhrases: executive.usePhrases,
    avoidPhrases: [
      ...new Set([...executive.avoidPhrases, ...GHOSTWRITTEN_MARKERS]),
    ],
    antiPatterns,
    voiceSummary: buildVoiceSummary(
      executive.name,
      metrics,
      executive.writingStyles
    ),
    trainingSources: [
      ...new Set(posts.map((p) => `${p.platform} ${p.contentType}`)),
    ],
  };
}

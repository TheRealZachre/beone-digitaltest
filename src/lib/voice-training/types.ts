import type { WritingStyle } from "@/lib/csuite/types";

export interface VoiceSignature {
  label: string;
  examples: string[];
  strength: "high" | "medium";
}

export interface VoiceAntiPattern {
  phrase: string;
  reason: string;
  detectedInPosts: number;
}

export interface VoiceMetrics {
  postsAnalyzed: number;
  avgWordsPerSentence: number;
  avgPostLength: number;
  firstPersonRate: number;
  questionRate: number;
  dataReferenceRate: number;
  authenticityScore: number;
}

export interface VoiceProfile {
  executiveId: string;
  executiveName: string;
  title: string;
  trainedAt: string;
  writingStyles: WritingStyle[];
  metrics: VoiceMetrics;
  signatures: VoiceSignature[];
  sampleOpeners: string[];
  preferredPhrases: string[];
  avoidPhrases: string[];
  antiPatterns: VoiceAntiPattern[];
  voiceSummary: string;
  trainingSources: string[];
}

export interface VoiceDraftRequest {
  executiveId: string;
  topic: string;
  keyPoint?: string;
  format?: "linkedin-post" | "linkedin-article" | "x-post";
  audience?: string;
}

export interface VoiceDraftResult {
  executiveId: string;
  executiveName: string;
  topic: string;
  format: VoiceDraftRequest["format"];
  generatedAt: string;
  content: string;
  charCount: number;
  voiceMatchNotes: string[];
  avoidedPhrases: string[];
  signaturesUsed: string[];
}

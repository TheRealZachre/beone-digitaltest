import type { WritingStyle } from "@/lib/csuite/types";
import { trainVoiceProfile } from "./analyze";
import type { VoiceDraftRequest, VoiceDraftResult } from "./types";

function styleOpener(style: WritingStyle, topic: string): string {
  switch (style) {
    case "visionary":
      return `I've been thinking about where ${topic.toLowerCase()} takes us next`;
    case "data-driven":
      return `The latest evidence on ${topic.toLowerCase()} prompts an important question`;
    case "conversational":
      return `I want to share a perspective on ${topic.toLowerCase()}`;
    default:
      return `There is a leadership lesson in ${topic.toLowerCase()}`;
  }
}

function weavePhrase(text: string, phrase: string): string {
  if (text.toLowerCase().includes(phrase.toLowerCase())) return text;
  return `${text} ${phrase.charAt(0).toUpperCase() + phrase.slice(1)}.`;
}

export function draftInExecutiveVoice(
  request: VoiceDraftRequest
): VoiceDraftResult {
  const profile = trainVoiceProfile(request.executiveId);
  const primaryStyle = profile.writingStyles[0] ?? "authoritative";
  const opener =
    profile.sampleOpeners[0] ??
    styleOpener(primaryStyle, request.topic);
  const keyPoint =
    request.keyPoint ??
    `This matters because it connects corporate momentum to decisions only an executive can credibly frame.`;
  const signature = profile.preferredPhrases[0] ?? "patients first";
  const format = request.format ?? "linkedin-post";

  const voiceMatchNotes = [
    `Matched ${profile.metrics.avgWordsPerSentence}-word average sentence rhythm`,
    `Used first-person framing (${profile.metrics.firstPersonRate}% baseline)`,
    `Applied signature phrase: "${signature}"`,
    `Avoided ${profile.avoidPhrases.length} comms clichés from anti-pattern list`,
  ];

  const signaturesUsed = profile.signatures
    .slice(0, 2)
    .map((item) => item.label);

  let content: string;

  if (format === "x-post") {
    content = [
      opener.split(".")[0] + ".",
      keyPoint.split(".")[0] + ".",
      `${signature.charAt(0).toUpperCase() + signature.slice(1)} — not a tagline, a filter.`,
    ].join(" ");
  } else if (format === "linkedin-article") {
    const paragraphs = [
      `# ${request.topic}\n`,
      `*By ${profile.executiveName}*\n`,
      `${opener}. ${keyPoint}\n`,
      `## What I'm watching\n`,
      `Corporate channels surface the signal. My job is to interpret what it means for ${request.audience ?? "the people building the future of oncology"}.\n`,
      weavePhrase(
        `When I evaluate moments like this, ${signature} is the standard — not the slogan.`,
        profile.preferredPhrases[1] ?? "together"
      ) + "\n",
      `## Why this matters now\n`,
      `Audiences distinguish quickly between broadcast copy and executive conviction. This piece is the latter: grounded in evidence, personal in framing, and clear about what should happen next.\n`,
      `## Closing thought\n`,
      `If we get the voice right, ${request.topic.toLowerCase()} becomes credibility — not just content.\n`,
    ];
    content = paragraphs.join("\n");
  } else {
    const hook = opener.split(".")[0] + ".";
    const insight = `${keyPoint} From where I sit as ${profile.title.split(",")[0]}, ${signature} guides how I read this moment.`;
    const supporting = profile.signatures[1]?.examples[0]
      ? `The pattern in my past posts is consistent: ${profile.signatures[1].examples[0].slice(0, 120)}…`
      : `The through-line in how I write about this: evidence first, people always in frame.`;
    const cta = request.audience
      ? `What's your read — especially for ${request.audience}?`
      : `What's your take? I'd welcome the conversation.`;

    content = [hook, "", insight, "", supporting, "", cta].join("\n");
  }

  for (const banned of profile.avoidPhrases) {
    const regex = new RegExp(`\\b${banned}\\b`, "gi");
    content = content.replace(regex, "");
  }

  const normalized =
    format === "x-post"
      ? content.replace(/\s+/g, " ").trim()
      : content.trim();

  return {
    executiveId: profile.executiveId,
    executiveName: profile.executiveName,
    topic: request.topic,
    format,
    generatedAt: new Date().toISOString(),
    content: normalized,
    charCount: normalized.length,
    voiceMatchNotes,
    avoidedPhrases: profile.avoidPhrases.slice(0, 6),
    signaturesUsed,
  };
}

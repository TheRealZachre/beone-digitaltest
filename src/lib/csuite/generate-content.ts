import type { ExecutiveProfile, CorporateTheme, GeneratedExecutiveContent, PlatformContent, VisualSuggestion } from "./types";
import { getExecutiveById } from "./executives";

function pickPhrase(profile: ExecutiveProfile): string {
  return profile.usePhrases[0] ?? "what matters most";
}

function styleOpener(profile: ExecutiveProfile): string {
  const primary = profile.writingStyles[0];
  switch (primary) {
    case "visionary":
      return "I've been thinking about where our industry is headed";
    case "data-driven":
      return "The latest evidence prompts an important question";
    case "conversational":
      return "I want to share something that's been on my mind";
    default:
      return "There is a leadership lesson in our latest corporate narrative";
  }
}

function audienceHook(profile: ExecutiveProfile): string {
  const audience = profile.targetAudiences[0];
  switch (audience) {
    case "policymakers":
      return "For anyone shaping access and health policy";
    case "press":
      return "A perspective I hope journalists and analysts will find useful";
    case "employees":
      return "To everyone carrying our mission forward every day";
    case "prospects":
      return "For partners evaluating how we show up in the market";
    case "investors":
      return "For investors tracking our long-term oncology strategy";
    default:
      return "For my peers leading science-driven organizations";
  }
}

function buildLinkedInPost(
  profile: ExecutiveProfile,
  theme: CorporateTheme
): PlatformContent {
  const hook = `${styleOpener(profile)} — and it starts with ${theme.storyBeat.toLowerCase()}.`;
  const insight = `Our corporate channels have been elevating a narrative around ${theme.narrative.toLowerCase()}. From where I sit as ${profile.title}, ${pickPhrase(profile)} is not a tagline — it's the filter for how we interpret this moment.`;
  const supporting = `The theme of ${theme.storyBeat} shows up because it reflects what stakeholders expect from us: credibility, empathy, and progress they can trace. ${audienceHook(profile)}: the opportunity is to connect corporate momentum to a point of view only an executive can credibly offer.`;
  const cta = `What's your take — are we meeting the moment on ${profile.passionTopics[0] ?? "this topic"}? I'd welcome the conversation in the comments.`;

  const content = [hook, "", insight, "", supporting, "", cta].join("\n");

  return {
    platform: "linkedin-post",
    label: "LinkedIn Post",
    content,
    charCount: content.length,
    structure: ["Hook", "Executive insight", "Supporting point", "CTA"],
  };
}

function buildLinkedInArticle(
  profile: ExecutiveProfile,
  theme: CorporateTheme
): PlatformContent {
  const paragraphs = [
    `# ${theme.suggestedAngles[0] ?? theme.title}\n`,
    `*By ${profile.name}, ${profile.title}*\n`,
    `${audienceHook(profile)}, I've watched our organization's public narrative evolve around ${theme.storyBeat}. Corporate social channels recently highlighted: ${theme.narrative}. As an executive, my job is not to repeat those messages — but to interpret what they mean for patients, partners, and the people building the future of ${profile.passionTopics[0] ?? "our field"}.\n`,
    `## Why this theme matters now\n`,
    `In periods of intense news flow, audiences distinguish quickly between corporate broadcast and executive conviction. ${pickPhrase(profile)} — that phrase guides how I evaluate whether we are leading with clarity or merely adding volume. The ${theme.storyBeat} narrative earns attention because it sits at the intersection of relevance and responsibility.\n`,
    `## What I've seen firsthand\n`,
    `Across ${profile.passionTopics.slice(0, 3).join(", ")}, the through-line is consistent: stakeholders reward authenticity backed by evidence. When our corporate content surfaces themes like "${theme.title}", I ask three questions: Does it advance patient impact? Does it reflect scientific integrity? Does it invite meaningful dialogue?\n`,
    `## Implications for leaders\n`,
    `Executives who merely redistribute corporate posts miss the chance to build trust. The stronger move is to reframe corporate momentum through personal expertise — acknowledging the team, citing the data, and naming the tradeoffs. That is how thought leadership compounds.\n`,
    `## A practical path forward\n`,
    `1. Anchor every piece in a single executive insight, not a press release recap.\n2. Name the audience you are speaking to and the decision you want to inform.\n3. Close with a question that signals humility and invites response.\n`,
    `## Closing thought\n`,
    `Corporate channels create the signal. Executive voice creates the meaning. If we get that sequencing right, ${theme.storyBeat.toLowerCase()} becomes more than content — it becomes credibility.\n`,
    `---\n*${profile.bio}*`,
  ];

  const content = paragraphs.join("\n");

  return {
    platform: "linkedin-article",
    label: "LinkedIn Article",
    content,
    charCount: content.length,
    structure: [
      "Headline & byline",
      "Executive framing",
      "Why it matters",
      "Personal lens",
      "Leader implications",
      "Action steps",
      "Close",
    ],
  };
}

function buildXPost(profile: ExecutiveProfile, theme: CorporateTheme): PlatformContent {
  const lines = [
    `${theme.storyBeat} is having a moment in our corporate narrative.`,
    "",
    `My take as ${profile.title.split(" ").slice(-2).join(" ")}:`,
    `${theme.suggestedAngles[0] ?? "Leadership means translating signal into substance."}`,
    "",
    `${pickPhrase(profile)} — not as slogan, as standard.`,
    "",
    "Agree? Push back? Reply with what you're seeing.",
  ];

  const content = lines.join("\n");

  return {
    platform: "x-post",
    label: "X / Twitter Post",
    content,
    charCount: content.length,
    structure: ["Hook", "Executive take", "Signature phrase", "Engagement prompt"],
  };
}

function buildVisualSuggestions(
  profile: ExecutiveProfile,
  theme: CorporateTheme
): VisualSuggestion[] {
  return [
    {
      type: "chart",
      description: `Engagement trend for ${theme.storyBeat} corporate posts (${theme.engagementScore}% avg ER).`,
    },
    {
      type: "quote-card",
      description: `Pull-quote: "${pickPhrase(profile)}" over brand imagery.`,
    },
    {
      type: "infographic",
      description: `3-bullet framework: corporate signal → executive insight → audience action.`,
    },
    {
      type: "photo",
      description: `Executive headshot or conference still aligned with ${profile.passionTopics[0]}.`,
    },
  ];
}

function applyVoiceOverrides(
  base: ExecutiveProfile,
  overrides?: Partial<ExecutiveProfile>
): ExecutiveProfile {
  if (!overrides) return base;
  return {
    ...base,
    writingStyles: overrides.writingStyles ?? base.writingStyles,
    passionTopics: overrides.passionTopics ?? base.passionTopics,
    usePhrases: overrides.usePhrases ?? base.usePhrases,
    avoidPhrases: overrides.avoidPhrases ?? base.avoidPhrases,
    targetAudiences: overrides.targetAudiences ?? base.targetAudiences,
  };
}

export function generateExecutiveContent(
  executiveId: string,
  theme: CorporateTheme,
  voiceOverrides?: Partial<ExecutiveProfile>
): GeneratedExecutiveContent {
  const base = getExecutiveById(executiveId);
  if (!base) throw new Error("Executive not found.");

  const profile = applyVoiceOverrides(base, voiceOverrides);
  const linkedinPost = buildLinkedInPost(profile, theme);
  const linkedinArticle = buildLinkedInArticle(profile, theme);
  const xPost = buildXPost(profile, theme);

  return {
    executiveId: profile.id,
    executiveName: profile.name,
    theme,
    generatedAt: new Date().toISOString(),
    linkedinPost,
    linkedinArticle,
    xPost,
    platformVariations: [
      {
        platform: "LinkedIn Post",
        note: `${linkedinPost.charCount} chars · ${profile.writingStyles.join(" + ")} tone · CTA optimized for comments`,
      },
      {
        platform: "LinkedIn Article",
        note: `${linkedinArticle.charCount} chars · long-form thought leadership with section headers`,
      },
      {
        platform: "X / Twitter",
        note: `${xPost.charCount} chars · punchy, reply-driven format`,
      },
    ],
    visualSuggestions: buildVisualSuggestions(profile, theme),
    sourceSummary: `Generated from ${theme.sourcePostIds.length} corporate post(s) · ${theme.storyBeat} · ${theme.engagementScore}% avg engagement`,
  };
}

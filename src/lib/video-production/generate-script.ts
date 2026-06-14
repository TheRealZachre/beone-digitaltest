import { getVideoProductionConfig } from "./config";
import type {
  ScriptSection,
  VideoAudience,
  VideoProductionRequest,
  VideoScript,
} from "./types";

function audienceTone(audience: VideoAudience): {
  opener: string;
  voice: string;
  cta: string;
} {
  switch (audience) {
    case "patients":
      return {
        opener: "If you or someone you love is navigating a cancer diagnosis",
        voice: "empathetic, plain-language, hope-forward",
        cta: "Talk with your care team about whether this treatment path may be right for you.",
      };
    case "healthcare-professionals":
      return {
        opener: "For clinicians following the latest oncology developments",
        voice: "evidence-led, precise, congress-ready",
        cta: "Review the full data set and prescribing information on our hub.",
      };
    case "investors":
      return {
        opener: "For investors tracking our pipeline momentum",
        voice: "material-news, milestone-focused, forward-looking",
        cta: "Read the full update on our investor relations hub.",
      };
    case "employees":
      return {
        opener: "To everyone carrying our mission forward",
        voice: "purpose-driven, inclusive, proud-but-grounded",
        cta: "Share this story with a colleague who helped make it possible.",
      };
    default:
      return {
        opener: "Cancer touches every community",
        voice: "accessible, credible, human",
        cta: "Watch the full story on YouTube and follow our channels for more.",
      };
  }
}

function buildSections(
  topic: string,
  keyMessages: string[],
  audience: VideoAudience,
  minutes: number
): ScriptSection[] {
  const tone = audienceTone(audience);
  const brand = getVideoProductionConfig().defaultBrand;
  const messages = keyMessages.length > 0 ? keyMessages : [topic];

  const introSeconds = Math.min(45, Math.round(minutes * 60 * 0.12));
  const contextSeconds = Math.round(minutes * 60 * 0.28);
  const proofSeconds = Math.round(minutes * 60 * 0.35);
  const closeSeconds = Math.max(30, Math.round(minutes * 60 * 0.15));

  return [
    {
      id: "intro",
      label: "Cold open & hook",
      durationSeconds: introSeconds,
      narration: `${tone.opener}, this moment matters. ${messages[0]}. At ${brand}, we believe science only counts when it reaches the people who need it.`,
      bRoll: "Patient community montage · lab research · global sites map",
      lowerThird: `${brand} · ${topic}`,
    },
    {
      id: "context",
      label: "Context & key message 1",
      durationSeconds: contextSeconds,
      narration: `Here is what is changing. ${messages[0]} ${messages[1] ? `And critically: ${messages[1]}.` : ""} We are not narrating hope in the abstract — we are showing the work behind it.`,
      bRoll: "Clinical timeline graphic · investigator interview cutaway",
      lowerThird: "Why this matters now",
    },
    {
      id: "proof",
      label: "Evidence & key messages",
      durationSeconds: proofSeconds,
      narration: messages
        .slice(0, 3)
        .map((message, index) => `Point ${index + 1}: ${message}`)
        .join(" "),
      bRoll: "Data visualization · congress footage · manufacturing B-roll",
      lowerThird: "What the data show",
    },
    {
      id: "human",
      label: "Human story beat",
      durationSeconds: Math.round(minutes * 60 * 0.12),
      narration:
        "Behind every dataset is a person waiting for answers. Our teams work so those answers arrive faster, with more clarity, and with more access.",
      bRoll: "Patient story silhouette · caregiver moment · nurse consultation",
    },
    {
      id: "close",
      label: "Close & CTA",
      durationSeconds: closeSeconds,
      narration: `${tone.cta} This is how ${brand} shows up when the world is watching — with rigor, with empathy, and with a clear next step.`,
      bRoll: "Branded outro animation · logo end card",
      lowerThird: "Watch the full video · Link in description",
    },
  ];
}

export function generateVideoScript(request: VideoProductionRequest): VideoScript {
  const minutes = request.targetLengthMinutes ?? 6;
  const tone = audienceTone(request.audience);
  const brand = getVideoProductionConfig().defaultBrand;
  const sections = buildSections(
    request.topic,
    request.keyMessages,
    request.audience,
    minutes
  );

  const totalSeconds = sections.reduce(
    (sum, section) => sum + section.durationSeconds,
    0
  );

  return {
    title: `${request.topic} | ${brand}`,
    hook: sections[0]?.narration.split(".")[0] ?? request.topic,
    estimatedDurationMinutes: Math.max(1, Math.round(totalSeconds / 60)),
    sections,
    callToAction: tone.cta,
    disclaimer:
      request.audience === "patients" || request.audience === "general-public"
        ? "This video is for educational purposes and is not medical advice. Always consult your healthcare provider."
        : undefined,
  };
}

import { addDays, addHours, format } from "date-fns";
import { getVideoProductionConfig } from "./config";
import { AUDIENCE_LABELS } from "./config";
import { PLATFORM_DISTRIBUTION } from "./content";
import { generateVideoScript } from "./generate-script";
import type {
  CaptionFile,
  PlatformClip,
  ScheduledPublish,
  ThumbnailOption,
  VideoProductionPackage,
  VideoProductionRequest,
} from "./types";

function buildPlatformClips(
  topic: string,
  hook: string,
  youtubeTitle: string
): PlatformClip[] {
  return PLATFORM_DISTRIBUTION.map((row) => {
    const isYouTube = row.platform === "YouTube";
    const caption = isYouTube
      ? `${topic} — full video with chapters, captions, and links.`
      : `${hook} Watch the full story: ${youtubeTitle}. Link in bio / reply thread.`;

    return {
      platform: row.platform,
      format: row.format,
      lengthSeconds: isYouTube ? 360 : 55,
      purpose: row.purpose,
      aspectRatio: row.aspectRatio as PlatformClip["aspectRatio"],
      caption,
      hashtags: isYouTube
        ? ["oncology", "pharma", "patientsfirst"]
        : ["oncology", "healthnews", "WatchFullVideo"],
      publishNotes: isYouTube
        ? "Publish hub video first. Enable chapters, end-screen cards to clips."
        : `Publish 2–4 hours after YouTube hub. Include UTM-tracked link to hub.`,
    };
  });
}

function buildCaptions(script: ReturnType<typeof generateVideoScript>): CaptionFile[] {
  const lines = script.sections.flatMap((section, sectionIndex) => {
    const start = script.sections
      .slice(0, sectionIndex)
      .reduce((sum, item) => sum + item.durationSeconds, 0);
    const end = start + section.durationSeconds;
    return [
      `${formatTimestamp(start)} --> ${formatTimestamp(end)}`,
      section.narration,
      "",
    ];
  });

  const srtBody = ["1", "00:00:00,000 --> 00:00:05,000", script.hook, "", ...lines].join(
    "\n"
  );

  return [
    {
      format: "SRT",
      language: "en-US",
      preview: srtBody.slice(0, 600) + (srtBody.length > 600 ? "…" : ""),
    },
    {
      format: "VTT",
      language: "en-US",
      preview: "WEBVTT\n\n" + srtBody.replace(/,/g, ".").slice(0, 500) + "…",
    },
  ];
}

function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},000`;
}

function buildSchedule(topic: string): ScheduledPublish[] {
  const hubDate = addDays(new Date(), 2);
  hubDate.setHours(10, 0, 0, 0);

  const platforms = [
    "YouTube",
    "LinkedIn Video",
    "Instagram Reels",
    "Facebook Reels / Video",
    "X / Twitter",
    "TikTok",
  ];

  return platforms.map((platform, index) => ({
    platform,
    scheduledAt: addHours(hubDate, index === 0 ? 0 : index * 2).toISOString(),
    status: index === 0 ? "ready" : "queued",
    assetLabel:
      index === 0
        ? `Full video — ${topic}`
        : `Social clip ${index} — ${platform}`,
  }));
}

export function generateVideoProductionPackage(
  request: VideoProductionRequest
): VideoProductionPackage {
  const config = getVideoProductionConfig();
  const script = generateVideoScript(request);
  const presenterStyle = request.presenterStyle ?? "brand-avatar";
  const spokesperson = request.spokespersonName ?? config.defaultSpokesperson;

  const youtubeTitle = `${request.topic} | ${config.defaultBrand}`;
  const tags = [
    config.defaultBrand,
    request.topic,
    AUDIENCE_LABELS[request.audience],
    "oncology",
    "patients first",
  ].map((tag) => tag.toLowerCase().replace(/\s+/g, ""));

  return {
    id: `vp-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    productName: config.productName,
    topic: request.topic,
    audience: request.audience,
    presenterStyle,
    script,
    presenterNotes: [
      `Presenter mode: ${presenterStyle.replace(/-/g, " ")}`,
      presenterStyle === "executive-clone"
        ? `Custom spokesperson model trained on approved ${spokesperson} footage and voice samples.`
        : "Brand avatar selected from client visual identity library.",
      "Text-to-video render at 1080p master; lip-sync QC pass before assembly.",
      request.brandGuidelines
        ? `Brand guardrails applied: ${request.brandGuidelines.slice(0, 120)}…`
        : "Default brand voice: credible, patient-forward, no superlative claims.",
    ],
    productionChecklist: [
      "Record AI presenter master take from approved script",
      "Assemble B-roll package per scene map",
      "Apply motion graphics template — lower thirds, data callouts, intro/outro",
      "Mix music bed −16 LUFS; sidechain under narration",
      "Export 16:9 master (YouTube/LinkedIn/X) and 9:16 variants (Reels/TikTok)",
      "Generate SRT/VTT captions and burned-in Reels captions",
      "Produce thumbnail A/B variants for YouTube CTR test",
    ],
    platformClips: buildPlatformClips(request.topic, script.hook, youtubeTitle),
    thumbnails: [
      {
        id: "thumb-a",
        label: "Variant A — Clinical authority",
        concept: `Close-up presenter + ${request.topic} headline + ${config.defaultBrand} red frame`,
        abTestVariant: "A",
      },
      {
        id: "thumb-b",
        label: "Variant B — Human story",
        concept: "Patient-forward still + bold question hook + high-contrast typography",
        abTestVariant: "B",
      },
    ],
    captions: buildCaptions(script),
    schedule: buildSchedule(request.topic),
    youtubeSeo: {
      title: youtubeTitle,
      description: [
        `${request.topic} — a ${config.defaultBrand} video for ${AUDIENCE_LABELS[request.audience]}.`,
        "",
        "Chapters:",
        ...script.sections.map(
          (section, index) =>
            `${formatTimestamp(
              script.sections
                .slice(0, index)
                .reduce((sum, item) => sum + item.durationSeconds, 0)
            ).slice(0, 8)} ${section.label}`
        ),
        "",
        script.callToAction,
        script.disclaimer ?? "",
      ].join("\n"),
      tags,
      chapters: script.sections.map((section) => section.label),
    },
  };
}

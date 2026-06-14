export type VideoAudience =
  | "patients"
  | "healthcare-professionals"
  | "investors"
  | "employees"
  | "general-public";

export type PresenterStyle = "brand-avatar" | "executive-clone" | "neutral-host";

export type AspectRatio = "16:9" | "9:16" | "1:1";

export type WorkflowStep = "script" | "presenter" | "production" | "distribution";

export interface VideoProductionRequest {
  topic: string;
  keyMessages: string[];
  audience: VideoAudience;
  brandGuidelines?: string;
  targetLengthMinutes?: number;
  presenterStyle?: PresenterStyle;
  spokespersonName?: string;
  youtubeUrl?: string;
}

export interface ScriptSection {
  id: string;
  label: string;
  durationSeconds: number;
  narration: string;
  bRoll?: string;
  lowerThird?: string;
}

export interface VideoScript {
  title: string;
  hook: string;
  estimatedDurationMinutes: number;
  sections: ScriptSection[];
  callToAction: string;
  disclaimer?: string;
}

export interface PlatformClip {
  platform: string;
  format: string;
  lengthSeconds: number;
  purpose: string;
  aspectRatio: AspectRatio;
  caption: string;
  hashtags: string[];
  publishNotes: string;
}

export interface ThumbnailOption {
  id: string;
  label: string;
  concept: string;
  abTestVariant: "A" | "B";
}

export interface CaptionFile {
  format: "SRT" | "VTT";
  language: string;
  preview: string;
}

export interface ScheduledPublish {
  platform: string;
  scheduledAt: string;
  status: "queued" | "ready";
  assetLabel: string;
}

export interface VideoProductionPackage {
  id: string;
  generatedAt: string;
  productName: string;
  topic: string;
  audience: VideoAudience;
  presenterStyle: PresenterStyle;
  script: VideoScript;
  presenterNotes: string[];
  productionChecklist: string[];
  platformClips: PlatformClip[];
  thumbnails: ThumbnailOption[];
  captions: CaptionFile[];
  schedule: ScheduledPublish[];
  youtubeSeo: {
    title: string;
    description: string;
    tags: string[];
    chapters: string[];
  };
}

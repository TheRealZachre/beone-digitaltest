import { analyzeUploadedVideo } from "@/lib/youtube/generate-seo";
import { MAX_VIDEO_UPLOAD_BYTES, getYouTubeConfig } from "@/lib/youtube/config";
import { transcribeVideoFile } from "@/lib/youtube/transcribe";
import { cleanupWorkDir, saveUploadToDisk } from "@/lib/youtube/upload";
import type { VideoAnalyzeRequest } from "@/lib/youtube/types";

export const maxDuration = 300;

function parseOptionalTags(value: FormDataEntryValue | null): string[] | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseOptionalNumber(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

async function handleVideoUpload(formData: FormData) {
  const video = formData.get("video");
  if (!(video instanceof File)) {
    return Response.json({ error: "A video file is required." }, { status: 400 });
  }

  if (video.size > MAX_VIDEO_UPLOAD_BYTES) {
    return Response.json(
      {
        error: `Video must be under ${MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024 * 1024)}GB.`,
      },
      { status: 400 }
    );
  }

  let workDir: string | null = null;

  try {
    const saved = await saveUploadToDisk(video);
    workDir = saved.workDir;

    const transcript = await transcribeVideoFile(
      saved.filePath,
      saved.workDir,
      video.name
    );

    const request: VideoAnalyzeRequest = {
      fileName: video.name,
      durationSeconds: parseOptionalNumber(formData.get("durationSeconds")),
      topic: String(formData.get("topic") ?? "").trim() || undefined,
      transcript,
      currentTitle: String(formData.get("currentTitle") ?? "").trim() || undefined,
      currentDescription:
        String(formData.get("currentDescription") ?? "").trim() || undefined,
      currentTags: parseOptionalTags(formData.get("currentTags")),
    };

    const { openaiApiKey, transcriptionProvider } = getYouTubeConfig();
    const usedOpenAI =
      transcriptionProvider === "openai" ||
      (transcriptionProvider === "auto" && Boolean(openaiApiKey));

    const result = analyzeUploadedVideo(request, {
      transcriptionSource: usedOpenAI ? "whisper" : "whisper-local",
    });
    return Response.json(result);
  } finally {
    if (workDir) {
      await cleanupWorkDir(workDir).catch(() => undefined);
    }
  }
}

async function handleJsonBody(request: Request) {
  const body = (await request.json()) as VideoAnalyzeRequest;
  const transcript = body.transcript?.trim();

  if (!transcript || transcript.length < 50) {
    return Response.json(
      {
        error:
          "Upload a video for automatic analysis, or provide a transcript of at least 50 characters.",
      },
      { status: 400 }
    );
  }

  const result = analyzeUploadedVideo(
    { ...body, transcript },
    { transcriptionSource: "manual" }
  );
  return Response.json(result);
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      return await handleVideoUpload(formData);
    }

    return await handleJsonBody(request);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to analyze video.";
    return Response.json({ error: message }, { status: 500 });
  }
}

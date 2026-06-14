import { analyzeUploadedVideo } from "@/lib/youtube/generate-seo";
import { MAX_VIDEO_UPLOAD_BYTES, getYouTubeConfig } from "@/lib/youtube/config";
import { fetchVideoFromApify } from "@/lib/youtube/providers/apify-video";
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
    return Response.json({ error: "Video must be under 5GB." }, { status: 400 });
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

    const { openaiApiKey, transcriptionProvider } = getYouTubeConfig();
    const usedOpenAI =
      transcriptionProvider === "openai" ||
      (transcriptionProvider === "auto" && Boolean(openaiApiKey));

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

    return Response.json(
      analyzeUploadedVideo(request, {
        transcriptionSource: usedOpenAI ? "whisper" : "whisper-local",
      })
    );
  } finally {
    if (workDir) await cleanupWorkDir(workDir).catch(() => undefined);
  }
}

async function handleYoutubeUrl(body: {
  youtubeUrl?: string;
  topic?: string;
}) {
  const token = process.env.APIFY_TOKEN ?? "";
  if (!token) {
    return Response.json(
      { error: "Sync credentials are required to pull YouTube video metadata." },
      { status: 400 }
    );
  }

  const youtubeUrl = body.youtubeUrl?.trim();
  if (!youtubeUrl) {
    return Response.json({ error: "youtubeUrl is required." }, { status: 400 });
  }

  const video = await fetchVideoFromApify(youtubeUrl, token);
  const transcript = [video.title, video.description].filter(Boolean).join("\n\n");

  if (transcript.length < 20) {
    return Response.json(
      { error: "Could not extract enough text from this video." },
      { status: 400 }
    );
  }

  const result = analyzeUploadedVideo(
    {
      transcript,
      topic: body.topic?.trim() || video.title,
      durationSeconds: video.durationSeconds,
      currentTitle: video.title,
      currentDescription: video.description,
      currentTags: video.hashtags,
    },
    { transcriptionSource: "youtube" }
  );

  return Response.json({
    ...result,
    videoMeta: video,
  });
}

async function handleTranscript(body: VideoAnalyzeRequest) {
  const transcript = body.transcript?.trim();
  if (!transcript || transcript.length < 50) {
    return Response.json(
      { error: "Transcript must be at least 50 characters." },
      { status: 400 }
    );
  }

  return Response.json(
    analyzeUploadedVideo(
      { ...body, transcript },
      { transcriptionSource: "manual" }
    )
  );
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      return await handleVideoUpload(formData);
    }

    const body = (await request.json()) as VideoAnalyzeRequest & {
      youtubeUrl?: string;
    };

    if (body.youtubeUrl) {
      return await handleYoutubeUrl(body);
    }

    return await handleTranscript(body);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate SEO package.";
    return Response.json({ error: message }, { status: 500 });
  }
}

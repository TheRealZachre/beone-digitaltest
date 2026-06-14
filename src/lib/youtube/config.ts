export type YouTubeDataProvider = "youtube-api" | "apify" | "seed" | "auto";
export type TranscriptionProvider = "auto" | "openai" | "local";

/** Max video upload size (5 GB). */
export const MAX_VIDEO_UPLOAD_BYTES = 5 * 1024 * 1024 * 1024;

/** OpenAI Whisper API per-request file limit — large uploads are chunked. */
export const WHISPER_API_MAX_BYTES = 25 * 1024 * 1024;

export function getYouTubeConfig() {
  return {
    provider: (process.env.YOUTUBE_DATA_PROVIDER ?? "auto") as YouTubeDataProvider,
    apiKey: process.env.YOUTUBE_API_KEY ?? "",
    openaiApiKey: process.env.OPENAI_API_KEY ?? "",
    transcriptionProvider: (process.env.TRANSCRIPTION_PROVIDER ??
      "auto") as TranscriptionProvider,
    maxVideos: Number(process.env.YOUTUBE_MAX_VIDEOS ?? 20),
    maxUploadBytes: MAX_VIDEO_UPLOAD_BYTES,
    whisperChunkMaxBytes: WHISPER_API_MAX_BYTES,
  };
}

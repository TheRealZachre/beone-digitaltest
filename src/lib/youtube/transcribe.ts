import { readFile, stat } from "fs/promises";
import OpenAI, { toFile } from "openai";
import { WHISPER_API_MAX_BYTES, getYouTubeConfig } from "./config";
import { isFfmpegAvailable } from "./ffmpeg";
import { extractAudioWav, prepareAudioChunks } from "./process-video";
import { transcribeLocalWavFile } from "./transcribe-local";

function useOpenAITranscription(): boolean {
  const { transcriptionProvider, openaiApiKey } = getYouTubeConfig();
  if (transcriptionProvider === "local") return false;
  if (transcriptionProvider === "openai") {
    if (!openaiApiKey) {
      throw new Error(
        "TRANSCRIPTION_PROVIDER=openai but OPENAI_API_KEY is not set in .env.local."
      );
    }
    return true;
  }
  return Boolean(openaiApiKey);
}

function getOpenAIClient() {
  const { openaiApiKey } = getYouTubeConfig();
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  return new OpenAI({ apiKey: openaiApiKey });
}

async function transcribeBufferOpenAI(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const openai = getOpenAIClient();
  const file = await toFile(buffer, fileName, { type: mimeType || "audio/mpeg" });

  const transcript = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "text",
  });

  return typeof transcript === "string" ? transcript : String(transcript);
}

async function transcribeChunk(
  chunkPath: string,
  index: number,
  useOpenAI: boolean
): Promise<string> {
  if (useOpenAI) {
    const buffer = await readFile(chunkPath);
    const mimeType = chunkPath.endsWith(".wav") ? "audio/wav" : "audio/mpeg";
    return transcribeBufferOpenAI(buffer, `chunk-${index}${chunkPath.slice(chunkPath.lastIndexOf("."))}`, mimeType);
  }
  return transcribeLocalWavFile(chunkPath);
}

export async function transcribeVideoFile(
  filePath: string,
  workDir: string,
  originalName: string
): Promise<string> {
  const openai = useOpenAITranscription();
  const fileStat = await stat(filePath);

  if (!(await isFfmpegAvailable())) {
    if (!openai || fileStat.size > WHISPER_API_MAX_BYTES) {
      throw new Error(
        "Could not run ffmpeg to process this video. Restart the dev server and try again."
      );
    }
  }

  // Small file + OpenAI: send video directly
  if (openai && fileStat.size <= WHISPER_API_MAX_BYTES) {
    const buffer = await readFile(filePath);
    const text = await transcribeBufferOpenAI(buffer, originalName, "video/mp4");
    return validateTranscript(text);
  }

  // Local Whisper or large file: extract/chunk audio via ffmpeg
  const format = openai ? "mp3" : "wav";
  const chunks =
    fileStat.size <= WHISPER_API_MAX_BYTES
      ? [await extractAudioWav(filePath, workDir)]
      : await prepareAudioChunks(filePath, workDir, format);

  const parts: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunkText = await transcribeChunk(chunks[i], i, openai);
    if (chunkText.trim()) {
      parts.push(chunkText.trim());
    }
  }

  return validateTranscript(parts.join("\n\n"));
}

function validateTranscript(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length < 20) {
    throw new Error(
      "Could not extract enough speech from the video. Try a clip with clearer audio."
    );
  }
  return trimmed;
}

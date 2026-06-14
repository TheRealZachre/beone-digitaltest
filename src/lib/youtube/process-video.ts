import { execFile } from "child_process";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { promisify } from "util";
import { getFfmpegPath } from "./ffmpeg";

const execFileAsync = promisify(execFile);

/** 5-minute segments keep each chunk well under Whisper's 25MB limit. */
const SEGMENT_SECONDS = 300;

async function runFfmpeg(args: string[]) {
  const ffmpeg = await getFfmpegPath();
  if (!ffmpeg) {
    throw new Error("Could not run ffmpeg to process this video.");
  }

  await execFileAsync(ffmpeg, args, { maxBuffer: 10 * 1024 * 1024 });
}

export async function extractAudioWav(
  videoPath: string,
  workDir: string
): Promise<string> {
  const audioPath = join(workDir, "audio.wav");
  await runFfmpeg([
    "-i",
    videoPath,
    "-vn",
    "-acodec",
    "pcm_s16le",
    "-ar",
    "16000",
    "-ac",
    "1",
    "-y",
    audioPath,
  ]);
  return audioPath;
}

/** Compress audio and split into segments (mp3 for OpenAI, wav for local Whisper). */
export async function prepareAudioChunks(
  videoPath: string,
  workDir: string,
  format: "mp3" | "wav" = "mp3"
): Promise<string[]> {
  const ext = format === "mp3" ? "mp3" : "wav";
  const audioPath = join(workDir, `audio.${ext}`);
  const chunkPattern = join(workDir, `chunk_%03d.${ext}`);

  if (format === "mp3") {
    await runFfmpeg([
      "-i",
      videoPath,
      "-vn",
      "-acodec",
      "libmp3lame",
      "-ar",
      "16000",
      "-ac",
      "1",
      "-b:a",
      "64k",
      "-y",
      audioPath,
    ]);
  } else {
    await runFfmpeg([
      "-i",
      videoPath,
      "-vn",
      "-acodec",
      "pcm_s16le",
      "-ar",
      "16000",
      "-ac",
      "1",
      "-y",
      audioPath,
    ]);
  }

  await runFfmpeg([
    "-i",
    audioPath,
    "-f",
    "segment",
    "-segment_time",
    String(SEGMENT_SECONDS),
    "-c",
    "copy",
    "-y",
    chunkPattern,
  ]);

  const files = await readdir(workDir);
  const chunks = files
    .filter((f) => f.startsWith("chunk_") && f.endsWith(`.${ext}`))
    .sort()
    .map((f) => join(workDir, f));

  if (chunks.length > 0) return chunks;

  const audioStat = await stat(audioPath);
  if (audioStat.size > 0) return [audioPath];

  throw new Error("Could not extract audio from the video.");
}

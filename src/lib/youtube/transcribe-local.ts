import { readFile } from "fs/promises";
import { WaveFile } from "wavefile";

type LocalTranscriber = (
  audio: Float32Array,
  options?: { chunk_length_s?: number; stride_length_s?: number }
) => Promise<{ text?: string } | string>;

let transcriberPromise: Promise<LocalTranscriber> | null = null;

async function getLocalTranscriber(): Promise<LocalTranscriber> {
  if (!transcriberPromise) {
    transcriberPromise = import("@xenova/transformers").then(({ pipeline }) =>
      pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en")
    ) as Promise<LocalTranscriber>;
  }
  return transcriberPromise;
}

function loadWavSamples(buffer: Buffer): Float32Array {
  const wav = new WaveFile(buffer);
  wav.toBitDepth("32f");
  wav.toSampleRate(16000);
  const raw = wav.getSamples();

  const mono = Array.isArray(raw) ? raw[0] : raw;
  if (!mono || mono.length === 0) {
    throw new Error("Could not decode audio for local transcription.");
  }

  return mono instanceof Float32Array
    ? mono
    : Float32Array.from(mono as ArrayLike<number>);
}

export async function transcribeLocalWavFile(wavPath: string): Promise<string> {
  const transcriber = await getLocalTranscriber();
  const buffer = await readFile(wavPath);
  const audioData = loadWavSamples(buffer);

  const output = await transcriber(audioData, {
    chunk_length_s: 30,
    stride_length_s: 5,
  });

  const text =
    typeof output === "string"
      ? output
      : ((output as { text?: string }).text ?? "");

  return text.trim();
}

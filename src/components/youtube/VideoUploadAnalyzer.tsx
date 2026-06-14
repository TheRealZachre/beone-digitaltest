"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Loader2,
  Mic,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";
import { SeoScoreBadge } from "./SeoScoreBadge";
import type { VideoAnalyzeResponse } from "@/lib/youtube/types";

const MAX_BYTES = 5 * 1024 * 1024 * 1024;

type PipelineStep =
  | "idle"
  | "uploading"
  | "transcribing"
  | "generating"
  | "complete"
  | "error";

const STEP_LABELS: Record<PipelineStep, string> = {
  idle: "Waiting for video",
  uploading: "Uploading video",
  transcribing: "Transcribing audio with Whisper",
  generating: "Generating SEO package",
  complete: "Complete",
  error: "Error",
};

export function VideoUploadAnalyzer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | undefined>();
  const [topic, setTopic] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentTags, setCurrentTags] = useState("");
  const [step, setStep] = useState<PipelineStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoAnalyzeResponse | null>(null);

  const loading = step !== "idle" && step !== "complete" && step !== "error";

  async function runPipeline(file: File) {
    setStep("uploading");
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("video", file);
    if (topic.trim()) formData.append("topic", topic.trim());
    if (durationSeconds) {
      formData.append("durationSeconds", String(durationSeconds));
    }
    if (currentTitle.trim()) formData.append("currentTitle", currentTitle.trim());
    if (currentDescription.trim()) {
      formData.append("currentDescription", currentDescription.trim());
    }
    if (currentTags.trim()) formData.append("currentTags", currentTags.trim());

    try {
      setStep("transcribing");

      const res = await fetch("/api/youtube/analyze", {
        method: "POST",
        body: formData,
      });

      setStep("generating");

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");

      setResult(data);
      setStep("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("error");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setError(
        `Video is ${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB — must be under 5GB.`
      );
      setStep("error");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);

    if (!topic) {
      const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setTopic(baseName);
    }

    void runPipeline(file);
  }

  function handleLoadedMetadata() {
    const duration = videoRef.current?.duration;
    if (duration && Number.isFinite(duration)) {
      setDurationSeconds(Math.round(duration));
    }
  }

  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
  }

  const stepOrder: PipelineStep[] = [
    "uploading",
    "transcribing",
    "generating",
    "complete",
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Upload a video — fully automated
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Select a video and the platform handles the rest: upload, Whisper
          transcription, keyword extraction, and SEO package generation.
          Transcription runs locally by default — set{" "}
          <code className="rounded bg-slate-100 px-1">OPENAI_API_KEY</code> in
          .env.local for higher-quality Whisper API results.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-10 transition-colors hover:border-red-300 hover:bg-red-50/30 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          ) : (
            <Upload className="h-8 w-8 text-slate-400" />
          )}
          <span className="text-sm font-medium text-slate-700">
            {loading
              ? STEP_LABELS[step]
              : (fileName ?? "Choose a video file to start")}
          </span>
          <span className="text-xs text-slate-400">
            MP4, MOV, WebM · max 5GB
          </span>
        </button>

        {previewUrl && (
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-black">
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              onLoadedMetadata={handleLoadedMetadata}
              className="max-h-80 w-full"
            />
          </div>
        )}

        {step !== "idle" && (
          <div className="mt-6 space-y-2">
            {stepOrder.map((s) => {
              const idx = stepOrder.indexOf(s);
              const currentIdx = stepOrder.indexOf(
                step === "error" ? "uploading" : step
              );
              const done = step === "complete" || idx < currentIdx;
              const active = s === step;

              return (
                <div
                  key={s}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    active
                      ? "bg-red-50 text-red-800"
                      : done
                        ? "text-emerald-700"
                        : "text-slate-400"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <span className="h-4 w-4 shrink-0 rounded-full border border-slate-300" />
                  )}
                  {STEP_LABELS[s]}
                </div>
              );
            })}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      </div>

      <details className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          Optional settings (topic hint & current YouTube metadata)
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Topic hint
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Used to refine title suggestions"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <input
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            placeholder="Current title (for before/after score)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <textarea
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            placeholder="Current description"
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            value={currentTags}
            onChange={(e) => setCurrentTags(e.target.value)}
            placeholder="Current tags, comma-separated"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <p className="text-xs text-slate-400">
            Re-upload the video after changing these to apply them to a new run.
          </p>
        </div>
      </details>

      {result && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mic className="h-4 w-4 text-red-500" />
              Transcript auto-generated
              {result.transcriptionSource === "whisper-local"
                ? " (local Whisper)"
                : " (OpenAI Whisper)"}
            </div>
            {result.current && (
              <div>
                <p className="text-xs text-slate-500">Current SEO score</p>
                <SeoScoreBadge score={result.current.totalScore} size="md" />
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500">Projected SEO score</p>
              <SeoScoreBadge score={result.projected.totalScore} size="md" />
            </div>
            {result.current && (
              <p className="text-sm text-emerald-700">
                +{result.projected.totalScore - result.current.totalScore}{" "}
                point improvement
              </p>
            )}
          </div>

          <SeoPackageCard
            title="Extracted transcript"
            content={result.transcript}
            multiline
            onCopy={() => copyText(result.transcript)}
          />

          <SeoPackageCard
            title="Optimized title"
            content={result.generated.title}
            meta={`${result.generated.titleCharCount} characters`}
            onCopy={() => copyText(result.generated.title)}
          />

          <SeoPackageCard
            title="Video description"
            content={result.generated.description}
            multiline
            onCopy={() => copyText(result.generated.description)}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Tags</h3>
              <CopyButton
                onClick={() => copyText(result.generated.tags.join(", "))}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.generated.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Thumbnail text overlays
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {result.generated.thumbnailOverlays.map((text) => (
                  <li key={text} className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-red-500" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">Chapter markers</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {result.generated.chapterMarkers.map((chapter) => (
                  <li key={`${chapter.time}-${chapter.title}`}>
                    <span className="font-mono text-slate-400">
                      {chapter.time}
                    </span>{" "}
                    {chapter.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Sparkles className="h-4 w-4" />
            Analyze another video
          </button>
        </div>
      )}
    </div>
  );
}

function CopyButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800"
    >
      <Copy className="h-3.5 w-3.5" />
      Copy
    </button>
  );
}

function SeoPackageCard({
  title,
  content,
  meta,
  multiline,
  onCopy,
}: {
  title: string;
  content: string;
  meta?: string;
  multiline?: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {meta && <p className="text-xs text-slate-400">{meta}</p>}
        </div>
        <CopyButton onClick={onCopy} />
      </div>
      <p
        className={
          multiline
            ? "mt-3 max-h-48 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-700"
            : "mt-3 text-sm font-medium text-slate-800"
        }
      >
        {content}
      </p>
    </div>
  );
}

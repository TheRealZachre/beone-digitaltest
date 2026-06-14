"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Link2,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";
import { SeoPackageResults } from "./SeoPackageResults";
import type { VideoAnalyzeResponse } from "@/lib/youtube/types";

const MAX_BYTES = 5 * 1024 * 1024 * 1024;

type InputMode = "youtube" | "upload" | "transcript";
type Step = "idle" | "working" | "complete" | "error";

export function SeoPackageGenerator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<InputMode>("youtube");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    (VideoAnalyzeResponse & { videoMeta?: { id: string; title: string; thumbnailUrl: string; channelName: string } }) | null
  >(null);

  const [youtubeUrl, setYoutubeUrl] = useState(
    "https://www.youtube.com/watch?v=URAqBej-oOw"
  );
  const [topic, setTopic] = useState("");
  const [transcript, setTranscript] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | undefined>();

  const loading = step === "working";

  function resetResults() {
    setResult(null);
    setError(null);
    setStep("idle");
  }

  async function generateFromYoutube(e: React.FormEvent) {
    e.preventDefault();
    setStep("working");
    setError(null);

    try {
      const res = await fetch("/api/youtube/seo-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeUrl,
          topic: topic.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data);
      setStep("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("error");
    }
  }

  async function generateFromTranscript(e: React.FormEvent) {
    e.preventDefault();
    setStep("working");
    setError(null);

    try {
      const res = await fetch("/api/youtube/seo-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcript.trim(),
          topic: topic.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data);
      setStep("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("error");
    }
  }

  async function generateFromUpload(file: File) {
    setStep("working");
    setError(null);

    const formData = new FormData();
    formData.append("video", file);
    if (topic.trim()) formData.append("topic", topic.trim());
    if (durationSeconds) {
      formData.append("durationSeconds", String(durationSeconds));
    }

    try {
      const res = await fetch("/api/youtube/seo-package", {
        method: "POST",
        body: formData,
      });
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
      setError("Video must be under 5GB.");
      setStep("error");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    if (!topic) {
      setTopic(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
    void generateFromUpload(file);
  }

  function handleLoadedMetadata() {
    const duration = videoRef.current?.duration;
    if (duration && Number.isFinite(duration)) {
      setDurationSeconds(Math.round(duration));
    }
  }

  const tabs: { id: InputMode; label: string; icon: typeof Link2 }[] = [
    { id: "youtube", label: "YouTube URL", icon: Link2 },
    { id: "upload", label: "Upload video", icon: Upload },
    { id: "transcript", label: "Paste transcript", icon: FileText },
  ];

  if (result) {
    return (
      <SeoPackageResults
        result={result}
        onReset={() => {
          resetResults();
          setFileName(null);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id);
              resetResults();
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === id
                ? "bg-red-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {mode === "youtube" && (
        <form
          onSubmit={generateFromYoutube}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Generate from a YouTube video
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Pulls the video title and description, then builds a full SEO
            package ready to paste into YouTube Studio.
          </p>
          <input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            required
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic hint (optional)"
            className="mt-3 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate SEO package
          </button>
        </form>
      )}

      {mode === "upload" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Upload a video
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Automatically transcribes audio and generates title, description,
            tags, chapters, and thumbnail overlay suggestions.
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
            className="mt-4 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-10 hover:border-red-300 hover:bg-red-50/30 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            ) : (
              <Upload className="h-8 w-8 text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-700">
              {loading
                ? "Transcribing and generating..."
                : (fileName ?? "Choose a video file")}
            </span>
          </button>
          {previewUrl && (
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              onLoadedMetadata={handleLoadedMetadata}
              className="mt-4 max-h-64 w-full rounded-lg"
            />
          )}
        </div>
      )}

      {mode === "transcript" && (
        <form
          onSubmit={generateFromTranscript}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Paste a transcript
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Skip transcription — paste your script or talking points and get a
            complete SEO package instantly.
          </p>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={10}
            placeholder="Paste your full video transcript here..."
            className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            required
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic / working title (optional)"
            className="mt-3 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={loading || transcript.trim().length < 50}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate SEO package
          </button>
        </form>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}

"use client";

import Image from "next/image";
import { Copy, Download, Video } from "lucide-react";
import { SeoScoreBadge } from "./SeoScoreBadge";
import { formatSeoPackageForExport } from "@/lib/youtube/format-package";
import type { VideoAnalyzeResponse } from "@/lib/youtube/types";

interface SeoPackageResultsProps {
  result: VideoAnalyzeResponse & {
    videoMeta?: {
      id: string;
      title: string;
      thumbnailUrl: string;
      channelName: string;
    };
  };
  onReset?: () => void;
}

export function SeoPackageResults({ result, onReset }: SeoPackageResultsProps) {
  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
  }

  function downloadPackage() {
    const blob = new Blob([formatSeoPackageForExport(result)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "youtube-seo-package.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const sourceLabel =
    result.transcriptionSource === "whisper-local"
      ? "Local Whisper transcription"
      : result.transcriptionSource === "whisper"
        ? "OpenAI Whisper transcription"
        : result.transcriptionSource === "youtube"
          ? "Pulled from YouTube"
          : "From transcript";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {result.videoMeta?.thumbnailUrl && (
          <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={result.videoMeta.thumbnailUrl}
              alt={result.videoMeta.title}
              fill
              unoptimized
              className="object-cover"
              sizes="112px"
            />
          </div>
        )}
        <div className="flex-1 text-sm text-slate-600">{sourceLabel}</div>
        {result.current && (
          <div>
            <p className="text-xs text-slate-500">Current SEO</p>
            <SeoScoreBadge score={result.current.totalScore} size="md" />
          </div>
        )}
        <div>
          <p className="text-xs text-slate-500">Projected SEO</p>
          <SeoScoreBadge score={result.projected.totalScore} size="md" />
        </div>
        <button
          type="button"
          onClick={downloadPackage}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Download package
        </button>
        <button
          type="button"
          onClick={() => copyText(formatSeoPackageForExport(result))}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <Copy className="h-4 w-4" />
          Copy all
        </button>
      </div>

      <SeoPackageCard
        title="Optimized title"
        content={result.generated.title}
        meta={`${result.generated.titleCharCount} / 70 characters`}
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
          <h3 className="font-semibold text-slate-900">Tags (up to 15)</h3>
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
          <h3 className="font-semibold text-slate-900">Thumbnail text overlays</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {result.generated.thumbnailOverlays.map((text) => (
              <li key={text} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-red-500" />
                  {text}
                </span>
                <CopyButton onClick={() => copyText(text)} />
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Chapter markers</h3>
            <CopyButton
              onClick={() =>
                copyText(
                  result.generated.chapterMarkers
                    .map((c) => `${c.time} ${c.title}`)
                    .join("\n")
                )
              }
            />
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {result.generated.chapterMarkers.map((chapter) => (
              <li key={`${chapter.time}-${chapter.title}`}>
                <span className="font-mono text-slate-400">{chapter.time}</span>{" "}
                {chapter.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">End screen & card placements</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {result.generated.endScreenSuggestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-400">
          Auto-publish to YouTube Studio is not enabled yet — copy fields above
          into Studio manually.
        </p>
      </div>

      {result.transcript && (
        <SeoPackageCard
          title="Source transcript"
          content={result.transcript}
          multiline
          onCopy={() => copyText(result.transcript)}
        />
      )}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Generate another package
        </button>
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
            ? "mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-700"
            : "mt-3 text-sm font-medium text-slate-800"
        }
      >
        {content}
      </p>
    </div>
  );
}

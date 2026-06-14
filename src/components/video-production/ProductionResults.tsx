"use client";

import { Copy, Download } from "lucide-react";
import clsx from "clsx";
import { AUDIENCE_LABELS } from "@/lib/video-production/config";
import { formatVideoProductionForExport } from "@/lib/video-production/format-export";
import type { VideoProductionPackage } from "@/lib/video-production/types";

interface ProductionResultsProps {
  result: VideoProductionPackage;
  onReset?: () => void;
}

const stepLabels = ["Script", "AI Presenter", "Production", "Distribution"];

export function ProductionResults({ result, onReset }: ProductionResultsProps) {
  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
  }

  function downloadPackage() {
    const blob = new Blob([formatVideoProductionForExport(result)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result.topic.toLowerCase().replace(/\s+/g, "-")}-video-production.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700">
              {result.productName} · Production package ready
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {result.script.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              ~{result.script.estimatedDurationMinutes} min master ·{" "}
              {AUDIENCE_LABELS[result.audience]} · {result.platformClips.length}{" "}
              platform outputs queued
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadPackage}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              type="button"
              onClick={() => copyText(formatVideoProductionForExport(result))}
              className="inline-flex items-center gap-2 rounded-lg bg-fuchsia-600 px-3 py-2 text-sm font-medium text-white hover:bg-fuchsia-700"
            >
              <Copy className="h-4 w-4" />
              Copy package
            </button>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                New project
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className="rounded-lg border border-fuchsia-100 bg-white px-3 py-2 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-fuchsia-600">
                Step {index + 1}
              </p>
              <p className="text-xs font-medium text-slate-800">{label}</p>
              <p className="text-[10px] text-emerald-600">Complete</p>
            </div>
          ))}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Step 1 — Approved script</h3>
        <p className="mt-1 text-sm text-slate-500">
          Hook: {result.script.hook}
        </p>
        <div className="mt-4 space-y-4">
          {result.script.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-medium text-slate-900">{section.label}</h4>
                <span className="text-xs text-slate-500">
                  {section.durationSeconds}s
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {section.narration}
              </p>
              {section.bRoll && (
                <p className="mt-2 text-xs text-slate-500">
                  B-roll: {section.bRoll}
                </p>
              )}
            </div>
          ))}
        </div>
        {result.script.disclaimer && (
          <p className="mt-4 text-xs text-slate-500">{result.script.disclaimer}</p>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Step 2 — AI presenter</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {result.presenterNotes.map((note) => (
            <li key={note} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-500" />
              {note}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Step 3 — Production assembly</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {result.productionChecklist.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 text-fuchsia-600">☐</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {result.thumbnails.map((thumb) => (
            <div
              key={thumb.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700">
                Thumbnail {thumb.abTestVariant}
              </p>
              <p className="mt-1 font-medium text-slate-900">{thumb.label}</p>
              <p className="mt-1 text-sm text-slate-600">{thumb.concept}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">
          Step 4 — Distribution plan
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-2 pr-4 font-medium">Platform</th>
                <th className="pb-2 pr-4 font-medium">Format</th>
                <th className="pb-2 pr-4 font-medium">Caption</th>
                <th className="pb-2 font-medium">Publish notes</th>
              </tr>
            </thead>
            <tbody>
              {result.platformClips.map((clip) => (
                <tr key={clip.platform} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {clip.platform}
                    <span className="ml-1 text-xs text-slate-400">
                      {clip.aspectRatio}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{clip.format}</td>
                  <td className="py-3 pr-4 text-slate-600">{clip.caption}</td>
                  <td className="py-3 text-slate-500">{clip.publishNotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h4 className="mt-6 font-medium text-slate-900">Content calendar</h4>
        <ul className="mt-3 space-y-2">
          {result.schedule.map((item) => (
            <li
              key={`${item.platform}-${item.scheduledAt}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="font-medium text-slate-800">{item.platform}</span>
              <span className="text-slate-500">
                {new Date(item.scheduledAt).toLocaleString()}
              </span>
              <span
                className={clsx(
                  "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  item.status === "ready"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                )}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <h4 className="font-medium text-slate-900">YouTube SEO package</h4>
          <p className="mt-2 text-sm font-medium text-slate-800">
            {result.youtubeSeo.title}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
            {result.youtubeSeo.description}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Tags: {result.youtubeSeo.tags.join(", ")}
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {result.captions.map((caption) => (
            <div
              key={caption.format}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {caption.format} captions
              </p>
              <pre className="mt-2 max-h-32 overflow-auto text-xs text-slate-600">
                {caption.preview}
              </pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { Copy, Download } from "lucide-react";
import clsx from "clsx";
import { formatVoiceProfileForExport } from "@/lib/voice-training/format-export";
import type { VoiceProfile } from "@/lib/voice-training/types";

export function VoiceProfileCard({ profile }: { profile: VoiceProfile }) {
  function copyProfile() {
    void navigator.clipboard.writeText(formatVoiceProfileForExport(profile));
  }

  function downloadProfile() {
    const blob = new Blob([formatVoiceProfileForExport(profile)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${profile.executiveId}-voice-profile.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const scoreColor =
    profile.metrics.authenticityScore >= 80
      ? "text-emerald-700 bg-emerald-100"
      : profile.metrics.authenticityScore >= 60
        ? "text-amber-700 bg-amber-100"
        : "text-rose-700 bg-rose-100";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
              Voice profile trained
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {profile.executiveName}
            </h2>
            <p className="text-sm text-slate-500">{profile.title}</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
              {profile.voiceSummary}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={clsx(
                "rounded-full px-3 py-1 text-sm font-semibold",
                scoreColor
              )}
            >
              {profile.metrics.authenticityScore}/100 authentic
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={downloadProfile}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
              <button
                type="button"
                onClick={copyProfile}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Posts analyzed", value: profile.metrics.postsAnalyzed },
          {
            label: "Words / sentence",
            value: profile.metrics.avgWordsPerSentence,
          },
          {
            label: "First-person rate",
            value: `${profile.metrics.firstPersonRate}%`,
          },
          {
            label: "Data references",
            value: profile.metrics.dataReferenceRate,
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs text-slate-500">{metric.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Voice signatures</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {profile.signatures.map((signature) => (
            <div
              key={signature.label}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                {signature.label}
              </p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {signature.examples.map((example) => (
                  <li key={example} className="italic">
                    &ldquo;{example}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Preferred phrases</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.preferredPhrases.map((phrase) => (
              <li
                key={phrase}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
              >
                {phrase}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Ghostwritten-by-comms flags
          </h3>
          {profile.antiPatterns.length === 0 ? (
            <p className="mt-3 text-sm text-emerald-700">
              No corporate clichés detected in training corpus.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {profile.antiPatterns.map((item) => (
                <li key={item.phrase}>
                  <span className="font-medium text-rose-700">{item.phrase}</span>{" "}
                  — {item.reason}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-slate-500">
            Always avoid: {profile.avoidPhrases.slice(0, 5).join(", ")}
          </p>
        </section>
      </div>
    </div>
  );
}

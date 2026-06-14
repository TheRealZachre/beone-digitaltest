"use client";

import { useState } from "react";
import {
  Copy,
  Loader2,
  LineChart,
  TrendingUp,
  Trophy,
} from "lucide-react";
import clsx from "clsx";
import { StoryBeatBadge } from "@/components/narrative/StoryBeatBadge";
import type { PredictResponse } from "@/lib/predictive/types";
import type { Platform } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/metrics";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
];

const confidenceStyles = {
  high: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-slate-100 text-slate-600",
};

const DEFAULT_DRAFT = `At #ASCO26, we're sharing data that helps shift the conversation beyond short-term endpoints for people living with CLL.

With 78-month follow-up from a large Phase 3 study, BeOne is providing important insight into durable outcomes for CLL patients.

Our Chief Medical Officer shares why these data matter just as much as initial response in CLL.`;

export function DraftPredictPanel() {
  const [caption, setCaption] = useState(DEFAULT_DRAFT);
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/predictive/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: caption.trim(), platform }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Prediction failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
            <LineChart className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Draft & predict
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Paste your post draft to forecast performance and get three ranked
              variants.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">Platform</label>
          <select
            value={platform}
            onChange={(event) =>
              setPlatform(event.target.value as Platform)
            }
            className="mt-1.5 w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {PLATFORMS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Post draft
          </label>
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            rows={8}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm leading-relaxed focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Paste your post draft here…"
          />
          <p className="mt-1 text-xs text-slate-400">
            {caption.trim().length} characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !caption.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LineChart className="h-4 w-4" />
          )}
          {loading ? "Forecasting…" : "Predict performance"}
        </button>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      </form>

      {result && (
        <>
          <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-5">
            <p className="font-semibold text-slate-900">{result.summary}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <StoryBeatBadge beat={result.storyBeat} size="sm" />
              <span className="capitalize">{result.category}</span>
              <span>·</span>
              <span>{result.baselineSource}</span>
              <span>·</span>
              <span>{result.responseTimeMs}ms</span>
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Your draft (baseline)</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Impressions"
                value={formatNumber(result.baseline.impressions)}
              />
              <MetricCard
                label="Reach"
                value={formatNumber(result.baseline.reach)}
              />
              <MetricCard
                label="Engagements"
                value={formatNumber(result.baseline.engagements)}
              />
              <MetricCard
                label="Eng. rate"
                value={formatPercent(result.baseline.engagementRate)}
                confidence={result.baseline.confidence}
              />
            </div>
          </section>

          <section>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Trophy className="h-5 w-5 text-amber-500" />
              Optimized variants (ranked by lift)
            </h3>
            <div className="space-y-4">
              {result.variants.map((variant, index) => (
                <article
                  key={variant.id}
                  className={clsx(
                    "rounded-xl border bg-white p-6 shadow-sm",
                    index === 0
                      ? "border-amber-200 ring-1 ring-amber-100"
                      : "border-slate-200"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {index === 0 && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            Top lift
                          </span>
                        )}
                        <h4 className="font-semibold text-slate-900">
                          {variant.label}
                        </h4>
                        <span className="text-xs text-slate-500">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {variant.strategy}
                      </p>
                    </div>
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold",
                        variant.liftPercent > 0
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      {variant.liftPercent > 0 ? "+" : ""}
                      {variant.liftPercent}% lift
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                      label="Impressions"
                      value={formatNumber(variant.predicted.impressions)}
                      compact
                    />
                    <MetricCard
                      label="Reach"
                      value={formatNumber(variant.predicted.reach)}
                      compact
                    />
                    <MetricCard
                      label="Engagements"
                      value={formatNumber(variant.predicted.engagements)}
                      compact
                    />
                    <MetricCard
                      label="Eng. rate"
                      value={formatPercent(variant.predicted.engagementRate)}
                      compact
                    />
                  </div>

                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
                      {variant.caption}
                    </pre>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <ul className="flex flex-wrap gap-2">
                      {variant.optimizations.map((item) => (
                        <li
                          key={item}
                          className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-800"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() =>
                        void navigator.clipboard.writeText(variant.caption)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy variant
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  confidence,
  compact,
}: {
  label: string;
  value: string;
  confidence?: "high" | "medium" | "low";
  compact?: boolean;
}) {
  return (
    <div className={clsx("rounded-lg bg-slate-50", compact ? "p-3" : "p-4")}>
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={clsx(
          "font-semibold text-slate-900",
          compact ? "text-lg" : "text-2xl"
        )}
      >
        {value}
      </p>
      {confidence && (
        <span
          className={clsx(
            "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
            confidenceStyles[confidence]
          )}
        >
          {confidence} confidence
        </span>
      )}
    </div>
  );
}

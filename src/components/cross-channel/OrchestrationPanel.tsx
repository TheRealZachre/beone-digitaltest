"use client";

import { useState } from "react";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import { StoryBeatBadge } from "@/components/narrative/StoryBeatBadge";
import { ACTION_LABELS } from "@/lib/cross-channel/content";
import type {
  CrossChannelAnalyzeResponse,
  PlatformRecommendation,
} from "@/lib/cross-channel/types";
import { formatCurrency, formatPercent } from "@/lib/metrics";

const platformStyles: Record<string, string> = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  x: "bg-slate-800",
  youtube: "bg-red-600",
};

const actionStyles: Record<PlatformRecommendation["action"], string> = {
  boost: "bg-amber-100 text-amber-800",
  repost: "bg-blue-100 text-blue-800",
  create: "bg-violet-100 text-violet-800",
  "cross-promote": "bg-emerald-100 text-emerald-800",
};

const confidenceStyles: Record<
  PlatformRecommendation["matchConfidence"],
  string
> = {
  exact: "text-emerald-700",
  theme: "text-blue-700",
  beat: "text-violet-700",
  none: "text-slate-500",
};

export function OrchestrationPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CrossChannelAnalyzeResponse | null>(
    null
  );

  async function handleAnalyze() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cross-channel/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Amplification recommendations
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Scans recent LinkedIn hits and maps sibling content on
                Instagram, X, and YouTube.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {loading ? "Analyzing…" : "Run analysis"}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      </div>

      {result && (
        <>
          <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-5">
            <p className="font-semibold text-slate-900">{result.summary}</p>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(result.analyzedAt).toLocaleString()} ·{" "}
              {result.responseTimeMs}ms · {result.totalPostsScanned} posts in
              last {result.lookbackDays} days · hit threshold{" "}
              {result.hitThresholdPercent}%
            </p>
          </div>

          {result.plans.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-slate-500">
                No LinkedIn posts crossed the amplification threshold in this
                window.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {result.plans.map((plan) => (
                <section
                  key={plan.linkedInHit.post.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-100 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-blue-700 px-2.5 py-0.5 text-xs font-semibold text-white">
                            LinkedIn hit
                          </span>
                          <StoryBeatBadge
                            beat={plan.linkedInHit.post.storyBeat}
                            size="md"
                          />
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                          {plan.linkedInHit.post.caption}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {plan.linkedInHit.hitReason}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="flex items-center justify-end gap-1 text-2xl font-semibold text-emerald-700">
                          <TrendingUp className="h-5 w-5" />
                          {formatPercent(plan.linkedInHit.engagementRate)}
                        </p>
                        <p className="text-xs text-slate-500">engagement rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-6 lg:grid-cols-3">
                    {plan.recommendations.map((rec) => (
                      <RecommendationCard key={rec.targetPlatform} rec={rec} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RecommendationCard({ rec }: { rec: PlatformRecommendation }) {
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <span
          className={clsx(
            "rounded-full px-2.5 py-1 text-xs font-semibold capitalize text-white",
            platformStyles[rec.targetPlatform]
          )}
        >
          {rec.targetPlatform}
        </span>
        <span
          className={clsx(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            actionStyles[rec.action]
          )}
        >
          {ACTION_LABELS[rec.action]}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        {rec.rationale}
      </p>

      <dl className="mt-3 space-y-1 text-xs text-slate-500">
        <div className="flex justify-between gap-2">
          <dt>Match</dt>
          <dd
            className={clsx(
              "font-medium capitalize",
              confidenceStyles[rec.matchConfidence]
            )}
          >
            {rec.matchConfidence}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Priority</dt>
          <dd className="font-medium text-slate-700">{rec.priority}</dd>
        </div>
        {rec.recommendedBudget !== undefined && (
          <div className="flex justify-between gap-2">
            <dt>Suggested boost</dt>
            <dd className="font-medium text-amber-700">
              {formatCurrency(rec.recommendedBudget)}
            </dd>
          </div>
        )}
      </dl>

      {rec.formatHint && (
        <p className="mt-3 rounded-md bg-white px-3 py-2 text-xs text-slate-600">
          <span className="font-medium text-slate-800">Format: </span>
          {rec.formatHint}
        </p>
      )}

      {rec.suggestedCaption && (
        <p className="mt-3 line-clamp-3 text-xs italic text-slate-500">
          “{rec.suggestedCaption}”
        </p>
      )}

      {rec.matchedPost && (
        <p className="mt-auto pt-3 text-xs text-slate-400">
          Sibling: {rec.matchedPost.id} ·{" "}
          {new Date(rec.matchedPost.publishedAt).toLocaleDateString()}
        </p>
      )}

      {!rec.matchedPost && rec.action === "create" && (
        <p className="mt-auto flex items-center gap-1 pt-3 text-xs font-medium text-violet-700">
          <ArrowRight className="h-3 w-3" />
          Net-new content needed
        </p>
      )}
    </article>
  );
}

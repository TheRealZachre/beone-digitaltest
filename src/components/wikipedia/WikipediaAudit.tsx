"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────
interface PageviewPoint {
  date: string;
  views: number;
}

interface MaintenanceFlag {
  template: string;
  label: string;
  severity: "high" | "medium" | "low";
  description: string;
  action: string;
}

interface Metrics {
  total_views: number;
  avg_daily_views: number;
  peak_views: number;
  reference_count: number;
  word_count: number;
  flag_count: number;
  last_edited: string | null;
}

interface AnalyticsData {
  title: string;
  project: string;
  url: string;
  metrics: Metrics;
  pageviews: PageviewPoint[];
  maintenance_flags: MaintenanceFlag[];
  _extract: string;
}

interface ReviewIssue {
  category: string;
  severity: string;
  title: string;
  detail: string;
  suggested_action: string;
}

interface ReviewData {
  quality_tier?: string;
  assessment?: string;
  issues?: ReviewIssue[];
  error?: string;
}

// ── Constants ─────────────────────────────────────────────────────
const TIER_LABEL: Record<string, string> = {
  stub: "F",
  start: "D",
  c: "C",
  b: "B",
  good: "A",
  featured: "A+",
};

const TIER_MEANING: Record<string, string> = {
  stub: "Stub / minimal",
  start: "Needs work",
  c: "Decent coverage",
  b: "Mostly complete",
  good: "Good article",
  featured: "Featured — exceptional",
};

const GRADE_COLOR: Record<string, string> = {
  "A+": "text-emerald-700 border-emerald-600",
  A: "text-emerald-600 border-emerald-500",
  B: "text-brand-indigo border-brand-indigo",
  C: "text-amber-600 border-amber-500",
  D: "text-red-600 border-red-500",
  F: "text-red-800 border-red-700",
};

const FLAG_ICONS: Record<string, string> = {
  high: "⚠️",
  medium: "📌",
  low: "ℹ️",
};

const SEV_COLOR: Record<string, string> = {
  high: "bg-red-50 border-red-200",
  medium: "bg-amber-50 border-amber-200",
  low: "bg-green-50 border-green-200",
};

const SEV_TITLE: Record<string, string> = {
  high: "text-red-700",
  medium: "text-amber-700",
  low: "text-green-700",
};

const REVIEW_SEV_BAR: Record<string, string> = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-green-600",
};

const REVIEW_SEV_BADGE: Record<string, string> = {
  high: "bg-red-600",
  medium: "bg-amber-500",
  low: "bg-green-600",
  info: "bg-brand-indigo",
};

// ── Helpers ───────────────────────────────────────────────────────
function isoToday() {
  return new Date().toISOString().split("T")[0];
}
function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}
function fmt(n: number | null | undefined) {
  return (n ?? 0).toLocaleString();
}

// ── Component ─────────────────────────────────────────────────────
export function WikipediaAudit({ articleUrl }: { articleUrl: string }) {
  const [startDate, setStartDate] = useState(isoDaysAgo(89));
  const [endDate, setEndDate] = useState(isoToday());
  const [pendingStart, setPendingStart] = useState(isoDaysAgo(89));
  const [pendingEnd, setPendingEnd] = useState(isoToday());

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [review, setReview] = useState<ReviewData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewAbortRef = useRef<AbortController | null>(null);

  const fetchAnalytics = useCallback(async (start: string, end: string) => {
    setLoadingAnalytics(true);
    setLoadingReview(true);
    setAnalytics(null);
    setReview(null);
    setError(null);

    // Cancel any in-flight review request
    reviewAbortRef.current?.abort();

    try {
      const res = await fetch(
        `/api/wiki/analytics?q=${encodeURIComponent(articleUrl)}&start_date=${start}&end_date=${end}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Error ${res.status}`);
        setLoadingAnalytics(false);
        setLoadingReview(false);
        return;
      }
      setAnalytics(data);
      setLoadingAnalytics(false);

      // Kick off review
      const ac = new AbortController();
      reviewAbortRef.current = ac;
      const rRes = await fetch("/api/wiki/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          extract: data._extract,
          metrics: data.metrics,
          maintenance_flags: data.maintenance_flags,
        }),
        signal: ac.signal,
      });
      const rData = await rRes.json().catch(() => ({
        error: `Server error (HTTP ${rRes.status})`,
      }));
      setReview(rData);
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== "AbortError") {
        setError(e.message);
      }
    } finally {
      setLoadingAnalytics(false);
      setLoadingReview(false);
    }
  }, [articleUrl]);

  useEffect(() => {
    fetchAnalytics(startDate, endDate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleApply() {
    if (!pendingStart || !pendingEnd || pendingStart > pendingEnd) return;
    setStartDate(pendingStart);
    setEndDate(pendingEnd);
    fetchAnalytics(pendingStart, pendingEnd);
  }

  const grade = review?.quality_tier ? TIER_LABEL[review.quality_tier] : null;

  return (
    <div className="flex flex-col gap-6 p-8">

      {/* ── Page controls: date range + grade ─────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              From
            </label>
            <input
              type="date"
              value={pendingStart}
              max={pendingEnd}
              onChange={(e) => setPendingStart(e.target.value)}
              className="rounded-lg border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              To
            </label>
            <input
              type="date"
              value={pendingEnd}
              min={pendingStart}
              max={isoToday()}
              onChange={(e) => setPendingEnd(e.target.value)}
              className="rounded-lg border border-brand-ink/10 bg-white px-3 py-2 text-sm text-brand-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
          <button
            onClick={handleApply}
            disabled={loadingAnalytics}
            className="rounded-lg bg-brand-indigo px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loadingAnalytics ? "Loading…" : "Apply"}
          </button>
        </div>

        {/* Grade stamp */}
        {grade && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
              Grade
            </span>
            <div
              className={`rotate-[-2deg] rounded border-2 px-4 py-1.5 font-mono text-2xl font-bold ${GRADE_COLOR[grade] ?? "text-brand-ink border-brand-ink"}`}
            >
              {grade}
            </div>
            {review?.quality_tier && (
              <span className="text-xs text-brand-muted">
                {TIER_MEANING[review.quality_tier]}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Error ─────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Loading skeleton ──────────────────────────────────── */}
      {loadingAnalytics && (
        <div className="flex items-center gap-3 text-sm text-brand-muted">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-ink/10 border-t-brand-indigo" />
          Pulling traffic and article content…
        </div>
      )}

      {analytics && (
        <>
          {/* Article link */}
          <div className="flex items-baseline gap-3">
            <a
              href={analytics.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-indigo hover:underline"
            >
              View on {analytics.project} ↗
            </a>
          </div>

          {/* ── Wikipedia flags ───────────────────────────────── */}
          {analytics.maintenance_flags.length > 0 && (
            <section>
              <h2 className="mb-3 text-base font-semibold text-brand-ink">
                Open issues on this Wikipedia page
              </h2>
              <div className="flex flex-col gap-3">
                {analytics.maintenance_flags.map((f) => (
                  <div
                    key={f.template}
                    className={`flex gap-3 rounded-lg border p-4 ${SEV_COLOR[f.severity] ?? "bg-white border-brand-ink/10"}`}
                  >
                    <span className="mt-0.5 text-lg leading-none">
                      {FLAG_ICONS[f.severity] ?? "📌"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <p className={`font-semibold text-sm ${SEV_TITLE[f.severity]}`}>
                          {f.label}
                        </p>
                        <code className="text-xs text-brand-muted">
                          {`{{${f.template}}}`}
                        </code>
                      </div>
                      {f.description && (
                        <p className="text-sm text-brand-ink leading-relaxed mb-2">
                          {f.description}
                        </p>
                      )}
                      {f.action && (
                        <p className="text-xs text-brand-muted border-t border-black/10 pt-2 mt-2">
                          <span className="font-semibold text-brand-ink">How to fix: </span>
                          {f.action}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Stats grid ────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-px rounded-xl border border-brand-ink/8 overflow-hidden bg-brand-ink/8">
            {[
              { value: fmt(analytics.metrics.total_views), label: "Total views" },
              { value: fmt(analytics.metrics.avg_daily_views), label: "Avg / day" },
              { value: fmt(analytics.metrics.peak_views), label: "Peak day" },
              { value: fmt(analytics.metrics.reference_count), label: "References" },
              { value: fmt(analytics.metrics.word_count), label: "Words" },
              {
                value: String(analytics.metrics.flag_count),
                label: "Page flags",
                highlight: analytics.metrics.flag_count > 0,
              },
            ].map((s) => (
              <div key={s.label} className="brand-card p-4">
                <div
                  className={`font-mono text-xl font-semibold ${
                    s.highlight ? "text-red-600" : "text-brand-ink"
                  }`}
                >
                  {s.value}
                </div>
                <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-brand-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Traffic chart ─────────────────────────────────── */}
          <div className="brand-card rounded-xl border border-brand-ink/8 p-5">
            <h2 className="mb-1 text-base font-semibold text-brand-ink">
              Daily pageviews
            </h2>
            <p className="mb-4 text-sm text-brand-muted">
              Human traffic over the selected date range (spiders excluded).
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics.pageviews}>
                <defs>
                  <linearGradient id="wikiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c78ff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c78ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#6f6e7a" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  tickCount={6}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6f6e7a" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e2da",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v) => [(v as number).toLocaleString(), "Views"]}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#7c78ff"
                  strokeWidth={2}
                  fill="url(#wikiGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── Editor's review ───────────────────────────────── */}
          <section>
            <h2 className="mb-3 text-base font-semibold text-brand-ink">
              Editor&apos;s review
            </h2>

            {loadingReview && (
              <div className="flex items-center gap-3 text-sm text-brand-muted">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-ink/10 border-t-brand-indigo" />
                Claude is reviewing the article…
              </div>
            )}

            {review?.error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {review.error}
              </div>
            )}

            {review && !review.error && (
              <div className="flex flex-col gap-3">
                {review.assessment && (
                  <p className="rounded-r-lg border-l-4 border-l-brand-indigo bg-brand-indigo/5 px-4 py-3 text-sm text-brand-ink leading-relaxed">
                    {review.assessment}
                  </p>
                )}
                {(review.issues ?? []).length === 0 && (
                  <p className="text-sm text-green-700">
                    No further issues found — this article is in good shape.
                  </p>
                )}
                {(review.issues ?? []).map((i, idx) => {
                  const s = ["high", "medium", "low"].includes(i.severity)
                    ? i.severity
                    : "info";
                  return (
                    <div
                      key={idx}
                      className={`rounded-r-lg border border-l-4 bg-white p-4 ${REVIEW_SEV_BAR[s] ?? "border-l-brand-indigo"} border-brand-ink/8`}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white ${REVIEW_SEV_BADGE[s]}`}
                        >
                          {i.severity || "info"}
                        </span>
                        <span className="text-sm font-semibold text-brand-ink">
                          {i.title}
                        </span>
                        {i.category && (
                          <span className="ml-auto text-[11px] uppercase tracking-wider text-brand-muted">
                            {i.category}
                          </span>
                        )}
                      </div>
                      {i.detail && (
                        <p className="text-sm text-brand-ink leading-relaxed mb-2">
                          {i.detail}
                        </p>
                      )}
                      {i.suggested_action && (
                        <p className="text-xs text-brand-muted border-t border-brand-ink/8 pt-2">
                          <span className="font-semibold text-brand-indigo">Next: </span>
                          {i.suggested_action}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

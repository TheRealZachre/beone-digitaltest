"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Radar,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import type {
  EntitySentimentReport,
  ReputationScanResponse,
} from "@/lib/reputation/types";

const statusStyles = {
  healthy: "border-emerald-200 bg-emerald-50 text-emerald-800",
  watch: "border-amber-200 bg-amber-50 text-amber-800",
  alert: "border-rose-200 bg-rose-50 text-rose-800",
};

const typeLabels = {
  company: "Company",
  product: "Product",
  executive: "Executive",
};

export function ReputationMonitor() {
  const [loading, setLoading] = useState(false);
  const [sendSlack, setSendSlack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReputationScanResponse | null>(null);

  async function handleScan(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reputation/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendSlack }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Scan failed");
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
        onSubmit={handleScan}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Sentiment drift scan
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Monitors company, products, and executives across news + social.
                Alerts when sentiment drops {result?.thresholdPercent ?? 10}%+
                vs baseline.
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Radar className="h-4 w-4" />
            )}
            {loading ? "Scanning…" : "Run scan"}
          </button>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={sendSlack}
            onChange={(event) => setSendSlack(event.target.checked)}
            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
          />
          Send Slack alerts for threshold breaches (requires SLACK_WEBHOOK_URL)
        </label>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      </form>

      {result && (
        <>
          <div
            className={clsx(
              "rounded-xl border p-5",
              result.alerts.length > 0
                ? "border-rose-200 bg-rose-50/60"
                : "border-emerald-200 bg-emerald-50/60"
            )}
          >
            <div className="flex items-start gap-3">
              {result.alerts.length > 0 ? (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
              ) : (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              )}
              <div>
                <p className="font-semibold text-slate-900">{result.summary}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Scanned {new Date(result.scannedAt).toLocaleString()} ·{" "}
                  {result.responseTimeMs}ms · {result.entities.length} entities
                  {result.slackConfigured
                    ? result.slackAlertsSent > 0
                      ? ` · ${result.slackAlertsSent} Slack alert(s) sent`
                      : " · Slack configured"
                    : " · Slack not configured"}
                </p>
              </div>
            </div>
          </div>

          {result.alerts.length > 0 && (
            <section className="rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-rose-900">Active alerts</h3>
              <ul className="mt-4 space-y-3">
                {result.alerts.map((alert) => (
                  <li
                    key={alert.id}
                    className="rounded-lg border border-rose-100 bg-rose-50/50 p-4 text-sm"
                  >
                    <p className="font-medium text-slate-900">
                      {alert.entityLabel}{" "}
                      <span className="text-rose-700">
                        {alert.driftPercent}%
                      </span>
                    </p>
                    <p className="mt-1 text-slate-600">{alert.message}</p>
                    {alert.slackDelivered && (
                      <p className="mt-2 text-xs font-medium text-emerald-700">
                        Delivered to Slack
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Entity sentiment ({result.entities.length})
            </h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {result.entities.map((report) => (
                <EntityCard key={report.entity.id} report={report} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function EntityCard({ report }: { report: EntitySentimentReport }) {
  const TrendIcon =
    report.trend === "improving"
      ? TrendingUp
      : report.trend === "declining"
        ? TrendingDown
        : TrendingUp;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {typeLabels[report.entity.type]}
          </p>
          <h4 className="font-semibold text-slate-900">{report.entity.label}</h4>
        </div>
        <span
          className={clsx(
            "rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
            statusStyles[report.status]
          )}
        >
          {report.status}
        </span>
      </div>

      <div className="mt-4 flex items-end gap-4">
        <div>
          <p className="text-3xl font-semibold text-slate-900">
            {report.currentSentiment}
          </p>
          <p className="text-xs text-slate-500">current / 100</p>
        </div>
        <div className="text-sm text-slate-500">
          <p>Baseline: {report.baselineSentiment}</p>
          <p
            className={clsx(
              "flex items-center gap-1 font-medium",
              report.driftPercent < 0 ? "text-rose-600" : "text-emerald-600"
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {report.driftPercent > 0 ? "+" : ""}
            {report.driftPercent}% drift
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {report.mentionCount} mentions ({report.newsCount} news ·{" "}
        {report.socialCount} social)
      </p>

      {report.topMentions.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {report.topMentions.slice(0, 2).map((mention) => (
            <li key={mention.id} className="text-xs text-slate-600">
              <span
                className={clsx(
                  "mr-2 rounded px-1.5 py-0.5 font-medium capitalize",
                  mention.sentimentLabel === "positive"
                    ? "bg-emerald-100 text-emerald-800"
                    : mention.sentimentLabel === "negative"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-slate-100 text-slate-600"
                )}
              >
                {mention.sentimentLabel}
              </span>
              {mention.title.slice(0, 90)}
              {mention.title.length > 90 ? "…" : ""}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

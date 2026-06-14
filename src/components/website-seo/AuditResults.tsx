"use client";

import { Copy, Download } from "lucide-react";
import clsx from "clsx";
import { SeoScoreBadge } from "@/components/youtube/SeoScoreBadge";
import { formatAuditForExport } from "@/lib/website-seo/format-audit";
import type { WebsiteAuditResponse } from "@/lib/website-seo/types";

interface AuditResultsProps {
  result: WebsiteAuditResponse;
  onReset?: () => void;
}

const statusColors = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  critical: "border-rose-200 bg-rose-50 text-rose-800",
};

const impactColors = {
  high: "bg-rose-100 text-rose-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-slate-100 text-slate-600",
};

export function AuditResults({ result, onReset }: AuditResultsProps) {
  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
  }

  function downloadReport() {
    const blob = new Blob([formatAuditForExport(result)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.domain}-seo-audit.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Executive summary
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {result.domain}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {result.executiveSummary}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Audited {new Date(result.auditedAt).toLocaleString()} ·{" "}
              {result.responseTimeMs}ms response
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SeoScoreBadge score={result.overallScore} size="md" />
            <button
              type="button"
              onClick={downloadReport}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              type="button"
              onClick={() => copyText(formatAuditForExport(result))}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Copy className="h-4 w-4" />
              Copy all
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Top 5 priority actions</h3>
        <ol className="mt-4 space-y-4">
          {result.topPriorities.map((finding, index) => (
            <li
              key={finding.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {index + 1}. {finding.title}
                </span>
                <span
                  className={clsx(
                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    impactColors[finding.impact]
                  )}
                >
                  {finding.impact} impact
                </span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">
                  {finding.effort} effort
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{finding.summary}</p>
              <p className="mt-2 text-sm text-slate-500">
                <span className="font-medium text-slate-700">Why it matters: </span>
                {finding.whyItMatters}
              </p>
              <p className="mt-2 text-sm text-teal-800">
                <span className="font-medium">How to fix: </span>
                {finding.howToFix}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="mb-4 font-semibold text-slate-900">
          Section-by-section findings
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {result.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-slate-900">{section.label}</h4>
                <SeoScoreBadge score={section.score} />
              </div>
              {section.workingWell.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium uppercase text-emerald-700">
                    Working well
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-slate-600">
                    {section.workingWell.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {section.needsImprovement.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium uppercase text-amber-700">
                    Needs improvement
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-slate-600">
                    {section.needsImprovement.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Priority matrix</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2 pr-4">Issue</th>
                <th className="py-2 pr-4">Impact</th>
                <th className="py-2 pr-4">Effort</th>
                <th className="py-2">Fix</th>
              </tr>
            </thead>
            <tbody>
              {result.priorityMatrix.map((finding) => (
                <tr key={finding.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {finding.title}
                  </td>
                  <td className="py-3 pr-4 capitalize">{finding.impact}</td>
                  <td className="py-3 pr-4 capitalize">{finding.effort}</td>
                  <td className="py-3 text-slate-600">{finding.howToFix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Ranking snapshot</h3>
        <p className="mt-1 text-xs text-slate-400">
          Estimated positions from on-page keyword alignment. Connect Search
          Console for live ranking data.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2 pr-4">Keyword</th>
                <th className="py-2 pr-4">Google</th>
                <th className="py-2 pr-4">Bing</th>
                <th className="py-2 pr-4">Yahoo</th>
                <th className="py-2">Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {result.rankingSnapshot.map((row) => (
                <tr key={row.keyword} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {row.keyword}
                  </td>
                  <td className="py-3 pr-4">#{row.google}</td>
                  <td className="py-3 pr-4">#{row.bing}</td>
                  <td className="py-3 pr-4">#{row.yahoo}</td>
                  <td className="py-3 text-slate-600">{row.opportunity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">
          30 / 60 / 90-day improvement roadmap
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {result.roadmap.map((phase) => (
            <div
              key={phase.timeframe}
              className="rounded-lg border border-teal-100 bg-teal-50/40 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                {phase.timeframe}
              </p>
              <h4 className="mt-1 font-semibold text-slate-900">{phase.title}</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {phase.tasks.map((task) => (
                  <li key={task}>• {task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {result.competitor && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">Competitor comparison</h3>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div>
              <p className="text-sm text-slate-500">Your site</p>
              <SeoScoreBadge score={result.overallScore} size="md" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{result.competitor.domain}</p>
              <SeoScoreBadge score={result.competitor.overallScore} size="md" />
            </div>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-slate-600">
            {result.competitor.highlights.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Search engine coverage</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {result.searchEngineNotes.map((note) => (
            <div
              key={note.engine}
              className={clsx(
                "rounded-lg border px-4 py-3",
                statusColors[note.status === "analyzed" ? "good" : "warning"]
              )}
            >
              <p className="text-sm font-medium">{note.engine}</p>
              <p className="mt-1 text-xs">{note.note}</p>
            </div>
          ))}
        </div>
      </section>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          Run another audit
        </button>
      )}
    </div>
  );
}

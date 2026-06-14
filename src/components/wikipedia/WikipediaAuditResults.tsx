"use client";

import { Copy, Download, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { SeoScoreBadge } from "@/components/youtube/SeoScoreBadge";
import { formatWikipediaAuditForExport } from "@/lib/wikipedia/format-audit";
import type {
  WikipediaAuditResponse,
  WikipediaFinding,
  WikipediaPageSnapshot,
} from "@/lib/wikipedia/types";

interface WikipediaAuditResultsProps {
  result: WikipediaAuditResponse;
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

const pageLabels = {
  company: "Company",
  ceo: "CEO",
  cross: "Cross-page",
};

export function WikipediaAuditResults({
  result,
  onReset,
}: WikipediaAuditResultsProps) {
  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
  }

  function downloadReport() {
    const blob = new Blob([formatWikipediaAuditForExport(result)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result.companyName.toLowerCase().replace(/\s+/g, "-")}-wikipedia-audit.txt`;
    anchor.click();
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
              {result.companyName} · {result.ceoName}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {result.executiveSummary}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Audited {new Date(result.auditedAt).toLocaleString()} ·{" "}
              {result.responseTimeMs}ms
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
              onClick={() => copyText(formatWikipediaAuditForExport(result))}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              <Copy className="h-4 w-4" />
              Copy all
            </button>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Run again
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PageScoreCard label="Company page" snapshot={result.company} />
        <PageScoreCard label="CEO page" snapshot={result.ceo} />
      </div>

      {result.narrativeSignals.length > 0 && (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <h3 className="font-semibold text-indigo-900">
            Social channel signals to reflect on Wikipedia
          </h3>
          <p className="mt-1 text-sm text-indigo-800/80">
            Themes from your synced social posts that may deserve cited, neutral
            coverage on Wikipedia.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.narrativeSignals.map((signal) => (
              <li
                key={signal}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-800 shadow-sm"
              >
                {signal}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Top priority updates</h3>
        <ol className="mt-4 space-y-4">
          {result.topPriorities.map((finding, index) => (
            <FindingCard key={finding.id} finding={finding} index={index} />
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">All recommendations</h3>
        <div className="mt-4 space-y-3">
          {result.findings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">90-day update roadmap</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {result.roadmap.map((item) => (
            <div
              key={item.timeframe}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                {item.timeframe}
              </p>
              <h4 className="mt-1 font-medium text-slate-900">{item.title}</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {item.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PageScoreCard({
  label,
  snapshot,
}: {
  label: string;
  snapshot: WikipediaPageSnapshot;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <h3 className="mt-1 font-semibold text-slate-900">{snapshot.title}</h3>
          {snapshot.exists && (
            <a
              href={snapshot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800"
            >
              View on Wikipedia
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <SeoScoreBadge score={snapshot.score} size="sm" />
      </div>

      {snapshot.exists ? (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Metric label="Last edited" value={formatDate(snapshot.lastEdited)} />
            <Metric label="References" value={String(snapshot.referenceCount)} />
            <Metric label="Word count" value={snapshot.wordCount.toLocaleString()} />
            <Metric label="Sections" value={String(snapshot.sectionCount)} />
          </dl>

          {snapshot.maintenanceFlags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {snapshot.maintenanceFlags.map((flag) => (
                <span
                  key={flag}
                  className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800"
                >
                  {flag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ListBlock title="Working well" items={snapshot.workingWell} tone="good" />
            <ListBlock
              title="Needs improvement"
              items={snapshot.needsImprovement}
              tone="warning"
            />
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-rose-600">
          Article not found. Verify the page title or create a neutral, well-sourced
          draft if notability criteria are met.
        </p>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function ListBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "warning";
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={clsx(
        "rounded-lg border p-3",
        tone === "good"
          ? "border-emerald-100 bg-emerald-50/50"
          : "border-amber-100 bg-amber-50/50"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function FindingCard({
  finding,
  index,
}: {
  finding: WikipediaFinding;
  index?: number;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {index != null && (
          <span className="text-sm font-semibold text-slate-900">
            {index + 1}.
          </span>
        )}
        <span className="text-sm font-semibold text-slate-900">
          {finding.title}
        </span>
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
            statusColors[finding.status]
          )}
        >
          {finding.status}
        </span>
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
          {pageLabels[finding.page]}
        </span>
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
            impactColors[finding.impact]
          )}
        >
          {finding.impact} impact
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{finding.summary}</p>
      <p className="mt-2 text-xs text-slate-500">
        <strong className="text-slate-700">Why it matters:</strong>{" "}
        {finding.whyItMatters}
      </p>
      <p className="mt-2 text-sm text-violet-900">
        <strong>Recommended update:</strong> {finding.howToFix}
      </p>
    </div>
  );
}

function formatDate(iso?: string): string {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

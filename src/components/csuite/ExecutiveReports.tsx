"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import type {
  MonthlyExecutiveReport,
  QuarterlyExecutiveReport,
} from "@/lib/csuite/types";

type ReportTab = "monthly" | "quarterly";

export function ExecutiveReports() {
  const [tab, setTab] = useState<ReportTab>("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthly, setMonthly] = useState<MonthlyExecutiveReport | null>(null);
  const [quarterly, setQuarterly] = useState<QuarterlyExecutiveReport | null>(
    null
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [monthRes, quarterRes] = await Promise.all([
          fetch("/api/csuite/reports?timeframe=monthly"),
          fetch("/api/csuite/reports?timeframe=quarterly"),
        ]);
        const monthData = await monthRes.json();
        const quarterData = await quarterRes.json();
        if (!monthRes.ok) throw new Error(monthData.error);
        if (!quarterRes.ok) throw new Error(quarterData.error);
        setMonthly(monthData);
        setQuarterly(quarterData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading performance reports...
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["monthly", "quarterly"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={clsx(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              tab === id
                ? "bg-violet-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            )}
          >
            {id} report
          </button>
        ))}
      </div>

      {tab === "monthly" && monthly && (
        <MonthlyReportView report={monthly} />
      )}
      {tab === "quarterly" && quarterly && (
        <QuarterlyReportView report={quarterly} />
      )}
    </div>
  );
}

function MonthlyReportView({ report }: { report: MonthlyExecutiveReport }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Monthly Report — {report.periodLabel}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Post-by-post performance for all executive content published this month.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {report.executives.map((exec) => (
          <div
            key={exec.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="font-semibold text-slate-900">{exec.name}</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Posts</dt>
                <dd className="font-medium">{exec.postsPublished}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Impressions</dt>
                <dd className="font-medium">
                  {exec.totalImpressions.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Avg ER</dt>
                <dd className="font-medium">{exec.avgEngagementRate}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Follower growth</dt>
                <dd className="font-medium">+{exec.followerGrowth}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Top-performing posts</h3>
        <div className="mt-4 space-y-3">
          {report.topPerformers.map((post) => (
            <div
              key={post.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-800">
                  {post.executiveName}
                </span>
                <span>·</span>
                <span className="capitalize">{post.platform}</span>
                <span>·</span>
                <span>{post.storyBeat}</span>
                <span>·</span>
                <span>{post.metrics.engagementRate}% ER</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{post.content}</p>
              <p className="mt-2 text-xs text-slate-400">
                {post.metrics.impressions.toLocaleString()} impressions · +
                {post.metrics.followerGrowth} followers attributed
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">All posts this month</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2 pr-4">Executive</th>
                <th className="py-2 pr-4">Platform</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Impressions</th>
                <th className="py-2 pr-4">ER</th>
                <th className="py-2">Growth</th>
              </tr>
            </thead>
            <tbody>
              {report.posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4">{post.executiveName}</td>
                  <td className="py-3 pr-4 capitalize">{post.platform}</td>
                  <td className="py-3 pr-4">{post.storyBeat}</td>
                  <td className="py-3 pr-4">
                    {post.metrics.impressions.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">{post.metrics.engagementRate}%</td>
                  <td className="py-3">+{post.metrics.followerGrowth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function QuarterlyReportView({ report }: { report: QuarterlyExecutiveReport }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Quarterly Report — {report.periodLabel}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Reach growth (QoQ)"
            value={`+${report.reachGrowthPercent}%`}
          />
          <StatCard
            label="Engagement vs peers"
            value={`${report.engagementVsPeers}x`}
          />
          <StatCard
            label="Content categories"
            value={String(report.categoryPerformance.length)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Month-over-month trend</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2 pr-4">Month</th>
                <th className="py-2 pr-4">Impressions</th>
                <th className="py-2">Engagement rate</th>
              </tr>
            </thead>
            <tbody>
              {report.monthOverMonth.map((row) => (
                <tr key={row.month} className="border-b border-slate-100">
                  <td className="py-3 pr-4">{row.month}</td>
                  <td className="py-3 pr-4">
                    {row.impressions.toLocaleString()}
                  </td>
                  <td className="py-3">{row.engagementRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">
          Content category performance
        </h3>
        <div className="mt-4 space-y-3">
          {report.categoryPerformance.map((cat) => (
            <div
              key={cat.storyBeat}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
            >
              <span className="font-medium text-slate-800">{cat.storyBeat}</span>
              <span className="text-slate-500">
                {cat.postCount} posts · {cat.avgEngagementRate}% avg ER
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Peer benchmarks</h3>
        <div className="mt-4 space-y-3">
          {report.peerBenchmark.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-lg border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm"
            >
              <span className="text-slate-700">{row.label}</span>
              <span className="font-medium text-slate-900">
                {row.value}{" "}
                <span className="font-normal text-slate-500">
                  (industry avg: {row.industryAvg})
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/40 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

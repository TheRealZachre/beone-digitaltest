"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import clsx from "clsx";
import { format, isValid, parseISO } from "date-fns";
import type { AudienceSnapshot } from "@/lib/types";
import { metricDefinition } from "@/lib/metric-definitions";
import { MetricLabel } from "@/components/dashboard/MetricLabel";
import {
  attachPriorYearFollowers,
  computeYearOverYearGrowth,
  filterAudienceGrowthByRange,
  formatAudienceGrowthRange,
  getAudienceGrowthBounds,
  getDefaultAudienceGrowthRange,
} from "@/lib/audience-growth";

interface AudienceGrowthChartProps {
  data: AudienceSnapshot[];
  expanded?: boolean;
  showYearOverYear?: boolean;
}

type RangePreset = "1y" | "custom";

export function AudienceGrowthChart({
  data,
  expanded = false,
  showYearOverYear = false,
}: AudienceGrowthChartProps) {
  const bounds = useMemo(() => getAudienceGrowthBounds(data), [data]);
  const defaultRange = useMemo(() => getDefaultAudienceGrowthRange(data), [data]);

  const [preset, setPreset] = useState<RangePreset>("1y");
  const [customStart, setCustomStart] = useState(() =>
    format(defaultRange.start, "yyyy-MM-dd")
  );
  const [customEnd, setCustomEnd] = useState(() =>
    format(defaultRange.end, "yyyy-MM-dd")
  );

  const { rangeStart, rangeEnd } = useMemo(() => {
    if (preset === "1y") {
      return { rangeStart: defaultRange.start, rangeEnd: defaultRange.end };
    }

    const start = parseISO(customStart);
    const end = parseISO(customEnd);
    if (!isValid(start) || !isValid(end) || start > end) {
      return { rangeStart: defaultRange.start, rangeEnd: defaultRange.end };
    }

    return { rangeStart: start, rangeEnd: end };
  }, [preset, customStart, customEnd, defaultRange]);

  const filteredData = useMemo(
    () => filterAudienceGrowthByRange(data, rangeStart, rangeEnd),
    [data, rangeStart, rangeEnd]
  );

  const yearOverYear = useMemo(
    () =>
      showYearOverYear
        ? computeYearOverYearGrowth(data, rangeEnd)
        : null,
    [data, rangeEnd, showYearOverYear]
  );

  const hasPriorYearSeries = useMemo(
    () =>
      showYearOverYear &&
      attachPriorYearFollowers(data, filteredData).some(
        (point) => point.priorYearFollowers != null
      ),
    [data, filteredData, showYearOverYear]
  );

  const dateRangeLabel = formatAudienceGrowthRange(rangeStart, rangeEnd);
  const useYearInAxis = filteredData.length > 12;

  const chartData = useMemo(
    () =>
      attachPriorYearFollowers(data, filteredData).map((point) => ({
        date: point.date,
        label: format(parseISO(point.date), useYearInAxis ? "MMM yy" : "MMM"),
        followers: point.followers,
        priorYearFollowers: point.priorYearFollowers,
        growth: point.growth,
      })),
    [data, filteredData, useYearInAxis]
  );

  const minDate = format(bounds.min, "yyyy-MM-dd");
  const maxDate = format(bounds.max, "yyyy-MM-dd");
  const yoyPositive = (yearOverYear?.absolute ?? 0) >= 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            <MetricLabel definition={metricDefinition("audienceGrowth")}>
              Audience Growth
            </MetricLabel>
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Combined followers across all social channels
          </p>
          <p className="mt-0.5 text-sm font-medium text-slate-700">
            {dateRangeLabel}
          </p>
          {yearOverYear && (
            <p
              className={clsx(
                "mt-2 text-sm font-semibold",
                yoyPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {yoyPositive ? "+" : ""}
              {yearOverYear.absolute.toLocaleString()} followers (
              {yoyPositive ? "+" : ""}
              {yearOverYear.percent}% YoY)
              <span className="ml-1 font-normal text-slate-500">
                · {yearOverYear.priorLabel} vs {yearOverYear.currentLabel}
              </span>
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {(
            [
              { id: "1y" as const, label: "1 year" },
              { id: "custom" as const, label: "Custom" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPreset(id)}
              className={clsx(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition",
                preset === id
                  ? "border-brand-indigo bg-brand-indigo/10 text-brand-indigo"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {preset === "custom" && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Start</span>
            <input
              type="date"
              value={customStart}
              min={minDate}
              max={customEnd || maxDate}
              onChange={(event) => setCustomStart(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">End</span>
            <input
              type="date"
              value={customEnd}
              min={customStart || minDate}
              max={maxDate}
              onChange={(event) => setCustomEnd(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900"
            />
          </label>
        </div>
      )}

      <div className={clsx("mt-6", expanded ? "h-96" : "h-64")}>
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No audience data for this date range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="followerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(Number(value) / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                }}
                labelFormatter={(_, payload) => {
                  const date = payload?.[0]?.payload?.date;
                  return date ? format(parseISO(date), "MMM d, yyyy") : "";
                }}
                formatter={(value, name) => [
                  Number(value).toLocaleString(),
                  name === "priorYearFollowers" ? "Prior year" : "Followers",
                ]}
              />
              {hasPriorYearSeries && (
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={28}
                  iconType="line"
                  formatter={(value) =>
                    value === "priorYearFollowers" ? "Prior year" : "Current year"
                  }
                />
              )}
              <Area
                type="monotone"
                dataKey="followers"
                name="followers"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#followerGrad)"
              />
              {hasPriorYearSeries && (
                <Line
                  type="monotone"
                  dataKey="priorYearFollowers"
                  name="priorYearFollowers"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

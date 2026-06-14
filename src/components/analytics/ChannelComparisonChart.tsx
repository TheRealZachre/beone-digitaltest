"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChannelSummary, Platform } from "@/lib/types";
import { formatNumber } from "@/lib/metrics";
import { getChannelConfigByPlatform } from "@/lib/analytics/channels";

interface ChannelComparisonChartProps {
  channels: ChannelSummary[];
  channelPostDateRanges?: Partial<Record<Platform, string>>;
}

interface ChartDatum {
  name: string;
  platform: Platform;
  reach: number;
  impressions: number;
  posts: number;
  postDateRange: string;
  color: string;
}

function ChannelComparisonTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDatum }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-slate-900">{data.name}</p>
      <p className="mt-1 text-xs text-slate-500">{data.postDateRange}</p>
      <dl className="mt-2 space-y-1 text-xs text-slate-700">
        <div className="flex justify-between gap-6">
          <dt>Posts loaded</dt>
          <dd className="font-medium">{data.posts.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt>Reach</dt>
          <dd className="font-medium">{formatNumber(data.reach)}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt>Impressions</dt>
          <dd className="font-medium">{formatNumber(data.impressions)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function ChannelComparisonChart({
  channels,
  channelPostDateRanges,
}: ChannelComparisonChartProps) {
  const chartData: ChartDatum[] = channels.map((channel) => ({
    name: channel.label,
    platform: channel.platform,
    reach: channel.totalReach,
    impressions: channel.totalImpressions,
    posts: channel.postCount,
    postDateRange:
      channelPostDateRanges?.[channel.platform] ??
      `${channel.postCount.toLocaleString()} posts loaded`,
    color: getChannelConfigByPlatform(channel.platform)?.color ?? "#6366f1",
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Cross-channel reach &amp; impressions
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        All loaded posts across every selected channel
      </p>
      <p className="mt-0.5 text-sm font-medium text-slate-700">
        Hover a bar for reach and impressions — post date ranges shown below
      </p>

      <div className="mt-6 h-80">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No channel data loaded yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatNumber(Number(value))}
                width={56}
              />
              <Tooltip content={<ChannelComparisonTooltip />} />
              <Legend />
              <Bar
                dataKey="reach"
                fill="#6366f1"
                name="Reach"
                radius={[4, 4, 0, 0]}
                minPointSize={2}
              />
              <Bar
                dataKey="impressions"
                fill="#a5b4fc"
                name="Impressions"
                radius={[4, 4, 0, 0]}
                minPointSize={2}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {chartData.map((channel) => (
          <li
            key={channel.platform}
            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
          >
            <span className="font-semibold text-slate-900">{channel.name}</span>
            <span className="mx-1">·</span>
            <span>
              {channel.posts === 0
                ? "No posts in this period"
                : channel.postDateRange}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

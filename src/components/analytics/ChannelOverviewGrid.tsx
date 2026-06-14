import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ChannelSummary } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/metrics";
import { metricDefinition } from "@/lib/metric-definitions";
import { MetricLabel } from "@/components/dashboard/MetricLabel";
import { getChannelConfigByPlatform } from "@/lib/analytics/channels";

interface ChannelOverviewGridProps {
  channels: ChannelSummary[];
}

export function ChannelOverviewGrid({ channels }: ChannelOverviewGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {channels.map((channel) => {
        const config = getChannelConfigByPlatform(channel.platform);
        const href = `/reports/channels/${channel.platform}`;

        return (
          <Link
            key={channel.platform}
            href={href}
            className="group overflow-visible rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: config?.color ?? "#6366f1" }}
                >
                  {channel.label.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">
                    {channel.label}
                  </h3>
                  <p className="text-xs text-slate-500">{channel.handle}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  channel.dataSource === "live"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {channel.dataSource === "live" ? "Live sync" : "Seed data"}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">
                  <MetricLabel definition={metricDefinition("followers")}>
                    Followers
                  </MetricLabel>
                </dt>
                <dd className="font-semibold text-slate-900">
                  {formatNumber(channel.followers)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">
                  <MetricLabel definition={metricDefinition("postCount")}>
                    Posts (loaded)
                  </MetricLabel>
                </dt>
                <dd className="font-semibold text-slate-900">
                  {channel.postCount}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">
                  <MetricLabel definition={metricDefinition("avgEngagementRate")}>
                    Avg. ER
                  </MetricLabel>
                </dt>
                <dd className="font-semibold text-slate-900">
                  {formatPercent(channel.avgEngagementRate)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">
                  <MetricLabel definition={metricDefinition("avgCTR")}>
                    Avg. CTR
                  </MetricLabel>
                </dt>
                <dd className="font-semibold text-slate-900">
                  {formatPercent(channel.avgCTR)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">
                  <MetricLabel definition={metricDefinition("reach")}>
                    Reach
                  </MetricLabel>
                </dt>
                <dd className="font-semibold text-slate-900">
                  {formatNumber(channel.totalReach)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">
                  <MetricLabel definition={metricDefinition("impressions")}>
                    Impressions
                  </MetricLabel>
                </dt>
                <dd className="font-semibold text-slate-900">
                  {formatNumber(channel.totalImpressions)}
                </dd>
              </div>
            </dl>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
              View channel
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

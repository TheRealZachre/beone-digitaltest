import { format } from "date-fns";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { FounderChannelSubnav } from "@/components/analytics/FounderChannelSubnav";
import { ChannelComparisonChart } from "@/components/analytics/ChannelComparisonChart";
import { ChannelOverviewGrid } from "@/components/analytics/ChannelOverviewGrid";
import { ChannelStatsRow } from "@/components/analytics/ChannelStatsRow";
import { DataSyncPanel } from "@/components/dashboard/DataSyncPanel";
import { ReportPostsGrid } from "@/components/dashboard/ReportPostsGrid";
import {
  getAlignedMonthPeriodPosts,
  getPostDateRangeLabel,
} from "@/lib/analytics/periods";
import {
  buildCrossChannelActivityFromPosts,
  buildCrossChannelTotals,
  buildCrossChannelVolumeFromChannelSummaries,
  buildMonthlyChannelSummaries,
  filterPostsByPlatform,
} from "@/lib/analytics/summaries";
import {
  getFounderAllPosts,
  getFounderBrand,
  getFounderChannelSummaries,
  FOUNDER_PLATFORMS,
} from "@/lib/data/founder";
import type { ChannelSummary, Platform } from "@/lib/types";

function crossChannelAsSummary(
  followerTotals: ReturnType<typeof buildCrossChannelTotals>,
  volume: ReturnType<typeof buildCrossChannelVolumeFromChannelSummaries>,
  rates: ReturnType<typeof buildCrossChannelActivityFromPosts>
): ChannelSummary {
  return {
    platform: "linkedin",
    label: followerTotals.label,
    handle: followerTotals.handle,
    followers: followerTotals.followers,
    followerGrowth: followerTotals.followerGrowth,
    postCount: volume.postCount,
    avgEngagementRate: rates.avgEngagementRate,
    avgCTR: rates.avgCTR,
    totalReach: volume.totalReach,
    totalImpressions: volume.totalImpressions,
    totalSpend: followerTotals.totalSpend,
    dataSource: "live",
  };
}

export default async function FounderAllChannelsPage() {
  const brand = await getFounderBrand();
  const { channels, channelSources, meta } = await getFounderChannelSummaries();
  const posts = await getFounderAllPosts();
  const liveChannelCount = channels.filter((c) => c.dataSource === "live").length;
  const followerTotals = buildCrossChannelTotals(channels);

  const { currentPosts, priorPosts, meta: alignedMeta } =
    getAlignedMonthPeriodPosts(posts);
  const currentPeriodChannels = buildMonthlyChannelSummaries(channels, currentPosts);
  const priorPeriodChannels = buildMonthlyChannelSummaries(channels, priorPosts);
  const currentVolume = buildCrossChannelVolumeFromChannelSummaries(currentPeriodChannels);
  const priorVolume = buildCrossChannelVolumeFromChannelSummaries(priorPeriodChannels);
  const currentRates = buildCrossChannelActivityFromPosts(currentPosts);
  const priorRates = buildCrossChannelActivityFromPosts(priorPosts);

  const channelSummary = crossChannelAsSummary(followerTotals, currentVolume, currentRates);
  const channelPostDateRanges = Object.fromEntries(
    currentPeriodChannels.map((channel) => [
      channel.platform,
      getPostDateRangeLabel(filterPostsByPlatform(currentPosts, channel.platform)),
    ])
  ) as Partial<Record<Platform, string>>;

  return (
    <>
      <Header
        title="All Channels"
        subtitle={`${brand.name} · ${format(new Date(), "MMMM yyyy")} · LinkedIn & X performance`}
      />
      <FounderChannelSubnav />

      {/* JVO Profile Banner */}
      <div className="mx-8 mt-6 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-indigo-100">
          <Image
            src="https://media.licdn.com/dms/image/v2/C5603AQGi1HJ5xFRiqQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1614704036756?e=1753920000&v=beta&t=qVA2-pL-pKvjLTi7wfMVBfR-K9xbMWF0tN4W1RL9oGo"
            alt="John V. Oyler"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">John V. Oyler</p>
          <p className="text-xs text-slate-500">Co-Founder, Chairman &amp; CEO · BeOne Medicines</p>
          <div className="mt-1 flex gap-3 text-xs text-indigo-600">
            <a href="https://www.linkedin.com/in/john-v-oyler/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
            <a href="https://x.com/johnvoyler" target="_blank" rel="noopener noreferrer" className="hover:underline">@johnvoyler</a>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-8">
        <DataSyncPanel
          initialMeta={meta ?? null}
          channelSources={channelSources}
          syncUrl="/api/sync/founder"
          availableChannels={FOUNDER_PLATFORMS}
          showChannelSelector={false}
          note="Data is based on the latest 50 posts per channel."
        />

        <section className="overflow-visible rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Social picture</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Unified view across LinkedIn &amp; X for{" "}
              {alignedMeta.currentDateRange} ({alignedMeta.dayCount} days).
              Posts, reach, and impressions are summed from posts published in
              that window and compared to {alignedMeta.priorDateRange}.
              {liveChannelCount === channels.length
                ? " Both channels are connected via live sync."
                : ` ${liveChannelCount} of ${channels.length} channels are live — use Pull Latest Data to refresh.`}
            </p>
          </div>

          {channels.length === 0 ? (
            <p className="mt-6 text-sm text-slate-600">
              No data yet. Click &ldquo;Pull Latest Data&rdquo; above to sync
              John&rsquo;s LinkedIn and X profiles.
            </p>
          ) : (
            <div className="mt-6">
              <ChannelStatsRow
                channel={channelSummary}
                priorMonth={priorRates}
                priorVolume={priorVolume}
                currentDateRange={alignedMeta.currentDateRange}
                priorDateRange={alignedMeta.priorDateRange}
              />
            </div>
          )}
        </section>

        <ChannelComparisonChart
          channels={currentPeriodChannels}
          channelPostDateRanges={channelPostDateRanges}
        />

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Channel breakdown</h2>
            <p className="mt-1 text-sm text-slate-500">
              Same period as Social picture · {alignedMeta.currentDateRange}
            </p>
          </div>
          <ChannelOverviewGrid channels={currentPeriodChannels} hrefPrefix="/founder/reports/channels" />
        </section>

        <ReportPostsGrid
          posts={posts}
          title="Posts across LinkedIn & X"
          emptyMessage="No posts loaded yet. Pull latest data to sync John's profiles."
          defaultSort="date-desc"
        />
      </div>
    </>
  );
}

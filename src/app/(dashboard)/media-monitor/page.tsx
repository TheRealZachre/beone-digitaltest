import { MediaMonitorSourcesGrid } from "@/components/media-monitor/MediaMonitorSourcesGrid";
import {
  MediaMonitorHero,
  MediaMonitorPageShell,
  SubPageLink,
} from "@/components/media-monitor/MediaMonitorPageShell";
import {
  MEDIA_MONITOR_OVERVIEW,
  MEDIA_MONITOR_PRODUCT_NAME,
  MEDIA_MONITOR_TAGLINE,
} from "@/lib/media-monitor/content";

export default function MediaMonitorOverviewPage() {
  return (
    <MediaMonitorPageShell
      title={MEDIA_MONITOR_PRODUCT_NAME}
      subtitle={MEDIA_MONITOR_TAGLINE}
    >
      <MediaMonitorHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {MEDIA_MONITOR_OVERVIEW}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Data sources
        </h2>
        <MediaMonitorSourcesGrid />
      </section>

      <section>
        <SubPageLink
          href="/media-monitor/search"
          title="Search Subject"
          description="Enter any subject to pull news articles and major social posts in one report."
        />
      </section>
    </MediaMonitorPageShell>
  );
}

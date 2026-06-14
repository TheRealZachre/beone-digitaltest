import { CrossChannelCapabilitiesGrid } from "@/components/cross-channel/CapabilitiesGrid";
import {
  CrossChannelHero,
  CrossChannelPageShell,
  SubPageLink,
} from "@/components/cross-channel/CrossChannelPageShell";
import {
  CROSS_CHANNEL_OVERVIEW,
  CROSS_CHANNEL_PRODUCT_NAME,
  CROSS_CHANNEL_TAGLINE,
} from "@/lib/cross-channel/content";

export default function CrossChannelOverviewPage() {
  return (
    <CrossChannelPageShell
      title={CROSS_CHANNEL_PRODUCT_NAME}
      subtitle={CROSS_CHANNEL_TAGLINE}
    >
      <CrossChannelHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {CROSS_CHANNEL_OVERVIEW}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          How it works
        </h2>
        <CrossChannelCapabilitiesGrid />
      </section>

      <section>
        <SubPageLink
          href="/cross-channel/recommendations"
          title="Amplification Recommendations"
          description="Detect LinkedIn hits and get per-platform boost, repost, and create actions for Instagram, X, and YouTube."
        />
      </section>
    </CrossChannelPageShell>
  );
}

import { ReputationCapabilitiesGrid } from "@/components/reputation/CapabilitiesGrid";
import {
  ReputationHero,
  ReputationPageShell,
  SubPageLink,
} from "@/components/reputation/ReputationPageShell";
import {
  REPUTATION_OVERVIEW,
  REPUTATION_PRODUCT_NAME,
  REPUTATION_TAGLINE,
} from "@/lib/reputation/content";

export default function ReputationOverviewPage() {
  return (
    <ReputationPageShell
      title={REPUTATION_PRODUCT_NAME}
      subtitle={REPUTATION_TAGLINE}
    >
      <ReputationHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {REPUTATION_OVERVIEW}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Capabilities
        </h2>
        <ReputationCapabilitiesGrid />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Explore the platform
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <SubPageLink
            href="/reputation/monitor"
            title="Sentiment Monitor"
            description="Run a drift scan across company, products, and executives with per-entity sentiment scores."
          />
          <SubPageLink
            href="/reputation/alerts"
            title="Slack Alerts"
            description="Configure webhook delivery and see what triggers a 10%+ sentiment drop alert."
          />
        </div>
      </section>
    </ReputationPageShell>
  );
}

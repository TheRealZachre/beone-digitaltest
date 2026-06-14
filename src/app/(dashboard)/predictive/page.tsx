import { PredictiveCapabilitiesGrid } from "@/components/predictive/CapabilitiesGrid";
import {
  PredictiveHero,
  PredictivePageShell,
  SubPageLink,
} from "@/components/predictive/PredictivePageShell";
import {
  PREDICTIVE_OVERVIEW,
  PREDICTIVE_PRODUCT_NAME,
  PREDICTIVE_TAGLINE,
} from "@/lib/predictive/content";

export default function PredictiveOverviewPage() {
  return (
    <PredictivePageShell
      title={PREDICTIVE_PRODUCT_NAME}
      subtitle={PREDICTIVE_TAGLINE}
    >
      <PredictiveHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {PREDICTIVE_OVERVIEW}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Capabilities
        </h2>
        <PredictiveCapabilitiesGrid />
      </section>

      <section>
        <SubPageLink
          href="/predictive/draft"
          title="Draft & Predict"
          description="Paste a post draft, forecast impressions and engagement, and get three optimized variants ranked by predicted lift."
        />
      </section>
    </PredictivePageShell>
  );
}

import { WikipediaCoverageGrid } from "@/components/wikipedia/WikipediaCoverageGrid";
import {
  SubPageLink,
  WikipediaHero,
  WikipediaPageShell,
} from "@/components/wikipedia/WikipediaPageShell";
import {
  WIKIPEDIA_OVERVIEW,
  WIKIPEDIA_PRODUCT_NAME,
  WIKIPEDIA_TAGLINE,
} from "@/lib/wikipedia/content";

export default function WikipediaOverviewPage() {
  return (
    <WikipediaPageShell
      title={WIKIPEDIA_PRODUCT_NAME}
      subtitle={WIKIPEDIA_TAGLINE}
    >
      <WikipediaHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {WIKIPEDIA_OVERVIEW}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          What the audit evaluates
        </h2>
        <WikipediaCoverageGrid />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Explore the platform
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <SubPageLink
            href="/wikipedia/audit"
            title="Run Audit"
            description="Fetch live company and CEO Wikipedia articles and get scored recommendations in seconds."
          />
          <SubPageLink
            href="/wikipedia/recommendations"
            title="What We Check"
            description="Detailed breakdown of verifiability, maintenance flags, cross-linking, and narrative alignment."
          />
        </div>
      </section>
    </WikipediaPageShell>
  );
}

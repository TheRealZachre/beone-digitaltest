import { AuditCoverageList } from "@/components/website-seo/AuditCoverageList";
import { CoverageGrid } from "@/components/website-seo/CoverageGrid";
import { OutputFormatGrid } from "@/components/website-seo/OutputFormatGrid";
import {
  SubPageLink,
  WebsiteSeoHero,
  WebsiteSeoPageShell,
} from "@/components/website-seo/WebsiteSeoPageShell";
import {
  WEBSITE_SEO_OVERVIEW,
  WEBSITE_SEO_PRODUCT_NAME,
  WEBSITE_SEO_TAGLINE,
} from "@/lib/website-seo/content";

export default function WebsiteSeoOverviewPage() {
  return (
    <WebsiteSeoPageShell
      title={WEBSITE_SEO_PRODUCT_NAME}
      subtitle={WEBSITE_SEO_TAGLINE}
    >
      <WebsiteSeoHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {WEBSITE_SEO_OVERVIEW}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Search engine coverage
        </h2>
        <CoverageGrid />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          What the audit covers
        </h2>
        <AuditCoverageList />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Audit output format
        </h2>
        <OutputFormatGrid />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Explore the platform
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SubPageLink
            href="/website-seo/audit"
            title="Run Audit"
            description="Scan any website on demand and get a full actionable SEO report in seconds."
          />
          <SubPageLink
            href="/website-seo/coverage"
            title="Search Coverage"
            description="Google, Bing, Yahoo, emerging engines, and AI search surface analysis."
          />
          <SubPageLink
            href="/website-seo/output"
            title="Audit Output"
            description="Executive summary, priority matrix, fix instructions, rankings, and roadmap."
          />
        </div>
      </section>
    </WebsiteSeoPageShell>
  );
}

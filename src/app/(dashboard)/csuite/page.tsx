import { HowItWorksSteps } from "@/components/csuite/HowItWorksSteps";
import { OutputTypesGrid } from "@/components/csuite/OutputTypesGrid";
import {
  CsuiteHero,
  CsuitePageShell,
  SubPageLink,
} from "@/components/csuite/CsuitePageShell";
import {
  ANALYTICS_REPORT_TYPES,
  CSUITE_OVERVIEW,
  CSUITE_PRODUCT_NAME,
  CSUITE_TAGLINE,
  VOICE_CALIBRATION_DIMENSIONS,
} from "@/lib/csuite/content";

export default function CsuiteOverviewPage() {
  return (
    <CsuitePageShell title={CSUITE_PRODUCT_NAME} subtitle={CSUITE_TAGLINE}>
      <CsuiteHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {CSUITE_OVERVIEW}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          How it works
        </h2>
        <HowItWorksSteps />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Content output types
        </h2>
        <OutputTypesGrid />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Executive voice calibration
        </h2>
        <ul className="mt-4 space-y-3">
          {VOICE_CALIBRATION_DIMENSIONS.map((dim) => (
            <li key={dim.title} className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">{dim.title}</span>
              {"options" in dim && (
                <span className="text-slate-500"> — {dim.options}</span>
              )}
              {"description" in dim && (
                <span className="text-slate-500"> — {dim.description}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Analytics & performance reporting
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ANALYTICS_REPORT_TYPES.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{report.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {report.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Explore the platform
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SubPageLink
            href="/csuite/generate"
            title="Generate Content"
            description="Scan corporate posts, pick an executive, and generate LinkedIn posts, articles, and X copy."
          />
          <SubPageLink
            href="/csuite/voice"
            title="Voice Calibration"
            description="Configure writing style, passion topics, language patterns, and target audience per leader."
          />
          <SubPageLink
            href="/csuite/output"
            title="Output Types"
            description="LinkedIn posts, long-form articles, X posts, and platform-specific variations."
          />
          <SubPageLink
            href="/csuite/reports"
            title="Performance Reports"
            description="Monthly post-by-post breakdown and quarterly trend analysis versus industry peers."
          />
        </div>
      </section>
    </CsuitePageShell>
  );
}

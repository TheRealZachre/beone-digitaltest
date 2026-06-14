import { WikipediaCoverageGrid } from "@/components/wikipedia/WikipediaCoverageGrid";
import { WikipediaPageShell } from "@/components/wikipedia/WikipediaPageShell";

const recommendationTypes = [
  {
    title: "Resolve maintenance templates first",
    description:
      "Banners like 'needs update' or 'conflict of interest' are visible to every reader. Address cited facts, then discuss removal on the article talk page.",
  },
  {
    title: "Add independent references before new prose",
    description:
      "Wikipedia accepts updates only when backed by reliable sources — trade press, regulatory filings, peer-reviewed literature. Press releases alone are insufficient.",
  },
  {
    title: "Keep company and CEO articles in sync",
    description:
      "After earnings, regulatory wins, or leadership changes, update both pages in the same review cycle with cross-links and consistent naming.",
  },
  {
    title: "Translate social milestones into neutral facts",
    description:
      "When your social channels highlight ASCO data, FDA decisions, or culture awards, identify two independent sources and add concise, cited sentences — not marketing copy.",
  },
];

export default function WikipediaRecommendationsPage() {
  return (
    <WikipediaPageShell
      title="What We Check"
      subtitle="How Wikipedia reputation recommendations are generated"
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Audit dimensions</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Each audit pulls the live English Wikipedia article for your company
          and CEO, parses wikitext structure, and compares against milestones
          detected in your synced social channels.
        </p>
        <div className="mt-6">
          <WikipediaCoverageGrid />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Recommendation principles
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendationTypes.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-violet-100 bg-violet-50/40 p-5"
            >
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
        <h3 className="font-semibold text-amber-900">Important note on editing</h3>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
          This tool provides communications guidance aligned with Wikipedia&apos;s
          neutral-point-of-view and conflict-of-interest policies. Paid advocates
          and company employees should disclose connections on article talk pages
          and prioritize independent third-party sources over corporate messaging.
        </p>
      </section>
    </WikipediaPageShell>
  );
}

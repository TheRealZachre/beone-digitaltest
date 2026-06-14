import { CoverageGrid } from "@/components/website-seo/CoverageGrid";
import { WebsiteSeoPageShell } from "@/components/website-seo/WebsiteSeoPageShell";
import { WEBSITE_SEO_PRODUCT_NAME } from "@/lib/website-seo/content";

export default function WebsiteSeoCoveragePage() {
  return (
    <WebsiteSeoPageShell
      title="Search Engine Coverage"
      subtitle={`${WEBSITE_SEO_PRODUCT_NAME} · Multi-engine visibility analysis`}
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Every audit evaluates signals relevant to major search engines and
          emerging AI search surfaces — not just a single Google score. Live
          Search Console and Webmaster Tools data can be connected in a future
          release for exact ranking and impression data.
        </p>
      </section>
      <CoverageGrid />
    </WebsiteSeoPageShell>
  );
}

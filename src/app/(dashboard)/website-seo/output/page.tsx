import { OutputFormatGrid } from "@/components/website-seo/OutputFormatGrid";
import { WebsiteSeoPageShell } from "@/components/website-seo/WebsiteSeoPageShell";
import { WEBSITE_SEO_PRODUCT_NAME } from "@/lib/website-seo/content";

export default function WebsiteSeoOutputPage() {
  return (
    <WebsiteSeoPageShell
      title="Audit Output Format"
      subtitle={`${WEBSITE_SEO_PRODUCT_NAME} · What you get from every audit`}
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Each audit delivers a structured report designed for marketing teams,
          content strategists, and developers — with clear priorities, plain-language
          fix instructions, and a sequenced growth roadmap.
        </p>
      </section>
      <OutputFormatGrid />
    </WebsiteSeoPageShell>
  );
}

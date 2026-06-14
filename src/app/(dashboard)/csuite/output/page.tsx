import { OutputTypesGrid } from "@/components/csuite/OutputTypesGrid";
import { CsuitePageShell } from "@/components/csuite/CsuitePageShell";
import { CSUITE_PRODUCT_NAME } from "@/lib/csuite/content";

export default function CsuiteOutputPage() {
  return (
    <CsuitePageShell
      title="Content Output Types"
      subtitle={`${CSUITE_PRODUCT_NAME} · Multi-platform executive content`}
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Every generation produces a full content package — short-form LinkedIn
          posts, long-form articles, and X adaptations — each optimized for format
          while maintaining a consistent executive voice.
        </p>
      </section>
      <OutputTypesGrid />
    </CsuitePageShell>
  );
}

import { YouTubePageShell } from "@/components/youtube/YouTubePageShell";
import { VISIBILITY_METRICS, YOUTUBE_PRODUCT_NAME } from "@/lib/youtube/content";
import { Globe2, Search, TrendingUp, Users, BarChart3 } from "lucide-react";

const icons = [TrendingUp, BarChart3, Users, Globe2, Search];

export default function YouTubeVisibilityPage() {
  return (
    <YouTubePageShell
      title="Brand Visibility Impact"
      subtitle={`${YOUTUBE_PRODUCT_NAME} · Performance intelligence over time`}
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Brand visibility dashboard
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Go beyond one-off SEO edits. Track how your channel&apos;s discoverability
          and brand presence evolve month over month — across search, suggested
          videos, and competitive keyword landscapes.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {VISIBILITY_METRICS.map((metric, i) => {
          const Icon = icons[i] ?? TrendingUp;
          return (
            <div
              key={metric.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{metric.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {metric.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Competitive benchmarking
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Compare your channel&apos;s share of voice, impression growth, and keyword
          rankings against competitor channels in the same category. Identify
          content gaps and SEO opportunities where rivals are outranking you in
          search.
        </p>
      </section>
    </YouTubePageShell>
  );
}

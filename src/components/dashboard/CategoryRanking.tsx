import type { CategoryPerformance } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/metrics";

interface CategoryRankingProps {
  categories: CategoryPerformance[];
}

export function CategoryRanking({ categories }: CategoryRankingProps) {
  const max = categories[0]?.avgEngagementRate ?? 1;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Content Category Performance
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Ranked by average engagement rate
      </p>

      <div className="mt-6 space-y-4">
        {categories.map((cat, i) => (
          <div key={cat.category}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium capitalize text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  {i + 1}
                </span>
                {cat.category}
              </span>
              <span className="font-semibold text-slate-900">
                {formatPercent(cat.avgEngagementRate)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{
                  width: `${(cat.avgEngagementRate / max) * 100}%`,
                }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {cat.postCount} posts · {formatNumber(cat.totalReach)} reach
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { CompetitorBrand } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/metrics";
import { Trophy, Users } from "lucide-react";

interface CompetitorBenchmarkProps {
  competitors: CompetitorBrand[];
  brandEngagementRate: number;
  brandName: string;
}

export function CompetitorBenchmark({
  competitors,
  brandEngagementRate,
  brandName,
}: CompetitorBenchmarkProps) {
  const all = [
    { name: brandName, avgEngagementRate: brandEngagementRate, isBrand: true },
    ...competitors.map((c) => ({ ...c, isBrand: false })),
  ].sort((a, b) => b.avgEngagementRate - a.avgEngagementRate);

  const brandRank = all.findIndex((e) => e.isBrand) + 1;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Competitor Benchmarking
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {brandName} ranks #{brandRank} of {all.length} on engagement rate
          </p>
        </div>
        <Trophy className="h-5 w-5 text-amber-500" />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-3 pr-4 font-medium">Brand</th>
              <th className="pb-3 pr-4 font-medium">Followers</th>
              <th className="pb-3 pr-4 font-medium">Eng. Rate</th>
              <th className="pb-3 pr-4 font-medium">Posts/Wk</th>
              <th className="pb-3 font-medium">Top Category</th>
            </tr>
          </thead>
          <tbody>
            {all.map((entry) => (
              <tr
                key={entry.name}
                className={
                  entry.isBrand
                    ? "border-b border-indigo-100 bg-indigo-50/50"
                    : "border-b border-slate-50"
                }
              >
                <td className="py-3 pr-4 font-medium text-slate-800">
                  {entry.name}
                  {entry.isBrand && (
                    <span className="ml-2 rounded bg-indigo-100 px-1.5 py-0.5 text-xs text-indigo-700">
                      You
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4 text-slate-600">
                  {"followers" in entry ? (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {formatNumber(entry.followers)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 pr-4 font-semibold text-slate-800">
                  {formatPercent(entry.avgEngagementRate)}
                </td>
                <td className="py-3 pr-4 text-slate-600">
                  {"avgPostsPerWeek" in entry ? entry.avgPostsPerWeek : "—"}
                </td>
                <td className="py-3 capitalize text-slate-600">
                  {"topCategory" in entry ? entry.topCategory : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

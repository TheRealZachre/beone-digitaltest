import {
  DISTRIBUTION_STRATEGY,
  PLATFORM_DISTRIBUTION,
} from "@/lib/video-production/content";

export function DistributionStrategyTable() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-700">
          {DISTRIBUTION_STRATEGY.model} model
        </p>
        <p className="mt-1 text-sm text-slate-700">
          {DISTRIBUTION_STRATEGY.summary}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Platform
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Format / Length
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Aspect
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Purpose
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PLATFORM_DISTRIBUTION.map((row) => (
              <tr key={row.platform} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {row.platform}
                  {row.platform === DISTRIBUTION_STRATEGY.hub && (
                    <span className="ml-2 rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fuchsia-700">
                      Hub
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{row.format}</td>
                <td className="px-4 py-3 text-slate-600">{row.aspectRatio}</td>
                <td className="px-4 py-3 text-slate-600">{row.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

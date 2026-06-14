import type { MonthBucket } from "@/lib/narrative/types";

interface QuarterlyMonthTrendProps {
  months: MonthBucket[];
}

export function QuarterlyMonthTrend({ months }: QuarterlyMonthTrendProps) {
  const visible = months.filter((m) => m.postCount > 0);
  if (visible.length === 0) return null;

  const maxScore = Math.max(...visible.map((m) => m.avgEngagementScore), 1);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Monthly trend across the quarter
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Post volume and engagement score by month
      </p>

      <div className="mt-6 space-y-4">
        {visible.map((month) => (
          <div key={month.monthKey}>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-medium text-slate-800">{month.label}</span>
              <span className="text-slate-500">
                {month.postCount} posts · engagement score{" "}
                {month.avgEngagementScore}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-rose-600"
                style={{
                  width: `${(month.avgEngagementScore / maxScore) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

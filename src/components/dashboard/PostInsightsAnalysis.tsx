import type { PostInsights } from "@/lib/types";
import clsx from "clsx";

interface PostInsightsAnalysisProps {
  insights: PostInsights;
  layout?: "grid" | "stack";
  className?: string;
}

export function PostInsightsAnalysis({
  insights,
  layout = "grid",
  className,
}: PostInsightsAnalysisProps) {
  return (
    <div className={className}>
      <div
        className={clsx(
          layout === "grid"
            ? "mt-1.5 grid grid-cols-1 gap-[18px] md:grid-cols-3 md:gap-6"
            : "mt-1.5 space-y-4"
        )}
      >
        <div>
          <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
            What Worked
          </h4>
          <p className="text-[13.5px] leading-[1.6] text-[#0d1421]">
            {insights.whatWorked}
          </p>
        </div>
        <div>
          <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
            Improvements
          </h4>
          <p className="text-[13.5px] leading-[1.6] text-[#0d1421]">
            {insights.whatDiluted}
          </p>
        </div>
        <div>
          <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-indigo">
            Narrative Role
          </h4>
          <p className="text-[13.5px] leading-[1.6] text-[#0d1421]">
            {insights.narrativeRole}
          </p>
        </div>
      </div>
    </div>
  );
}

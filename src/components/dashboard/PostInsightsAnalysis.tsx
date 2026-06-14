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
            ? "mt-1.5 grid grid-cols-1 gap-[18px] md:grid-cols-2 md:gap-7"
            : "mt-1.5 space-y-4"
        )}
      >
        <div>
          <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c8102e]">
            What Worked
          </h4>
          <p className="text-[13.5px] leading-[1.6] text-[#0d1421]">
            {insights.whatWorked}
          </p>
        </div>
        <div>
          <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b8731a]">
            What Diluted
          </h4>
          <p className="text-[13.5px] leading-[1.6] text-[#0d1421]">
            {insights.whatDiluted}
          </p>
        </div>
      </div>

      <div className="mt-[22px] border-t border-[#e6e6e6] pt-[22px] text-[13.5px] leading-[1.65] text-[#0d1421]">
        <strong className="font-semibold text-[#c8102e]">Narrative role:</strong>{" "}
        {insights.narrativeRole}
      </div>
    </div>
  );
}

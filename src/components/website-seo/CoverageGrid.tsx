import { SEARCH_ENGINE_COVERAGE } from "@/lib/website-seo/content";
import clsx from "clsx";

const statusStyles = {
  analyzed: "bg-emerald-100 text-emerald-800",
  partial: "bg-amber-100 text-amber-800",
  "integration-required": "bg-slate-100 text-slate-600",
};

export function CoverageGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SEARCH_ENGINE_COVERAGE.map((item) => (
        <div
          key={item.engine}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900">{item.engine}</h3>
            <span
              className={clsx(
                "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                statusStyles[item.status]
              )}
            >
              {item.status === "analyzed" ? "Analyzed" : "Partial signals"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {item.detail}
          </p>
        </div>
      ))}
    </div>
  );
}

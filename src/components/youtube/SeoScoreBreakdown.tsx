import { SEO_SCORE_FACTORS } from "@/lib/youtube/content";

export function SeoScoreBreakdown() {
  return (
    <div className="space-y-4">
      {SEO_SCORE_FACTORS.map((factor) => (
        <div key={factor.label}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <div>
              <span className="font-medium text-slate-800">{factor.label}</span>
              <span className="ml-2 text-slate-500">— {factor.detail}</span>
            </div>
            <span className="font-semibold text-slate-900">{factor.weight}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${factor.weight}%`,
                backgroundColor: factor.color,
              }}
            />
          </div>
        </div>
      ))}

      <div className="mt-6 rounded-lg border border-red-100 bg-red-50/50 p-5">
        <p className="font-mono text-sm text-slate-800">
          video seo score = Σ (factor score × weight) → 0–100
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Each factor is scored 0–100 internally, then combined using the
          weights above to produce a single channel-ready rating per video.
        </p>
      </div>
    </div>
  );
}

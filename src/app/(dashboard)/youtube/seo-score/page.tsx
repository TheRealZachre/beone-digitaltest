import { SeoScoreBreakdown } from "@/components/youtube/SeoScoreBreakdown";
import { YouTubePageShell } from "@/components/youtube/YouTubePageShell";
import { YOUTUBE_PRODUCT_NAME } from "@/lib/youtube/content";

export default function YouTubeSeoScorePage() {
  return (
    <YouTubePageShell
      title="Video SEO Score"
      subtitle={`${YOUTUBE_PRODUCT_NAME} · 0–100 rating per video`}
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Weighted scoring model
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Every published video receives a composite SEO score from 0 to 100.
          Each factor is evaluated independently, then combined using fixed
          weights so scores are comparable across your full video library and
          over time.
        </p>
        <div className="mt-6">
          <SeoScoreBreakdown />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          How videos are ranked
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>
            <span className="font-medium text-slate-800">Channel sync:</span>{" "}
            Connect via YouTube API to pull metadata, analytics, and transcripts
            for every published video.
          </li>
          <li>
            <span className="font-medium text-slate-800">Per-video rating:</span>{" "}
            Score each video against the six weighted factors and surface
            underperformers that need SEO attention.
          </li>
          <li>
            <span className="font-medium text-slate-800">Keyword tracking:</span>{" "}
            Monitor search ranking by target keyword and click-through rate from
            search results over time.
          </li>
          <li>
            <span className="font-medium text-slate-800">Velocity signals:</span>{" "}
            Track impressions and view velocity to catch momentum shifts early.
          </li>
        </ul>
      </section>
    </YouTubePageShell>
  );
}

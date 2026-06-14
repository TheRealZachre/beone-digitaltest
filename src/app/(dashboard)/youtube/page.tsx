import { CapabilityGrid } from "@/components/youtube/CapabilityGrid";
import {
  SubPageLink,
  YouTubeHero,
  YouTubePageShell,
} from "@/components/youtube/YouTubePageShell";
import {
  YOUTUBE_OVERVIEW,
  YOUTUBE_PROBLEM,
  YOUTUBE_PRODUCT_NAME,
  YOUTUBE_TAGLINE,
} from "@/lib/youtube/content";

export default function YouTubeOverviewPage() {
  return (
    <YouTubePageShell title={YOUTUBE_PRODUCT_NAME} subtitle={YOUTUBE_TAGLINE}>
      <YouTubeHero />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {YOUTUBE_OVERVIEW}
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {YOUTUBE_PROBLEM.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {YOUTUBE_PROBLEM.body}
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Core capabilities
        </h2>
        <CapabilityGrid />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Explore the platform
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SubPageLink
            href="/youtube/channel"
            title="Channel Analyzer"
            description="Connect a YouTube channel, score every video 0–100, and surface optimization recommendations."
          />
          <SubPageLink
            href="/youtube/analyze"
            title="Video SEO Tool"
            description="Upload a video, add a transcript, and get a full SEO package — title, description, tags, and chapters."
          />
          <SubPageLink
            href="/youtube/seo-score"
            title="Video SEO Scoring"
            description="0–100 rating with weighted factors for title, description, tags, thumbnail, retention, and engagement."
          />
          <SubPageLink
            href="/youtube/visibility"
            title="Brand Visibility Dashboard"
            description="Impressions growth, share of voice, subscriber attribution, geographic reach, and search queries."
          />
          <SubPageLink
            href="/youtube/seo-packages"
            title="Automated SEO Packages"
            description="AI-generated titles, descriptions, tags, thumbnail overlays, and optional auto-publish to YouTube Studio."
          />
        </div>
      </section>
    </YouTubePageShell>
  );
}

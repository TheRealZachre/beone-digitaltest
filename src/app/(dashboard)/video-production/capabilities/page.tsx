import { CapabilitiesGrid } from "@/components/video-production/CapabilitiesGrid";
import { VideoProductionPageShell } from "@/components/video-production/VideoProductionPageShell";

export default function VideoProductionCapabilitiesPage() {
  return (
    <VideoProductionPageShell
      title="Capabilities"
      subtitle="Brand configuration, AI avatars, captions, rendering, thumbnails, and scheduling"
    >
      <CapabilitiesGrid />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Production outputs per project
        </h2>
        <ul className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          <li>• 16:9 broadcast master (YouTube, LinkedIn, X)</li>
          <li>• 9:16 vertical variants (Reels, TikTok, Stories)</li>
          <li>• SRT and VTT caption files</li>
          <li>• Platform-specific clip captions and hashtags</li>
          <li>• YouTube SEO title, description, tags, chapters</li>
          <li>• Thumbnail A/B variants</li>
          <li>• Content calendar with queued publish slots</li>
          <li>• Branded motion graphics and lower-thirds package</li>
        </ul>
      </section>
    </VideoProductionPageShell>
  );
}

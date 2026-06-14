import { SeoPackageGenerator } from "@/components/youtube/SeoPackageGenerator";
import { YouTubePageShell } from "@/components/youtube/YouTubePageShell";
import { YOUTUBE_PRODUCT_NAME } from "@/lib/youtube/content";

export default function YouTubeSeoPackagesPage() {
  return (
    <YouTubePageShell
      title="Automated SEO Packages"
      subtitle={`${YOUTUBE_PRODUCT_NAME} · Generate publish-ready titles, descriptions, and tags`}
    >
      <SeoPackageGenerator />
    </YouTubePageShell>
  );
}

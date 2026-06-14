import { ChannelAnalyzer } from "@/components/youtube/ChannelAnalyzer";
import { YouTubePageShell } from "@/components/youtube/YouTubePageShell";
import { YOUTUBE_PRODUCT_NAME } from "@/lib/youtube/content";

export default function YouTubeChannelPage() {
  return (
    <YouTubePageShell
      title="Channel Analyzer"
      subtitle={`${YOUTUBE_PRODUCT_NAME} · Pull and rank every video by SEO score`}
    >
      <ChannelAnalyzer />
    </YouTubePageShell>
  );
}

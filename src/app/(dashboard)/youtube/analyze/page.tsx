import { VideoUploadAnalyzer } from "@/components/youtube/VideoUploadAnalyzer";
import { YouTubePageShell } from "@/components/youtube/YouTubePageShell";
import { YOUTUBE_PRODUCT_NAME } from "@/lib/youtube/content";

export default function YouTubeAnalyzePage() {
  return (
    <YouTubePageShell
      title="Video SEO Analyzer"
      subtitle={`${YOUTUBE_PRODUCT_NAME} · Upload once — transcription and SEO generation run automatically`}
    >
      <VideoUploadAnalyzer />
    </YouTubePageShell>
  );
}

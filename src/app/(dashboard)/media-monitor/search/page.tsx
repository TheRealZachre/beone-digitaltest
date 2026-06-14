import { MediaMonitorPageShell } from "@/components/media-monitor/MediaMonitorPageShell";
import { MediaMonitorSearchTool } from "@/components/media-monitor/MediaMonitorSearchTool";
import { MEDIA_MONITOR_PRODUCT_NAME } from "@/lib/media-monitor/content";

export default function MediaMonitorSearchPage() {
  return (
    <MediaMonitorPageShell
      title="Search Subject"
      subtitle={`${MEDIA_MONITOR_PRODUCT_NAME} · News & social aggregation`}
    >
      <MediaMonitorSearchTool />
    </MediaMonitorPageShell>
  );
}

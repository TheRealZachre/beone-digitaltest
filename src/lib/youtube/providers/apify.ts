import { parseRelativeYouTubeDate } from "../parse-relative-date";
import { parseDurationLabel } from "../parse-duration";
import { parseChannelInput } from "../parse-channel-url";
import { analyzeVideoSeo } from "../score-video";
import { pickThumbnailUrl } from "../thumbnails";
import type { ChannelAnalyzeResponse, YouTubeChannel, YouTubeVideo } from "../types";

const ACTOR = "streamers/youtube-channel-scraper";

type ApifyChannelRecord = {
  id?: string;
  title?: string;
  duration?: string;
  date?: string;
  url?: string;
  viewCount?: number;
  thumbnailUrl?: string;
  channelId?: string;
  channelName?: string;
  channelUsername?: string;
  channelUrl?: string;
  channelDescription?: string;
  channelAvatarUrl?: string;
  numberOfSubscribers?: number;
  channelTotalVideos?: number;
  channelTotalViews?: number;
  aboutChannelInfo?: {
    channelId?: string;
    channelName?: string;
    channelUsername?: string;
    channelDescription?: string;
    channelAvatarUrl?: string;
    numberOfSubscribers?: number;
    channelTotalVideos?: number;
    channelTotalViews?: number;
  };
};

function normalizeChannelUrl(input: string): string {
  const parsed = parseChannelInput(input);
  if (!parsed) return input.trim();
  if (parsed.raw.startsWith("http")) return parsed.raw;
  if (parsed.handle) return `https://www.youtube.com/@${parsed.handle}`;
  if (parsed.channelId) {
    return `https://www.youtube.com/channel/${parsed.channelId}`;
  }
  return input.trim();
}

function mapChannel(records: ApifyChannelRecord[]): YouTubeChannel {
  const first = records[0];
  const about = first?.aboutChannelInfo;

  const id = about?.channelId ?? first?.channelId ?? "unknown";
  const handle =
    about?.channelUsername ?? first?.channelUsername ?? first?.channelName ?? id;

  return {
    id,
    title: about?.channelName ?? first?.channelName ?? "YouTube Channel",
    handle: handle.replace(/^@/, ""),
    description:
      about?.channelDescription ?? first?.channelDescription ?? "",
    thumbnailUrl:
      about?.channelAvatarUrl ?? first?.channelAvatarUrl ?? "",
    subscriberCount:
      about?.numberOfSubscribers ?? first?.numberOfSubscribers ?? 0,
    videoCount: about?.channelTotalVideos ?? first?.channelTotalVideos ?? 0,
    viewCount: about?.channelTotalViews ?? first?.channelTotalViews ?? 0,
  };
}

function mapVideo(record: ApifyChannelRecord): YouTubeVideo | null {
  const id = record.id;
  const title = record.title?.trim();
  if (!id || !title) return null;

  const video: YouTubeVideo = {
    id,
    title,
    description: record.channelDescription?.slice(0, 500) ?? "",
    tags: [],
    thumbnailUrl: pickThumbnailUrl(id, record.thumbnailUrl),
    publishedAt: parseRelativeYouTubeDate(record.date ?? ""),
    viewCount: Number(record.viewCount ?? 0),
    likeCount: 0,
    commentCount: 0,
    durationSeconds: parseDurationLabel(record.duration ?? "0:00"),
  };

  return video;
}

export async function fetchChannelFromApify(
  channelInput: string,
  token: string,
  maxVideos = 20
): Promise<ChannelAnalyzeResponse> {
  const channelUrl = normalizeChannelUrl(channelInput);

  const url = new URL(
    `https://api.apify.com/v2/acts/${ACTOR.replace("/", "~")}/run-sync-get-dataset-items`
  );
  url.searchParams.set("token", token);
  url.searchParams.set("format", "json");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      startUrls: [{ url: channelUrl }],
      maxResults: maxVideos,
    }),
    signal: AbortSignal.timeout(180_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Apify YouTube sync failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const records = (await response.json()) as ApifyChannelRecord[];

  if (!records.length) {
    throw new Error(
      `No videos returned for "${channelUrl}". Check the channel URL or handle.`
    );
  }

  const channel = mapChannel(records);
  const videos = records
    .map(mapVideo)
    .filter((v): v is YouTubeVideo => v !== null)
    .map((video) => ({
      ...video,
      analysis: analyzeVideoSeo(video),
    }))
    .sort((a, b) => b.analysis.totalScore - a.analysis.totalScore);

  return {
    source: "apify",
    channel,
    videos,
  };
}

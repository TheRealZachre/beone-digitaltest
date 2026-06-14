import { parseDurationLabel } from "../parse-duration";
import { pickThumbnailUrl } from "../thumbnails";

const ACTOR = "streamers/youtube-channel-scraper";

export interface ApifyVideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  viewCount: number;
  publishedAt: string;
  durationSeconds: number;
  hashtags: string[];
  channelName: string;
}

type ApifyVideoRecord = {
  id?: string;
  title?: string;
  text?: string;
  translatedText?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  date?: string;
  duration?: string;
  hashtags?: string[];
  channelName?: string;
};

export async function fetchVideoFromApify(
  videoUrl: string,
  token: string
): Promise<ApifyVideoDetails> {
  const url = new URL(
    `https://api.apify.com/v2/acts/${ACTOR.replace("/", "~")}/run-sync-get-dataset-items`
  );
  url.searchParams.set("token", token);
  url.searchParams.set("format", "json");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      startUrls: [{ url: videoUrl.trim() }],
      maxResults: 1,
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Could not fetch video (${response.status}): ${body.slice(0, 200)}`);
  }

  const records = (await response.json()) as ApifyVideoRecord[];
  const record = records[0];

  if (!record?.id || !record.title) {
    throw new Error("Video not found. Check the YouTube URL.");
  }

  const description = (record.text ?? record.translatedText ?? "").trim();

  return {
    id: record.id,
    title: record.title,
    description,
    thumbnailUrl: pickThumbnailUrl(record.id, record.thumbnailUrl),
    viewCount: Number(record.viewCount ?? 0),
    publishedAt: record.date ?? new Date().toISOString(),
    durationSeconds: parseDurationLabel(record.duration ?? "0:00"),
    hashtags: (record.hashtags ?? []).map((t) => t.replace(/^#/, "")),
    channelName: record.channelName ?? "",
  };
}

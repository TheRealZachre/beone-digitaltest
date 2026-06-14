import { analyzeVideoSeo } from "../score-video";
import { pickThumbnailUrl, videoThumbnailUrl } from "../thumbnails";
import type { ChannelAnalyzeResponse, YouTubeVideo } from "../types";

const CHANNEL_ID = "UCJPyN9QBGWtLvhHSqq5ne8Q";

const RAW_VIDEOS: Omit<YouTubeVideo, "thumbnailUrl">[] = [
  {
    id: "URAqBej-oOw",
    title: "Richard's Story - Esophageal Cancer",
    description:
      "Meet Richard and hear his journey with esophageal cancer. Subscribe for more patient stories from BeOne Medicines.",
    tags: ["patient story", "esophageal cancer", "oncology"],
    publishedAt: "2026-04-01T10:00:00Z",
    viewCount: 232,
    likeCount: 12,
    commentCount: 3,
    durationSeconds: 226,
  },
  {
    id: "p2PuujS1iUA",
    title: "BeOne Patient Perspective: Living with CLL",
    description:
      "A patient perspective on living with CLL. Learn more at beonemedicines.com",
    tags: ["cll", "patient story", "oncology"],
    publishedAt: "2026-03-01T10:00:00Z",
    viewCount: 264,
    likeCount: 15,
    commentCount: 4,
    durationSeconds: 188,
  },
  {
    id: "vid-demo-3",
    title: "ASCO 2026 Highlights | BeOne Data Presentation",
    description:
      "Our ASCO 2026 presentation covers new data across multiple indications. #ASCO2026 #oncology",
    tags: ["asco", "clinical data", "oncology"],
    publishedAt: "2026-03-05T10:00:00Z",
    viewCount: 24100,
    likeCount: 580,
    commentCount: 44,
    durationSeconds: 645,
  },
];

export function fetchSeedChannel(): ChannelAnalyzeResponse {
  const videos = RAW_VIDEOS.map((video) => {
    const mapped: YouTubeVideo = {
      ...video,
      thumbnailUrl:
        video.id.startsWith("vid-")
          ? videoThumbnailUrl("URAqBej-oOw")
          : pickThumbnailUrl(video.id),
    };
    return { ...mapped, analysis: analyzeVideoSeo(mapped) };
  }).sort((a, b) => b.analysis.totalScore - a.analysis.totalScore);

  return {
    source: "seed",
    channel: {
      id: CHANNEL_ID,
      title: "BeOne Medicines",
      handle: "beonemedicines",
      description:
        "Official channel for BeOne Medicines — oncology innovation, patient stories, and scientific updates.",
      thumbnailUrl:
        "https://yt3.googleusercontent.com/Rplyx1b6s_8YhZGVvzI0vanLzba96UguSLcvzlBC4GXB-0YYH0Tc3cYiaFqsD891or54H0Ykg78=s160-c-k-c0x00ffffff-no-rj",
      subscriberCount: 125000,
      videoCount: 61,
      viewCount: 2094402,
    },
    videos,
  };
}

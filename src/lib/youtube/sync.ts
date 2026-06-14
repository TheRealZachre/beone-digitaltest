import { getYouTubeConfig } from "./config";
import { fetchChannelFromApify } from "./providers/apify";
import { fetchSeedChannel } from "./providers/seed";
import { fetchChannelFromYouTubeApi } from "./providers/youtube-api";

export async function fetchChannelAnalysis(channelInput: string) {
  const config = getYouTubeConfig();
  const apifyToken = process.env.APIFY_TOKEN ?? "";

  if (config.provider === "seed") {
    return fetchSeedChannel();
  }

  if (config.provider === "apify" && apifyToken) {
    return fetchChannelFromApify(channelInput, apifyToken, config.maxVideos);
  }

  if (config.apiKey && (config.provider === "youtube-api" || config.provider === "auto")) {
    try {
      return await fetchChannelFromYouTubeApi(
        channelInput,
        config.apiKey,
        config.maxVideos
      );
    } catch (error) {
      if (!apifyToken) throw error;
      console.warn("YouTube API failed, falling back to Apify:", error);
    }
  }

  if (apifyToken && (config.provider === "apify" || config.provider === "auto")) {
    return fetchChannelFromApify(
      channelInput,
      apifyToken,
      config.maxVideos
    );
  }

  if (config.apiKey) {
    return fetchChannelFromYouTubeApi(
      channelInput,
      config.apiKey,
      config.maxVideos
    );
  }

  console.warn(
    "No YOUTUBE_API_KEY or APIFY_TOKEN — using demo channel data."
  );
  return fetchSeedChannel();
}

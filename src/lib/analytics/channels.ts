import type { AnalyticsChannel, Platform } from "@/lib/types";

export interface ChannelConfig {
  id: AnalyticsChannel;
  platform: Platform | null;
  label: string;
  href: string;
  color: string;
  handle: string;
  followers: number;
}

export const ANALYTICS_CHANNELS: ChannelConfig[] = [
  {
    id: "all",
    platform: null,
    label: "All Channels",
    href: "/reports/channels",
    color: "#6366f1",
    handle: "@beonemedicines",
    followers: 0,
  },
  {
    id: "linkedin",
    platform: "linkedin",
    label: "LinkedIn",
    href: "/reports/channels/linkedin",
    color: "#0A66C2",
    handle: "@beonemedicines",
    followers: 249000,
  },
  {
    id: "instagram",
    platform: "instagram",
    label: "Instagram",
    href: "/reports/channels/instagram",
    color: "#E1306C",
    handle: "@beonemedicines",
    followers: 9322,
  },
  {
    id: "facebook",
    platform: "facebook",
    label: "Facebook",
    href: "/reports/channels/facebook",
    color: "#1877F2",
    handle: "@BeOneMeds",
    followers: 45763,
  },
  {
    id: "x",
    platform: "x",
    label: "X",
    href: "/reports/channels/x",
    color: "#0F1419",
    handle: "@BeOneMedicines",
    followers: 5090,
  },
  {
    id: "youtube",
    platform: "youtube",
    label: "YouTube",
    href: "/reports/channels/youtube",
    color: "#FF0000",
    handle: "@beonemedicines",
    followers: 125000,
  },
];

export const ANALYTICS_CHANNEL_PLATFORMS: Platform[] = [
  "linkedin",
  "instagram",
  "facebook",
  "x",
  "youtube",
];

export function getChannelConfig(
  channel: AnalyticsChannel
): ChannelConfig | undefined {
  return ANALYTICS_CHANNELS.find((c) => c.id === channel);
}

export function getChannelConfigByPlatform(
  platform: Platform
): ChannelConfig | undefined {
  return ANALYTICS_CHANNELS.find((c) => c.platform === platform);
}

export function isAnalyticsPlatform(value: string): value is Platform {
  return ANALYTICS_CHANNEL_PLATFORMS.includes(value as Platform);
}

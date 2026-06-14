import type { Platform, SocialPost } from "@/lib/types";

export type SocialChannel = Exclude<Platform, "tiktok">;

export interface ChannelSyncMeta {
  postCount: number;
  followers?: number;
  provider: string;
  dataSource: "live" | "seed" | "error";
  error?: string;
  syncedAt?: string;
}

export interface SocialPostCacheMeta {
  syncedAt: string;
  companySlug: string;
  channels: Partial<Record<SocialChannel, ChannelSyncMeta>>;
}

export interface SocialPostCache {
  meta: SocialPostCacheMeta;
  posts: SocialPost[];
}

export interface SocialSyncResult {
  cache: SocialPostCache;
  errors: Partial<Record<SocialChannel, string>>;
}

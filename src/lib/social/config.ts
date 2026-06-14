import type { SocialChannel } from "./types";

export function getSocialConfig() {
  const maxPosts = Number(process.env.SOCIAL_MAX_POSTS_PER_CHANNEL ?? "50");

  return {
    companySlug: process.env.LINKEDIN_COMPANY_SLUG ?? "beonemedicines",
    apifyToken: process.env.APIFY_TOKEN,
    maxPosts,
    channels: {
      linkedin: {
        handle: process.env.LINKEDIN_COMPANY_SLUG ?? "beonemedicines",
      },
      instagram: {
        handle: process.env.SOCIAL_INSTAGRAM_HANDLE ?? "beonemedicines",
      },
      facebook: {
        url:
          process.env.SOCIAL_FACEBOOK_URL ??
          "https://www.facebook.com/BeOneMeds/",
      },
      x: {
        handle: process.env.SOCIAL_X_HANDLE ?? "BeOneMedicines",
      },
      youtube: {
        channel: process.env.SOCIAL_YOUTUBE_CHANNEL ?? "@beonemedicines",
      },
    } satisfies Record<SocialChannel, { handle?: string; url?: string; channel?: string }>,
  };
}

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { readSocialCache, writeSocialCache } from "../src/lib/data/social-cache";
import { fetchLatestApifyDatasetItems } from "../src/lib/social/apify-datasets";
import { normalizeFacebookPost } from "../src/lib/social/normalize";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN required");

  const cache = await readSocialCache();
  if (!cache) throw new Error("No social cache found");

  const records = await fetchLatestApifyDatasetItems(
    "apify/facebook-posts-scraper",
    token,
    100
  );

  const freshPosts = records
    .map((record) => normalizeFacebookPost(record))
    .filter((post): post is NonNullable<typeof post> => post !== null);

  const placeholdersBefore = cache.posts.filter(
    (p) => p.platform === "facebook" && p.imageUrl.includes("picsum.photos")
  ).length;

  const freshById = new Map(freshPosts.map((p) => [p.id, p]));
  const otherPosts = cache.posts.filter((p) => p.platform !== "facebook");

  const mergedFacebook = cache.posts
    .filter((p) => p.platform === "facebook")
    .map((p) => {
      const fresh = freshById.get(p.id);
      return fresh ? { ...p, imageUrl: fresh.imageUrl } : p;
    });

  for (const fresh of freshPosts) {
    if (!mergedFacebook.some((p) => p.id === fresh.id)) {
      mergedFacebook.push(fresh);
    }
  }

  cache.posts = [...otherPosts, ...mergedFacebook].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  if (cache.meta.channels?.facebook) {
    cache.meta.channels.facebook.postCount = mergedFacebook.length;
    cache.meta.syncedAt = new Date().toISOString();
  }

  await writeSocialCache(cache);

  const placeholdersAfter = cache.posts.filter(
    (p) => p.platform === "facebook" && p.imageUrl.includes("picsum.photos")
  ).length;

  const realImages = cache.posts.filter(
    (p) => p.platform === "facebook" && !p.imageUrl.includes("picsum.photos")
  ).length;

  console.log(`✓ Refreshed ${mergedFacebook.length} Facebook posts`);
  console.log(`  Placeholders: ${placeholdersBefore} → ${placeholdersAfter}`);
  console.log(`  Real images: ${realImages}`);
}

main().catch((err) => {
  console.error("Refresh failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});

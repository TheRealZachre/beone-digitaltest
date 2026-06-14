import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { syncSocialPosts } from "../src/lib/social/sync";

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
  console.log("Syncing all social channels via Apify...");

  const { cache, errors } = await syncSocialPosts();

  console.log(`✓ Synced ${cache.posts.length} total posts`);
  console.log(`  Company:  ${cache.meta.companySlug}`);
  console.log(`  Saved at: ${cache.meta.syncedAt}`);

  for (const [channel, meta] of Object.entries(cache.meta.channels)) {
    if (!meta) continue;
    const followers =
      meta.followers != null ? ` · ${meta.followers.toLocaleString()} followers` : "";
    console.log(
      `  ${channel}: ${meta.postCount} posts (${meta.dataSource})${followers}`
    );
  }

  const failed = Object.entries(errors);
  if (failed.length > 0) {
    console.log("\nChannel errors:");
    for (const [channel, message] of failed) {
      console.log(`  ${channel}: ${message}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Sync failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});

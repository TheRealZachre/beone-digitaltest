import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { syncLinkedInPosts } from "../src/lib/linkedin/sync";

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
  const provider = process.argv[2] as
    | "apify"
    | "linkedin"
    | "seed"
    | undefined;

  console.log(`Syncing LinkedIn posts${provider ? ` via ${provider}` : ""}...`);

  const cache = await syncLinkedInPosts(provider);
  console.log(`✓ Synced ${cache.posts.length} posts`);
  console.log(`  Provider: ${cache.meta.provider}`);
  console.log(`  Company:  ${cache.meta.companySlug}`);
  console.log(`  Saved at: ${cache.meta.syncedAt}`);
  if (cache.meta.followers != null) {
    console.log(`  Followers: ${cache.meta.followers.toLocaleString()}`);
  }
  if (cache.meta.note) console.log(`  Note:     ${cache.meta.note}`);
}

main().catch((err) => {
  console.error("Sync failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { importSocialChannels } from "../src/lib/social/import-channels";

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
  const channels = (process.argv[2] ?? "instagram,facebook")
    .split(",")
    .map((value) => value.trim()) as ("instagram" | "facebook")[];

  console.log(`Importing ${channels.join(" + ")}...`);

  const cache = await importSocialChannels(channels);

  console.log(`✓ Cache now has ${cache.posts.length} total posts`);
  for (const channel of channels) {
    const meta = cache.meta.channels[channel];
    if (!meta) continue;
    const followers =
      meta.followers != null
        ? ` · ${meta.followers.toLocaleString()} followers`
        : "";
    console.log(
      `  ${channel}: ${meta.postCount} posts (${meta.dataSource})${followers}`
    );
    if (meta.error) console.log(`    error: ${meta.error}`);
  }
}

main().catch((err) => {
  console.error("Import failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});

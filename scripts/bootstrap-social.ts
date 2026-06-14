import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { bootstrapSocialCacheFromLinkedIn } from "../src/lib/social/sync";

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
  const cache = await bootstrapSocialCacheFromLinkedIn();
  if (!cache) {
    console.error("No LinkedIn cache found at data/linkedin-posts.json");
    process.exit(1);
  }
  console.log(`✓ Bootstrapped social cache with ${cache.posts.length} LinkedIn posts`);
}

main().catch((err) => {
  console.error("Bootstrap failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});

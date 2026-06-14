import type { NextConfig } from "next";
import { loadDevVars } from "./scripts/load-dev-vars.mjs";

loadDevVars();

function isCloudflareBuild(): boolean {
  if (
    process.env.OPENNEXT_CLOUDFLARE === "1" ||
    process.env.CF_PAGES === "1" ||
    process.env.WORKERS_CI === "1"
  ) {
    return true;
  }

  if (
    process.env.CI &&
    process.env.CI !== "false" &&
    process.env.CI !== "0" &&
    !process.env.VERCEL &&
    !process.env.NETLIFY
  ) {
    return true;
  }

  return false;
}

const cloudflareNativeStubAliases = isCloudflareBuild()
  ? {
      "@xenova/transformers": "./src/lib/youtube/stubs/transformers-stub.ts",
      "ffmpeg-static": "./src/lib/youtube/stubs/ffmpeg-static-stub.ts",
      "onnxruntime-node": "./src/lib/youtube/stubs/empty-stub.ts",
    }
  : undefined;

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "ffmpeg-static",
    "@xenova/transformers",
    "onnxruntime-node",
    "pptxgenjs",
  ],
  experimental: {
    proxyClientMaxBodySize: "5gb",
  },
  ...(cloudflareNativeStubAliases
    ? {
        turbopack: {
          resolveAlias: cloudflareNativeStubAliases,
        },
        webpack: (config) => {
          config.resolve ??= {};
          config.resolve.alias = {
            ...config.resolve.alias,
            ...cloudflareNativeStubAliases,
          };
          return config;
        },
      }
    : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "dms.licdn.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
      {
        protocol: "https",
        hostname: "yt3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "**.twimg.com",
      },
    ],
  },
};

export default nextConfig;

if (process.env.NODE_ENV !== "production") {
  void import("@opennextjs/cloudflare").then((m) =>
    m.initOpenNextCloudflareForDev()
  );
}

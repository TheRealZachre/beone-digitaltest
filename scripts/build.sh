#!/usr/bin/env bash
# Cloudflare Git runs `npm run build` then `wrangler deploy`.
# OpenNext also invokes `npm run build` internally — use OPENNEXT_INNER_BUILD
# to run plain Next.js only on that inner call and avoid infinite recursion.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ "${OPENNEXT_INNER_BUILD:-}" = "1" ]; then
  exec next build
fi

export OPENNEXT_INNER_BUILD=1
exec env OPENNEXT_CLOUDFLARE=1 npx opennextjs-cloudflare build

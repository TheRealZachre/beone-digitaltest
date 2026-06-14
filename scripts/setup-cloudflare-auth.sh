#!/usr/bin/env bash
# Generate AUTH_SECRET locally and upload it to the beone-digitaltest worker.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .dev.vars ] || ! grep -q '^AUTH_SECRET=' .dev.vars 2>/dev/null; then
  secret="$(openssl rand -base64 32)"
  {
    echo "# Local Wrangler secrets — do not commit"
    echo "AUTH_SECRET=$secret"
  } >> .dev.vars
  echo "Wrote AUTH_SECRET to .dev.vars"
else
  # shellcheck disable=SC1091
  set -a
  source .dev.vars
  set +a
  secret="$AUTH_SECRET"
  echo "Using existing AUTH_SECRET from .dev.vars"
fi

if npx wrangler whoami 2>&1 | grep -qi "not authenticated"; then
  cat <<'EOF'

Next step: log in to Cloudflare, then re-run this script.

  npx wrangler login
  npm run setup:cloudflare

EOF
  exit 1
fi

printf '%s' "$secret" | npx wrangler secret put AUTH_SECRET
echo ""
echo "Done. AUTH_SECRET is on the beone-digitaltest worker."
echo "Redeploy from Cloudflare or run: npm run deploy"

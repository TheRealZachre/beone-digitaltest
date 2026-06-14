#!/usr/bin/env bash
# Deploy to Cloudflare Workers. Uploads AUTH_SECRET when available.
set -euo pipefail

load_secret() {
  if [ -n "${AUTH_SECRET:-}" ]; then
    return 0
  fi
  if [ -n "${NEXTAUTH_SECRET:-}" ]; then
    AUTH_SECRET="$NEXTAUTH_SECRET"
    export AUTH_SECRET
    return 0
  fi
  if [ -f .dev.vars ]; then
    # shellcheck disable=SC1091
    set -a
    source .dev.vars
    set +a
  fi
}

load_secret

deploy_args=()

if [ -n "${AUTH_SECRET:-}" ]; then
  secrets_file="$(mktemp)"
  trap 'rm -f "$secrets_file"' EXIT
  printf 'AUTH_SECRET=%s\n' "$AUTH_SECRET" > "$secrets_file"
  deploy_args+=(--secrets-file "$secrets_file")
  echo "Uploading AUTH_SECRET with wrangler deploy..."
elif [ "${WORKERS_CI:-}" = "1" ]; then
  cat >&2 <<'EOF'

ERROR: AUTH_SECRET is not available during deploy.

Fix (choose one):

  A) Worker runtime secret (recommended — works with "npx wrangler deploy"):
     Cloudflare dashboard → Workers & Pages → digitaltest
     → Settings → Variables and Secrets → Add → Secret → AUTH_SECRET
     Generate: openssl rand -base64 32

  B) CI build secret + updated commands:
     Settings → Builds → Build variables and secrets → Add → Secret → AUTH_SECRET
     Build command:  npm run ci:cloudflare
     Deploy command: echo "deployed in build step"

  C) Local one-time upload:
     npm run setup:cloudflare

EOF
  exit 1
else
  echo "WARNING: AUTH_SECRET not set — deploying without auth secret (login will fail)."
fi

exec npx wrangler deploy "${deploy_args[@]}"

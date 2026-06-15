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

secrets_file=""
if [ -n "${AUTH_SECRET:-}" ] || [ -n "${RESEND_API_KEY:-}" ] || [ -n "${AUTH_EMAIL_FROM:-}" ]; then
  secrets_file="$(mktemp)"
  trap 'rm -f "$secrets_file"' EXIT
  : > "$secrets_file"
  if [ -n "${AUTH_SECRET:-}" ]; then
    printf 'AUTH_SECRET=%s\n' "$AUTH_SECRET" >> "$secrets_file"
    echo "Uploading AUTH_SECRET with wrangler deploy..."
  fi
  if [ -n "${RESEND_API_KEY:-}" ]; then
    printf 'RESEND_API_KEY=%s\n' "$RESEND_API_KEY" >> "$secrets_file"
    echo "Uploading RESEND_API_KEY with wrangler deploy..."
  fi
  if [ -n "${AUTH_EMAIL_FROM:-}" ]; then
    printf 'AUTH_EMAIL_FROM=%s\n' "$AUTH_EMAIL_FROM" >> "$secrets_file"
    echo "Uploading AUTH_EMAIL_FROM with wrangler deploy..."
  fi
fi

deploy_args=()
if [ -n "${secrets_file:-}" ]; then
  deploy_args+=(--secrets-file "$secrets_file")
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

env_file=".open-next/cloudflare/next-env.mjs"
if [ -f "$env_file" ]; then
  awk '!seen[$0]++' "$env_file" > "${env_file}.tmp" && mv "${env_file}.tmp" "$env_file"
fi

npx opennextjs-cloudflare upload "${deploy_args[@]}"

version_id="$(npx wrangler versions list 2>/dev/null | awk '/Version ID:/{id=$3} END{print id}')"
if [ -n "${version_id:-}" ]; then
  echo "Promoting version ${version_id} to 100% traffic..."
  npx wrangler versions deploy "${version_id}" --yes
fi

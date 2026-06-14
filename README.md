# BeoneDigitalTest

Full duplicate of the Digital Dashboard platform — all modules, admin console, and analytics links.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars   # add AUTH_SECRET
npm run dev
```

Open http://localhost:3000

## Analytics

Links to **Analytics Demo BeOne** at https://analytics-demo-beone.zach-a56.workers.dev

## Deploy to Cloudflare

Worker name: `beone-digitaltest`

| Cloudflare Builds setting | Value |
|---------------------------|--------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

Add **AUTH_SECRET** under Worker → Settings → Variables and Secrets.

Manual deploy:

```bash
npm run ci:cloudflare
```

Production URL: https://beone-digitaltest.zach-a56.workers.dev

# 11 — Deployment

**Purpose:** Deployment pipeline, environment variables, and infrastructure reference.
**Scope:** Both repositories.
**Dependencies:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)
**Related:** [12_INTEGRATIONS.md](./12_INTEGRATIONS.md) | [03_DEVELOPMENT_GUIDE.md](./03_DEVELOPMENT_GUIDE.md)
**Update rules:** Update when infrastructure or environment variables change.

---

## Topology

```
Render
  └── spree-rpvb.onrender.com
        ├── Spree (Ruby/Rails)
        ├── PostgreSQL (dpg-d9cuue61a83c739uodb0)
        └── Redis (red-d9cuudm1a83c739uoc60)

Cloudflare R2
  └── spree-store bucket
        └── 275c9a9812e9a1f62185b51c8025b053.r2.cloudflarestorage.com

Vercel
  └── ecommerce-platform-2026-two.vercel.app
        └── apps/storefront (Root Directory: apps/storefront)

Sanity (Phase 3)
  └── TBD
```

---

## Render — Spree backend

**Service:** `spree` (srv-d9cv0861a83c739usgn0)
**Repo:** `spree/spree-starter` (main branch)
**Build command:** `bundle install && bundle exec rails assets:precompile && bundle exec rails db:prepare && bundle exec rails db:seed`
**Start command:** `bundle exec puma -C config/puma.rb`

### Environment variables

| Variable | Value |
|---|---|
| `DATABASE_URL` | Render PostgreSQL connection string |
| `REDIS_URL` | Render Redis connection string |
| `SECRET_KEY_BASE` | Generated secret |
| `RAILS_HOST` | `spree-rpvb.onrender.com` |
| `RAILS_LOG_LEVEL` | `info` |
| `RAILS_MAX_THREADS` | `2` |
| `DATABASE_POOL` | `2` |
| `WEB_CONCURRENCY` | `0` |
| `RAILS_STORAGE` | `cloudflare` |
| `CLOUDFLARE_ACCESS_KEY_ID` | R2 access key |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | R2 secret key |
| `CLOUDFLARE_BUCKET` | `spree-store` |
| `CLOUDFLARE_ENDPOINT` | `https://275c9a9812e9a1f62185b51c8025b053.r2.cloudflarestorage.com` |
| `AWS_REGION` | `auto` |
| `SPREE_STOREFRONT_URL` | `https://ecommerce-platform-2026-two.vercel.app` |

---

## Vercel — Storefront

**Project:** `ecommerce-platform-2026-two`
**Repo:** `prooftv/ecommerce-platform` (main branch)
**Root Directory:** `apps/storefront`
**Framework:** Next.js (auto-detected)
**Node version:** 22.x

### Build commands (set in `apps/storefront/vercel.json`)

| Setting | Value |
|---|---|
| Install command | `npx pnpm@9.15.9 install` |
| Build command | `npx pnpm@9.15.9 build:storefront` |

> `npx pnpm@9.15.9` is required because Vercel's bundled pnpm 9.0.x has a `URLSearchParams` bug (`ERR_INVALID_THIS`) that breaks all registry fetches on Node 22. Vercel runs the install command from the **repo root** when Root Directory is set to a subdirectory — no `cd` needed.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `SPREE_API_URL` | ✅ | `https://spree-rpvb.onrender.com` |
| `SPREE_PUBLISHABLE_KEY` | ✅ | Spree publishable API key |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public storefront URL |
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | — | Default `za` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | — | Default `en` |
| `GTM_ID` | — | Google Tag Manager ID |
| `SENTRY_DSN` | — | Sentry DSN |
| `SENTRY_ORG` | — | Sentry org slug |
| `SENTRY_PROJECT` | — | Sentry project slug |
| `SENTRY_AUTH_TOKEN` | — | Sentry auth token (CI only) |
| `SPREE_WEBHOOK_SECRET` | — | Webhook endpoint secret |
| `RESEND_API_KEY` | — | Resend API key (production emails) |
| `EMAIL_FROM` | — | From address for transactional emails |
| `SANITY_PROJECT_ID` | Phase 3 | Sanity project ID |
| `SANITY_DATASET` | Phase 3 | `production` |
| `SANITY_API_TOKEN` | Phase 3 | Server-side read token |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Phase 3 | Safe to expose |

---

## Deploy process

### Storefront
```
git push origin main
  │
  ▼
Vercel auto-deploy (production)

git push origin feature/branch
  │
  ▼
Vercel preview URL (automatic)
```

### Spree backend
```
Render auto-deploys on push to main branch of spree/spree-starter
Manual deploy: Render dashboard → Manual Deploy
```

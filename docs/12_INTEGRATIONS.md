# 12 — Integrations

**Purpose:** All external services, their roles, and credential locations.
**Scope:** Both repositories.
**Dependencies:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md) | [04_API_CONTRACTS.md](./04_API_CONTRACTS.md)
**Related:** [11_DEPLOYMENT.md](./11_DEPLOYMENT.md)
**Update rules:** Add a row when a new external service is integrated. Never store credentials here — reference where they are stored.

---

## Integration map

```
ecommerce-platform (Vercel)
  │
  ├──▶ Spree REST API (Render)
  │       └── @spree/sdk, httpOnly cookies
  │
  ├──▶ Laravel REST API (TBD)
  │       └── packages/api-client (Phase 5)
  │
  ├──▶ Sanity CDN
  │       └── @sanity/client, GROQ (Phase 3)
  │
  ├──▶ Sentry
  │       └── Error tracking, source maps
  │
  ├──▶ Google Tag Manager → GA4
  │       └── Ecommerce events
  │
  └──▶ Resend
          └── Transactional emails via Spree webhooks

Spree (Render)
  │
  ├──▶ Cloudflare R2
  │       └── Active Storage (product images)
  │
  ├──▶ PostgreSQL (Render managed)
  │
  ├──▶ Redis (Render managed)
  │
  └──▶ PayFast (via Laravel — Phase 5)
```

---

## Service reference

| Service | Role | Credentials stored in | Status |
|---|---|---|---|
| Spree (Render) | Commerce engine | Render env vars | ✅ Active |
| Cloudflare R2 | Image storage | Render env vars (`CLOUDFLARE_*`) | ✅ Active |
| Vercel | Frontend hosting | Vercel project env vars | ✅ Active |
| PostgreSQL | Commerce database | Render env vars (`DATABASE_URL`) | ✅ Active |
| Redis | Cache / sessions | Render env vars (`REDIS_URL`) | ✅ Active |
| Sanity | Content management | Vercel env vars (`SANITY_*`) | 🔲 Phase 3 |
| Resend | Transactional email | Vercel env vars (`RESEND_API_KEY`) | 🔲 Pending |
| Sentry | Error tracking | Vercel env vars (`SENTRY_*`) | 🔲 Pending |
| Google Tag Manager | Analytics | Vercel env vars (`GTM_ID`) | 🔲 Pending |
| Laravel API | Enterprise logic | Vercel env vars (TBD) | 🔲 Phase 5 |
| PayFast | Payments (ZA) | Laravel env vars | 🔲 Phase 5 |
| Stripe | Payments (international) | Vercel env vars (`STRIPE_*`) | 🔲 Pending |

---

## Cloudflare R2

- **Bucket:** `spree-store`
- **Endpoint:** `https://275c9a9812e9a1f62185b51c8025b053.r2.cloudflarestorage.com`
- **CORS:** Allows `https://spree-rpvb.onrender.com` (PUT, POST, GET, DELETE, HEAD)
- **Access:** Via `CLOUDFLARE_ACCESS_KEY_ID` / `CLOUDFLARE_SECRET_ACCESS_KEY` on Render
- **storage.yml service:** `cloudflare` (with `force_path_style: true`)

## Spree Webhooks → Resend

When configured, Spree sends signed HMAC webhook events to `/api/webhooks/spree`.
The handler in `apps/storefront/src/app/api/webhooks/spree/route.ts` verifies the signature and sends emails via Resend.

Events: `order.completed`, `order.canceled`, `order.shipped`, `customer.password_reset_requested`

Required env vars: `SPREE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`

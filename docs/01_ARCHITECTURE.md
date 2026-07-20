# 01 — Architecture

**Purpose:** Authoritative source of truth for system design, repository structure, and data ownership.
**Scope:** Both repositories.
**Dependencies:** [PLATFORM_BLUEPRINT.md](../PLATFORM_BLUEPRINT.md) | [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md)
**Related:** [02_SYSTEM_BOUNDARIES.md](./02_SYSTEM_BOUNDARIES.md) | [04_API_CONTRACTS.md](./04_API_CONTRACTS.md) | [11_DEPLOYMENT.md](./11_DEPLOYMENT.md)
**Update rules:** This document wins all conflicts after the Platform Blueprint. Update only when a fundamental architectural decision changes. Record the reason in [08_DECISIONS.md](./08_DECISIONS.md).

---

## Repository map

### Repository 1 — Commerce Backend

```
spree/spree-starter (fork → prooftv/spree-starter)
│
├── Spree Commerce (community edition)
├── PostgreSQL
├── Redis
├── Cloudflare R2 (Active Storage)
└── Deployed on Render
```

Stays as close to upstream `spree/spree-starter` as possible.
Mzo owns this repository.

### Repository 2 — Frontend Platform (this repo)

```
ecommerce-platform/
│
├── apps/
│   ├── storefront/          # Customer-facing Next.js app (Vercel)
│   └── operations/          # Internal dashboard Next.js app (Vercel, Phase 5)
│
├── packages/
│   ├── ui/                  # Shared shadcn/ui components
│   ├── api-client/          # Spree SDK, Laravel SDK, Sanity SDK wrappers
│   ├── auth/                # Authentication utilities
│   ├── types/               # Shared TypeScript types
│   ├── config/              # Shared ESLint, Tailwind, TypeScript configs
│   └── utils/               # Shared utility functions
│
├── sanity/                  # Sanity Studio (content management)
│
├── docs/                    # Engineering handbook (this folder)
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Data ownership

| Data | Owner | API |
|---|---|---|
| Products | Spree | `GET /api/v2/storefront/products` |
| Prices | Spree | included in products response |
| Inventory | Spree | included in variants response |
| Orders | Spree | `GET /api/v2/storefront/orders` |
| Checkout | Spree | `PATCH /api/v2/storefront/checkout` |
| Customers | Spree | `GET /api/v2/storefront/account` |
| Payments | Laravel + PayFast | Laravel REST API |
| Enterprise logic | Laravel | Laravel REST API |
| Homepage content | Sanity | Sanity GROQ / CDN |
| Marketing pages | Sanity | Sanity GROQ / CDN |
| Blog | Sanity | Sanity GROQ / CDN |
| FAQs | Sanity | Sanity GROQ / CDN |

---

## Request flow

### Storefront (customer-facing)

```
Browser
  │
  ▼
Next.js Server Component / Server Action
  │
  ├──▶ @spree/sdk ──▶ Spree REST API (Render)
  │
  ├──▶ packages/api-client ──▶ Laravel REST API
  │
  └──▶ Sanity GROQ ──▶ Sanity CDN
```

No API keys are ever exposed to the browser.
All Spree calls use httpOnly cookies for auth tokens.

### Operations Dashboard

```
Browser
  │
  ▼
Next.js Server Action
  │
  ├──▶ Spree REST API
  ├──▶ Laravel REST API
  └──▶ Sanity API
```

---

## Shared packages dependency graph

```
apps/storefront ──▶ packages/ui
apps/storefront ──▶ packages/api-client
apps/storefront ──▶ packages/types
apps/storefront ──▶ packages/auth

apps/operations ──▶ packages/ui
apps/operations ──▶ packages/api-client
apps/operations ──▶ packages/types
apps/operations ──▶ packages/auth

packages/api-client ──▶ packages/types
packages/auth ──▶ packages/types
```

---

## Technology stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16 |
| UI library | React | 19 |
| Styling | Tailwind CSS | 4 |
| Components | shadcn/ui | latest |
| Commerce SDK | @spree/sdk | latest |
| Content | Sanity | v3 |
| Monorepo | Turborepo + pnpm workspaces | — |
| Language | TypeScript | 5 |
| Testing | Vitest + Playwright | — |
| Error tracking | Sentry | — |
| Analytics | Google Tag Manager + GA4 | — |

---

## Deployment topology

```
Render
  └── spree-starter (Spree + PostgreSQL + Redis + R2)

Vercel
  ├── apps/storefront  (ecommerce-platform, main branch)
  └── apps/operations  (Phase 5)

Cloudflare R2
  └── spree-store bucket (product images, Active Storage)

Sanity
  └── sanity/ (Studio + CDN)
```

See [11_DEPLOYMENT.md](./11_DEPLOYMENT.md) for environment variables and deploy commands.

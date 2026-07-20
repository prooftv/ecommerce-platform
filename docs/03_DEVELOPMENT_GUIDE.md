# 03 — Development Guide

**Purpose:** Local setup, daily workflow, and commands.
**Scope:** `ecommerce-platform` monorepo.
**Dependencies:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)
**Related:** [11_DEPLOYMENT.md](./11_DEPLOYMENT.md) | [04_API_CONTRACTS.md](./04_API_CONTRACTS.md)
**Update rules:** Update when tooling, commands, or setup steps change.

---

## Prerequisites

- Node.js 20+
- pnpm 9+
- GitHub Codespaces (recommended) or local dev environment

---

## Initial setup

```bash
# 1. Clone
git clone https://github.com/prooftv/ecommerce-platform
cd ecommerce-platform

# 2. Install dependencies
pnpm install

# 3. Configure storefront environment
cp apps/storefront/.env.local.example apps/storefront/.env.local
# Edit .env.local — set SPREE_API_URL and SPREE_PUBLISHABLE_KEY

# 4. Start storefront
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001).

---

## Environment variables

See [11_DEPLOYMENT.md](./11_DEPLOYMENT.md) for the full variable reference.

Minimum required for local development:

```env
# apps/storefront/.env.local
SPREE_API_URL=https://spree-rpvb.onrender.com
SPREE_PUBLISHABLE_KEY=<your_publishable_key>
```

---

## Daily commands

```bash
pnpm dev                        # start storefront dev server
pnpm build                      # build storefront
pnpm lint                       # lint all packages
pnpm test                       # run unit tests
pnpm test:e2e                   # run Playwright e2e tests

# Turborepo filter shortcuts
turbo dev --filter=storefront
turbo build --filter=storefront
turbo build --filter=operations  # Phase 5
```

---

## Workflow

```
Codespaces
  │
  ▼
feature branch
  │
  ▼
commit + push
  │
  ▼
Vercel Preview URL (auto)
  │
  ▼
review + merge to main
  │
  ▼
Vercel Production deploy (auto)
```

---

## Adding a shared package

```bash
mkdir packages/my-package
cd packages/my-package
pnpm init
# add to pnpm-workspace.yaml if not already covered by packages/*
```

Reference it from an app:
```json
// apps/storefront/package.json
{
  "dependencies": {
    "@ecommerce/my-package": "workspace:*"
  }
}
```

---

## HTTPS local development (Apple Pay / Google Pay)

See the storefront README for Cloudflare Tunnel setup. Required only for testing payment methods that need a public HTTPS URL.

---

## Testing

```bash
# Unit + integration (Vitest)
pnpm test

# E2E (Playwright — requires Spree backend)
export STRIPE_PUBLISHABLE_KEY=pk_test_...
export STRIPE_SECRET_KEY=sk_test_...
npm run e2e:up        # boots Spree in Docker
npm run test:e2e
npm run e2e:down
```

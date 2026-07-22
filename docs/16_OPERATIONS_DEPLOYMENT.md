# 16 — Operations Dashboard Deployment

**Purpose:** Exact steps to deploy `apps/operations` to Vercel as a separate project.
**Scope:** `apps/operations` only.
**Related:** [11_DEPLOYMENT.md](./11_DEPLOYMENT.md) | [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)

---

## What `apps/operations` is

A Next.js 16 internal dashboard for staff. It lives at `apps/operations/` in the monorepo and is deployed as a **separate Vercel project** from the storefront. It shares packages from `packages/` via pnpm workspaces.

It is **not** the same project as the storefront. It has its own Vercel project, its own URL, its own environment variables.

---

## Pre-deployment checklist

Before creating the Vercel project, confirm:

- [ ] `apps/operations/vercel.json` exists (it does — committed in Sprint 09)
- [ ] `apps/operations/package.json` lists all `@ecommerce/*` deps as `workspace:*`
- [ ] `apps/operations/next.config.ts` has `transpilePackages` for all `@ecommerce/*` packages
- [ ] TypeScript is clean: `cd apps/operations && npx tsc --noEmit` → zero errors
- [ ] Root `package.json` has `"build:operations": "turbo build --filter=operations"`

All of the above are already done.

---

## Step 1 — Create the Vercel project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `prooftv/ecommerce-platform` (same repo as storefront)
3. On the "Configure Project" screen set:

| Setting | Value |
|---|---|
| **Project Name** | `ecommerce-operations` (or your choice) |
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/operations` |

4. Click **Deploy** — it will fail on the first deploy. That is expected. Continue to Step 2.

---

## Step 2 — Set Node version

In the new project: **Settings → General → Node.js Version** → set to **22.x**

---

## Step 3 — Override build settings

In the new project: **Settings → General → Build & Development Settings** → enable overrides:

| Setting | Value |
|---|---|
| **Install Command** | `cd ../.. && npx pnpm@9.15.9 install` |
| **Build Command** | `cd ../.. && npx pnpm@9.15.9 build:operations` |
| **Output Directory** | *(leave blank — Next.js default)* |

**Why these commands:**
- `cd ../..` — moves from `apps/operations/` to the monorepo root where `pnpm-workspace.yaml` lives, so all `workspace:*` packages resolve
- `npx pnpm@9.15.9` — Vercel's bundled pnpm 9.0.x has a bug that breaks all registry fetches on Node 22; this pins the correct version without needing corepack

---

## Step 4 — Add environment variables

In the new project: **Settings → Environment Variables**

### Required

| Variable | Value | Notes |
|---|---|---|
| `LARAVEL_API_URL` | `https://your-laravel-api.com` | Base URL of the Laravel API — no trailing slash |
| `LARAVEL_API_SECRET` | `...` | Shared secret for server-to-server calls (if applicable) |

### When Laravel auth is live

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_LARAVEL_API_URL` | `https://your-laravel-api.com` | Public URL for client-side auth redirects |

### Optional

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ops.yourdomain.com` | Used for absolute URL generation |
| `SENTRY_DSN` | `...` | Error tracking |

> The operations dashboard does **not** need `SPREE_API_URL`, `SPREE_PUBLISHABLE_KEY`, Sanity vars, Stripe vars, or Cloudflare vars. Those belong to the storefront project only.

---

## Step 5 — Redeploy

Trigger a manual redeploy from the Vercel dashboard. The build should succeed.

Expected build output:
```
✓ Compiled successfully
✓ TypeScript clean
Route (app)
├ /login
├ / (redirects to /login or dashboard)
└ /(dashboard)
    ├ /
    ├ /orders
    ├ /products
    ├ /customers
    ├ /reports
    ├ /notifications
    └ /settings
```

---

## Current state of `apps/operations`

| Feature | Status |
|---|---|
| Routing & layout | ✅ Done |
| Login page + form | ✅ Done |
| Auth server actions (`loginAction`, `logoutAction`) | ✅ Done |
| `requireSession` guard on dashboard layout | ✅ Done |
| Sidebar with all nav items | ✅ Done |
| Dashboard header | ✅ Done |
| All module pages (orders, products, customers, reports, notifications, settings) | ✅ Scaffolded (empty state) |
| `packages/auth` — cookie helpers, session, guards | ✅ Done |
| `packages/ui` — base + dashboard components | ✅ Done |
| `packages/api-client` — Laravel domain modules | ✅ Done (typed, not yet wired to live API) |
| Live Laravel API data | ⏳ Blocked on Laravel API being stood up |

---

## What Mzo needs to build (Laravel side)

For the operations dashboard to show real data, the Laravel API needs these endpoints live:

| Endpoint | Used by |
|---|---|
| `POST /api/v1/auth/login` | Login form |
| `POST /api/v1/auth/logout` | Logout action |
| `POST /api/v1/auth/refresh` | Token refresh |
| `GET /api/v1/auth/me` | Session validation |
| `GET /api/v1/dashboard/summary` | Overview page metrics |
| `GET /api/v1/orders` | Orders page |
| `GET /api/v1/reports/revenue` | Reports page |
| `GET /api/v1/notifications` | Notifications page |

Full contracts are in [04_API_CONTRACTS.md](./04_API_CONTRACTS.md).

---

## Local development

```bash
# From monorepo root
pnpm dev:ops
# Opens at http://localhost:3002
```

The storefront runs on port 3001, operations on port 3002. Both can run simultaneously.

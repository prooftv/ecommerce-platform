# 10 — Backlog

**Purpose:** Prioritised list of upcoming work.
**Scope:** `ecommerce-platform` monorepo.
**Dependencies:** [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md) | [09_PROGRESS.md](./09_PROGRESS.md)
**Related:** [07_ROUTES.md](./07_ROUTES.md)
**Update rules:** Move items to `09_PROGRESS.md` when completed. Re-prioritise as needed.

---

## Phase 3 — Content Layer (Next)

- [ ] Initialise Sanity Studio in `sanity/`
- [ ] Define schemas: homepage, hero, blogPost, faq, page
- [ ] Integrate `@sanity/client` into `apps/storefront`
- [ ] Replace static homepage with Sanity-driven content
- [ ] Add blog listing and post pages
- [ ] Add FAQ page
- [ ] Add About page
- [ ] Configure Sanity environment variables on Vercel

---

## Phase 4 — UI Customisation

- [ ] Define client brand tokens (colours, typography, spacing)
- [ ] Apply tokens to `apps/storefront/src/app/globals.css`
- [ ] Scaffold `packages/ui` with shared components
- [ ] Migrate reusable components from storefront to `packages/ui`
- [ ] Apply client design to product listing page
- [ ] Apply client design to product detail page
- [ ] Apply client design to cart and checkout
- [ ] Apply client design to account pages

---

## Phase 5 — Operations Dashboard

- [ ] Scaffold `apps/operations` (Next.js + shadcn/ui)
- [ ] Add to Turborepo pipeline
- [ ] Deploy to Vercel (separate project or same project, different root)
- [ ] Order management (TanStack Table)
- [ ] Customer management
- [ ] Sales reports (charts)
- [ ] Connect to Laravel API (when available)
- [ ] Connect to Sanity API

---

## Infrastructure

- [ ] Upgrade Render to paid tier (eliminate cold starts)
- [ ] Configure custom domain on Vercel
- [ ] Configure custom domain on Render
- [ ] Set up Sentry (DSN, org, project)
- [ ] Set up Google Tag Manager

---

## Integrations

- [ ] Laravel API (Mzo — TBD)
- [ ] PayFast payment gateway (via Laravel)
- [ ] Transactional emails (Resend + `SPREE_WEBHOOK_SECRET`)
- [ ] Stripe (if required alongside PayFast)

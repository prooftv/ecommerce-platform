# 00 — Project Overview

**Purpose:** Single source of truth for project vision, ownership, phases, and goals.
**Scope:** Both repositories. All teams.
**Dependencies:** None. This document has no upstream dependencies.
**Related:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md) | [08_DECISIONS.md](./08_DECISIONS.md) | [09_PROGRESS.md](./09_PROGRESS.md)
**Update rules:** Update when project scope, ownership, or phases change. Never contradict this document in any other file — update this one instead.

---

## What we are building

A single-vendor e-commerce platform for a South African client. The platform serves three audiences:

| Audience | Interface | Repository |
|---|---|---|
| Customers | Storefront (`apps/storefront`) | `ecommerce-platform` |
| Business operators | Operations Dashboard (`apps/operations`) | `ecommerce-platform` |
| Store administrators | Spree Admin | `spree-starter` fork |

---

## Owners

| Area | Owner |
|---|---|
| Commerce backend (Spree) | Mzo |
| Laravel enterprise API | Mzo |
| Frontend platform (this repo) | Bheki |
| Content (Sanity) | Bheki |
| Deployment & infrastructure | Shared |

---

## Technology responsibilities

| System | Owns |
|---|---|
| Spree | Products, prices, inventory, orders, checkout, customers |
| Laravel | Enterprise business logic, PayFast payments, reporting |
| Sanity | Homepage, hero banners, landing pages, blog, FAQs, marketing, promotions, SEO content |
| Operations Dashboard | Consumes Spree + Laravel + Sanity APIs. No business logic of its own. |

---

## Phases

### Phase 1 — Commerce Foundation ✅
- Deploy Spree on Render
- PostgreSQL + Redis
- Admin verified
- REST API verified
- Publishable API key generated
- Cloudflare R2 storage configured

### Phase 2 — Customer Storefront ✅ (In Progress)
- Fork `spree/storefront` → `ecommerce-platform`
- Convert to monorepo (`apps/storefront`, `packages/`, `sanity/`, `docs/`)
- Deploy to Vercel
- Connect to Spree backend
- Verify products, cart, checkout

### Phase 3 — Content Layer
- Integrate Sanity into `apps/storefront`
- Replace static marketing pages with Sanity-driven content
- Spree commerce functionality untouched

### Phase 4 — UI Customisation
- Apply client design system via `packages/ui`
- shadcn/ui components
- Tailwind design tokens
- Preserve Spree storefront upgrade path

### Phase 5 — Operations Dashboard
- Scaffold `apps/operations`
- Connect to Laravel, Spree, Sanity via REST APIs
- TanStack Table, React Query, Charts, Forms

---

## Guiding principles

1. Spree is the commerce engine. Never replace it with custom code.
2. Extend, never rewrite.
3. Preserve the upstream upgrade path at all times.
4. Laravel owns enterprise logic. Spree owns commerce. Sanity owns content.
5. The Operations Dashboard consumes APIs only — no business logic.
6. Shared packages prevent duplication between apps.
7. Documentation is source code. Keep it consistent.

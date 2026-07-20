# 00 — Project Overview

**Purpose:** Project vision, ownership, phases, and goals.
**Scope:** Both repositories. All teams.
**Dependencies:** [PLATFORM_BLUEPRINT.md](../PLATFORM_BLUEPRINT.md)
**Related:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md) | [02_SYSTEM_BOUNDARIES.md](./02_SYSTEM_BOUNDARIES.md) | [08_DECISIONS.md](./08_DECISIONS.md) | [09_PROGRESS.md](./09_PROGRESS.md)
**Update rules:** Update when project scope, ownership, or phases change. The Platform Blueprint is the constitutional authority — this document must remain consistent with it.

---

## What we are building

A composable commerce platform whose first deployment is a single-vendor store, designed to evolve into a multi-vendor marketplace without major architectural changes.

See [PLATFORM_BLUEPRINT.md](../PLATFORM_BLUEPRINT.md) for the full platform vision and evolution strategy.

The platform serves three audiences:

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

See [PLATFORM_BLUEPRINT.md](../PLATFORM_BLUEPRINT.md) Section 2 for the full set of non-negotiable principles.

Summary:
1. Spree owns commerce. Never duplicate commerce logic elsewhere.
2. Laravel owns business capabilities. Never move workflows into the frontend.
3. Sanity owns content. Never use Spree for editorial content.
4. Next.js owns presentation only. Business logic belongs to backend services.
5. The platform is API-first. Every capability is consumable through a well-defined API.
6. Design for marketplace evolution. Phase 1 data models must support Phase 2 without a rewrite.
7. Preserve upgrade paths. Spree core is never modified.

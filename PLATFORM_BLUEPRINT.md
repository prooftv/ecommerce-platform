# Platform Blueprint v1.0

**Status:** Active — authoritative reference for all repositories and all contributors.
**Owner:** Bheki (Architecture & Frontend Lead)
**Last updated:** 2025-07

> This is not a developer guide. This is the platform constitution.
> Every document in `docs/`, every API contract, every implementation decision, and every line of code in this repository must be consistent with this blueprint.
> When in doubt, this document wins.

---

## 1. Vision

We are not building an online store.

We are building a **composable commerce platform** whose first deployment is a single-vendor store. The architecture is intentionally designed so the platform can evolve into a multi-vendor marketplace, and eventually an enterprise commerce platform, without requiring major rewrites of any layer.

```
Phase 1 — Single Vendor Store        (current)
Phase 2 — Multi-Vendor Marketplace   (future)
Phase 3 — Enterprise Platform        (future)
```

Every architectural decision must be evaluated against this trajectory. A decision that works for Phase 1 but blocks Phase 2 is the wrong decision.

---

## 2. Core Principles

These are non-negotiable. They apply to every repository, every developer, and every AI assistant working on this platform.

| # | Principle |
|---|---|
| 1 | **Spree owns commerce.** Never duplicate commerce logic elsewhere. |
| 2 | **Laravel owns business capabilities.** Never move business workflows into the frontend. |
| 3 | **Sanity owns content.** Never use Spree or Laravel for editorial content. |
| 4 | **Next.js owns presentation.** Business logic belongs to backend services. |
| 5 | **The platform is API-first.** Every capability is consumable through a well-defined API. |
| 6 | **Every domain has a single owner.** No duplicated ownership. |
| 7 | **Design for marketplace evolution.** Even in Phase 1, data models must support multi-vendor without a rewrite. |
| 8 | **Preserve upgrade paths.** Spree core is never modified. Extensions and APIs only. |

---

## 3. System Architecture

### Platform overview

```
                        Customers
                            │
                            ▼
              ┌─────────────────────────┐
              │    Next.js Storefront   │
              │    apps/storefront      │
              └─────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
    Spree API          Laravel API       Sanity API
    (Commerce)         (Business)        (Content)


                        Staff / Operators
                               │
                               ▼
              ┌─────────────────────────────┐
              │  Operations Dashboard       │
              │  apps/operations            │
              └─────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                     ▼
    Spree API            Laravel API           Sanity API
```

### Four layers

| Layer | System | Responsibility |
|---|---|---|
| Commerce Engine | Spree | Transactional commerce |
| Business Platform | Laravel | Workflows, reporting, integrations |
| Content Platform | Sanity | Editorial and marketing content |
| Experience Layer | Next.js (this repo) | Presentation only |

---

## 4. Layer Responsibilities

### Layer 1 — Commerce Engine (Spree)

Spree is responsible for all transactional commerce. Nothing else.

**Owns:**
- Products, variants, options
- Pricing and promotions
- Inventory and stock
- Orders and line items
- Checkout flow
- Shipments and fulfilment
- Tax calculation
- Customer accounts
- Payment processing (Stripe, community integrations)

**Does not own:**
- CMS or editorial content
- Business reporting
- Workflow automation
- Enterprise integrations
- Marketplace vendor management

**Rule:** We never modify Spree core. Extensions, API decorators, and configuration only. This preserves the upgrade path from Community to Enterprise.

---

### Layer 2 — Business Platform (Laravel)

Laravel is not another commerce backend. Laravel is the **business platform layer** that orchestrates around Spree.

**Owns:**
- Business workflow engine
- Approval and escalation flows
- Reporting and analytics aggregation
- Third-party integrations (accounting, CRM, ERP, shipping)
- Notification and alert system
- Scheduled jobs and automation
- Marketplace capabilities (Phase 2): vendor management, commission engine, settlement, disputes
- Enterprise APIs (Phase 3)
- Payment gateway integrations specific to the market (e.g. PayFast)

**Does not own:**
- Core commerce (products, orders, checkout) — that is Spree
- Editorial content — that is Sanity
- UI presentation — that is Next.js

**Rule:** Laravel orchestrates business. Laravel does not replace commerce.

---

### Layer 3 — Content Platform (Sanity)

Sanity owns all editorial and marketing content. It has no knowledge of commerce.

**Owns:**
- Homepage layout and content
- Hero banners and campaigns
- Landing pages
- Navigation structure
- Blog and editorial
- FAQs and support content
- Brand and about pages
- SEO metadata
- Promotional content

**Does not own:**
- Products, prices, inventory — that is Spree
- Orders, customers — that is Spree
- Business logic — that is Laravel

**Rule:** If it is content a marketing team edits, it belongs in Sanity. If it is transactional data, it belongs in Spree.

---

### Layer 4 — Experience Layer (this repository)

The `ecommerce-platform` monorepo owns presentation only.

**Storefront (`apps/storefront`) owns:**
- Customer browsing experience
- Product listing and detail pages
- Search and filtering UI
- Cart and checkout UI
- Customer account UI
- Content rendering (from Sanity)

**Operations Dashboard (`apps/operations`) owns:**
- Internal staff interface
- Commerce management views (reads from Spree)
- Reporting views (reads from Laravel)
- Content management links (to Sanity Studio)
- Workflow execution UI (reads/writes Laravel)

**Rule:** The frontend never calculates prices, validates inventory, implements business rules, or duplicates backend logic. It renders data. That is its only job.

---

## 5. Operations Dashboard — Module Map

The Operations Dashboard is not a generic admin panel. It is a structured platform for internal operators.

| Module | Data source | Read | Write |
|---|---|---|---|
| Overview / Dashboard | Laravel | ✅ | — |
| Orders | Spree | ✅ | ✅ |
| Products | Spree | ✅ | ✅ |
| Customers | Spree | ✅ | ✅ |
| Inventory | Spree | ✅ | ✅ |
| Reports & Analytics | Laravel | ✅ | — |
| Workflows | Laravel | ✅ | ✅ |
| Notifications | Laravel | ✅ | ✅ |
| Integrations | Laravel | ✅ | ✅ |
| Content | Sanity | ✅ | ✅ |
| Settings | Spree + Laravel | ✅ | ✅ |
| Vendors *(Phase 2)* | Laravel | ✅ | ✅ |
| Marketplace *(Phase 2)* | Laravel | ✅ | ✅ |

---

## 6. Domain Ownership

This table is the single source of truth for who owns what. No domain appears twice.

| Domain | Owner | Consumed by |
|---|---|---|
| Products | Spree | Storefront, Operations |
| Variants | Spree | Storefront, Operations |
| Inventory | Spree | Storefront, Operations, Laravel |
| Pricing | Spree | Storefront, Operations |
| Promotions | Spree | Storefront, Operations |
| Orders | Spree | Storefront, Operations, Laravel |
| Checkout | Spree | Storefront |
| Shipments | Spree | Storefront, Operations |
| Tax | Spree | Storefront, Checkout |
| Customers | Spree | Storefront, Operations |
| Payments (Stripe) | Spree | Storefront |
| Payments (PayFast) | Laravel | Storefront (via Laravel API) |
| Reporting | Laravel | Operations |
| Workflows | Laravel | Operations |
| Notifications | Laravel | Operations |
| Integrations | Laravel | Operations |
| Vendors *(Phase 2)* | Laravel | Operations, Storefront |
| Homepage | Sanity | Storefront |
| Landing pages | Sanity | Storefront |
| Blog | Sanity | Storefront |
| Navigation | Sanity | Storefront |
| FAQs | Sanity | Storefront |
| SEO metadata | Sanity | Storefront |
| Campaigns | Sanity | Storefront |

---

## 7. Marketplace Evolution Strategy

The platform is designed so Phase 2 (multi-vendor) can be introduced without rewriting Phase 1.

**Design rules that apply from Phase 1:**

- Never hardcode `store` as a singular concept. Use `merchant` or `vendor` in data models where applicable.
- Product data structures must be capable of carrying vendor ownership metadata, even if unused in Phase 1.
- Order data must support multi-shipment and multi-vendor line items (Spree already supports this natively).
- The Operations Dashboard module structure must accommodate a `Vendors` module without restructuring existing modules.
- Laravel's domain model must treat the current single vendor as `vendor_id: 1` internally, so adding vendor 2 requires no schema migration.

**Phase 2 additions (Laravel):**
- Vendor domain (onboarding, profiles, approval)
- Commission engine
- Settlement and payouts
- Dispute management
- Vendor analytics

**Phase 2 additions (Storefront):**
- Vendor profile pages
- Per-vendor product filtering
- Multi-vendor cart handling

---

## 8. Repository Strategy

### Repository 1 — Commerce Backend

```
prooftv/spree-starter
├── Spree Commerce (community edition)
├── PostgreSQL
├── Redis
└── Cloudflare R2 (Active Storage)
Deployed: Render
Owner: Mzo
```

Stays as close to upstream `spree/spree-starter` as possible.
Mzo also builds the Laravel application — either as a separate repository or as a service within this one. That decision is Mzo's to make based on deployment strategy.

### Repository 2 — Frontend Platform (this repository)

```
prooftv/ecommerce-platform
├── apps/
│   ├── storefront/       Next.js — customer experience
│   └── operations/       Next.js — internal operations
├── packages/
│   ├── ui/               shared shadcn/ui components
│   ├── api-client/       Spree SDK + Laravel SDK + Sanity SDK wrappers
│   ├── auth/             authentication utilities
│   ├── types/            shared TypeScript types
│   ├── config/           shared ESLint, Tailwind, TS configs
│   └── utils/            shared utility functions
├── sanity/               Sanity Studio
└── docs/                 engineering handbook
Deployed: Vercel
Owner: Bheki
```

---

## 9. API Philosophy

The frontend defines the data structures it needs. The backend conforms to them.

This is the agreed contract model for this project.

**Frontend responsibilities:**
- Define the shape of data it needs from each API
- Document expected response structures in `docs/04_API_CONTRACTS.md`
- Version API expectations when breaking changes are needed

**Backend responsibilities:**
- Expose stable, versioned REST APIs
- Return typed, consistent responses
- Conform to the data shapes defined by the frontend
- Never return presentation-specific data (no HTML, no CSS classes, no UI state)

**Shared responsibilities:**
- Agree on pagination standards
- Agree on error response format
- Agree on authentication strategy
- Agree on versioning strategy

See `docs/04_API_CONTRACTS.md` for current contracts and `docs/13_BACKEND_IMPLEMENTATION_GUIDE.md` for Mzo's implementation guide.

---

## 10. Authentication Architecture

Authentication spans both repositories and must be agreed jointly.

**Current (Spree):**
- Spree OAuth2 tokens stored in httpOnly cookies
- `withAuthRefresh()` wrapper handles token refresh automatically
- No token ever reaches the browser

**Operations Dashboard (to be designed with Mzo):**
- Staff authentication is separate from customer authentication
- Options: Spree admin tokens, Laravel-issued JWT, or a dedicated auth service
- Decision must be recorded in `docs/08_DECISIONS.md` before implementation

---

## 11. Development Leadership

| Role | Person | Responsibilities |
|---|---|---|
| Architecture & Frontend Lead | Bheki | Platform blueprint, frontend architecture, data models, UX, API expectations, repository standards, documentation |
| Backend Lead | Mzo | Spree extensions, Laravel business platform, integrations, infrastructure, backend API implementation |
| Shared | Both | API contracts, versioning, integration testing, deployment coordination |

**The blueprint is the authoritative reference.** When Bheki and Mzo disagree, the blueprint decides. When the blueprint is silent, it must be updated before work proceeds.

---

## 12. Instructions for Amazon Q

Amazon Q is the repository engineer for `ecommerce-platform`. It implements what the architecture specifies. It does not design the architecture.

**Before every session, read:**
1. This document (`PLATFORM_BLUEPRINT.md`)
2. `docs/README.md`
3. `docs/02_SYSTEM_BOUNDARIES.md`
4. `docs/02_MASTER_PROMPT.md`

**Rules:**
- Treat this blueprint as the project constitution. It wins all conflicts.
- Do not introduce architectural changes without updating the blueprint first.
- Do not create new packages, apps, or major structures without a blueprint reference.
- Prefer extending existing modules over creating parallel implementations.
- Preserve clear domain ownership at all times — check the domain table in Section 6 before writing any data-fetching code.
- Every implementation task must trace back to a blueprint section or a document in `docs/`.
- When something is unclear, ask. Do not assume and implement.

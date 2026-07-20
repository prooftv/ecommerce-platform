# 02 — System Boundaries & Domain Ownership

**Purpose:** Defines exactly what each system owns, what it does not own, and how systems interact. This is the document Mzo and Bheki build against.
**Scope:** All systems — Spree, Laravel, Sanity, Next.js.
**Dependencies:** [PLATFORM_BLUEPRINT.md](../PLATFORM_BLUEPRINT.md) | [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)
**Related:** [04_API_CONTRACTS.md](./04_API_CONTRACTS.md) | [13_BACKEND_IMPLEMENTATION_GUIDE.md](./13_BACKEND_IMPLEMENTATION_GUIDE.md)
**Update rules:** Update only when a domain ownership decision changes. Every change requires a new ADR in [08_DECISIONS.md](./08_DECISIONS.md). This document and the blueprint domain table must always be in sync.

---

## The boundary rule

Every piece of data, every business rule, and every workflow has exactly one owner.
If you cannot identify the owner from this document, stop and resolve it before writing code.

---

## Spree — Commerce Engine

### Owns

| Domain | Notes |
|---|---|
| Products | Master data — name, description, slug, images, metadata |
| Variants | SKUs, option values (size, colour, etc.) |
| Option types & values | Product configuration dimensions |
| Inventory | Stock levels per variant per location |
| Pricing | Base prices, currency, per-market pricing |
| Promotions | Discount rules, coupon codes, automatic promotions |
| Tax categories & rates | Tax calculation at checkout |
| Orders | Order lifecycle from cart to completion |
| Line items | Per-order product selections |
| Checkout | Multi-step checkout state machine |
| Shipments | Fulfilment, tracking, shipping methods |
| Customers | Account, profile, address book |
| Payment methods (Stripe) | Card, Apple Pay, Google Pay via Stripe |
| Store configuration | Currency, locale, market settings |
| CMS pages | Store policy pages (terms, privacy, returns) |

### Does not own

- Editorial content (homepage, blog, campaigns) → Sanity
- Business reporting and analytics → Laravel
- Workflow automation → Laravel
- PayFast or other market-specific payment gateways → Laravel
- Vendor/marketplace management → Laravel (Phase 2)

### Interaction rules

- Frontend reads Spree via `@spree/sdk` through server actions only
- Laravel may read Spree data via the Spree Platform API (admin API) for reporting and workflow purposes
- Laravel never writes to Spree commerce data directly — it uses the Spree API
- Spree core is never modified — extensions and configuration only

---

## Laravel — Business Platform

### Owns

| Domain | Notes |
|---|---|
| Reporting & analytics | Aggregated views across orders, customers, products |
| Business workflows | Order processing rules, approval flows, escalations |
| Notifications | Staff alerts, internal messaging, event-driven notifications |
| Integrations | Accounting (Xero, Sage), CRM, ERP, shipping providers |
| Scheduled jobs | Automated tasks, data sync, batch processing |
| PayFast payments | South African payment gateway integration |
| Audit logs | Business event history |
| Vendors *(Phase 2)* | Vendor profiles, onboarding, approval |
| Commission engine *(Phase 2)* | Commission rules, calculations, settlement |
| Marketplace services *(Phase 2)* | Dispute management, vendor analytics, payouts |
| Enterprise APIs *(Phase 3)* | Advanced automation, cross-store analytics |

### Does not own

- Core commerce (products, orders, checkout) → Spree
- Editorial content → Sanity
- UI presentation → Next.js

### Interaction rules

- Laravel reads order and customer data from Spree via the Spree Platform API
- Laravel exposes its own REST API consumed by the Operations Dashboard
- Laravel may emit webhooks consumed by the storefront for real-time updates
- Laravel defines its own database — it does not share Spree's PostgreSQL schema

---

## Sanity — Content Platform

### Owns

| Domain | Notes |
|---|---|
| Homepage | Layout, hero, featured sections |
| Hero banners | Campaign imagery and copy |
| Landing pages | Marketing and campaign pages |
| Navigation | Menu structure and links |
| Blog | Posts, authors, categories |
| FAQs | Questions, answers, categories |
| About & brand pages | Company story, team, values |
| SEO metadata | Page titles, descriptions, OG images |
| Promotional content | Banners, announcements, seasonal campaigns |

### Does not own

- Products, prices, inventory → Spree
- Orders, customers → Spree
- Business logic → Laravel

### Interaction rules

- Storefront reads Sanity via GROQ queries through server components only
- Sanity Studio is the only write interface for content — no API writes from the frontend
- Sanity content never references Spree IDs directly — use slugs for loose coupling
- Exception: `featuredProducts` in homepage schema may reference Spree product slugs (not IDs)

---

## Next.js — Experience Layer

### Storefront owns

| Domain | Notes |
|---|---|
| Customer browsing UX | PLP, PDP, search, filtering |
| Cart UI | Add, update, remove items |
| Checkout UI | Address, shipping, payment form |
| Customer account UI | Orders, addresses, profile |
| Content rendering | Renders Sanity content |
| Multi-region routing | `/[country]/[locale]/` URL structure |

### Operations Dashboard owns

| Domain | Notes |
|---|---|
| Commerce management UI | Orders, products, customers, inventory views |
| Reporting UI | Charts, tables, exports |
| Workflow UI | Trigger and monitor Laravel workflows |
| Content management links | Links to Sanity Studio |
| Settings UI | Store configuration |
| Vendor management UI *(Phase 2)* | Vendor list, approval, analytics |

### Does not own

- Business rules — belongs to Laravel
- Commerce calculations — belongs to Spree
- Content storage — belongs to Sanity

### Interaction rules

- All API calls are server-side (Server Components or Server Actions)
- No API keys or tokens are ever sent to the browser
- Auth tokens stored in httpOnly cookies only
- `packages/api-client` is the only place that calls external APIs — never call APIs directly from page or component files

---

## Cross-system interaction map

```
Storefront
  ├── reads products, cart, orders, checkout ──▶ Spree API
  ├── reads homepage, blog, navigation ──────▶ Sanity API
  └── reads/writes PayFast checkout ──────────▶ Laravel API

Operations Dashboard
  ├── reads/writes orders, products, customers ──▶ Spree API
  ├── reads reports, workflows, notifications ───▶ Laravel API
  └── reads/writes content ───────────────────────▶ Sanity API

Laravel
  └── reads orders, inventory, customers ─────▶ Spree Platform API

Sanity Studio
  └── standalone — no API dependencies
```

---

## Marketplace evolution boundaries

These boundaries are designed to survive the Phase 1 → Phase 2 transition:

| Today (Phase 1) | Future (Phase 2) | What changes |
|---|---|---|
| One implicit vendor | Multiple explicit vendors | Laravel adds vendor domain |
| Products belong to store | Products belong to vendor | Spree product metadata + vendor_id |
| Single checkout | Multi-vendor checkout | Spree multi-shipment (already supported) |
| Operations = store management | Operations = marketplace management | New modules in `apps/operations` |
| No commission | Commission engine | New Laravel service |

The storefront and Spree require minimal changes. Laravel absorbs the marketplace complexity.

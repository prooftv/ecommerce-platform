# 08 — Architecture Decision Records

**Purpose:** Permanent record of every significant architectural decision and its rationale.
**Scope:** Both repositories.
**Dependencies:** [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md)
**Related:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)
**Update rules:** Append only. Never delete or modify a past ADR. If a decision is reversed, add a new ADR that supersedes it.

---

## ADR-001 — Commerce Engine

**Decision:** Spree Commerce (community edition)
**Date:** 2025-07
**Status:** Accepted

**Reason:**
- Open source, MIT/BSD licensed
- API-first (REST + OpenAPI 3.0)
- Upgradeable — stays close to upstream
- Handles products, inventory, orders, checkout, customers out of the box
- Official Next.js storefront available as fork foundation

---

## ADR-002 — Frontend Framework

**Decision:** Next.js 16 with App Router and React Server Components
**Date:** 2025-07
**Status:** Accepted

**Reason:**
- Server-first architecture keeps API keys server-side
- Official Spree storefront is built on Next.js — preserves upgrade path
- Vercel deployment is first-class
- React 19 Server Components reduce client bundle size

---

## ADR-003 — Monorepo Structure

**Decision:** Single `ecommerce-platform` monorepo using Turborepo + pnpm workspaces
**Date:** 2025-07
**Status:** Accepted

**Reason:**
- Sole frontend engineer — no coordination overhead
- Storefront and Operations Dashboard share components, types, API clients
- Single CI pipeline, single linting config, single TypeScript config
- Turborepo caching speeds up builds

---

## ADR-004 — Content Management

**Decision:** Sanity v3
**Date:** 2025-07
**Status:** Planned (Phase 3)

**Reason:**
- Structured content with GROQ query language
- Real-time preview in Next.js
- Portable Text for rich content
- Hosted Studio — no infrastructure to manage
- Clear separation: Sanity owns content, Spree owns commerce

---

## ADR-005 — Image Storage

**Decision:** Cloudflare R2 for Spree Active Storage
**Date:** 2025-07
**Status:** Accepted

**Reason:**
- Render free tier uses ephemeral disk — uploaded files lost on restart
- R2 is S3-compatible — works with Spree's built-in S3 adapter
- No egress fees (unlike AWS S3)
- 10 GB free tier sufficient for current scale
- `force_path_style: true` required for R2 compatibility

---

## ADR-006 — Deployment Platform (Frontend)

**Decision:** Vercel
**Date:** 2025-07
**Status:** Accepted

**Reason:**
- First-class Next.js support
- Automatic preview deployments per branch
- Edge network for static assets
- Zero-config monorepo support with Root Directory setting

---

## ADR-007 — Deployment Platform (Backend)

**Decision:** Render (free tier for testing)
**Date:** 2025-07
**Status:** Accepted (upgrade planned for production)

**Reason:**
- Simple Ruby/Rails deployment
- Managed PostgreSQL and Redis
- Free tier sufficient for development and testing
- Limitation: ephemeral disk (solved by R2), cold starts on free tier

---

## ADR-008 — Payments

**Decision:** PayFast implemented in Laravel
**Date:** 2025-07
**Status:** Planned

**Reason:**
- PayFast is the primary South African payment gateway
- Laravel owns enterprise business logic including payments
- Spree handles checkout flow; Laravel handles payment processing
- Keeps payment logic out of the frontend

---

## ADR-009 — Two-repository architecture

**Decision:** `spree-starter` fork (Render) + `ecommerce-platform` monorepo (Vercel)
**Date:** 2025-07
**Status:** Accepted

**Reason:**
- Spree backend stays as close to upstream as possible
- Frontend platform evolves independently
- Clear ownership boundary: Mzo owns backend, Bheki owns frontend
- Spree can be upgraded without touching frontend code

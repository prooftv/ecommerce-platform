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

---

## ADR-010 — Sanity is a mandatory platform service

**Decision:** Sanity CMS is a required dependency. The application does not support running without it.
**Date:** 2025-07
**Status:** Accepted

**Reason:**

Sanity drives site settings, navigation, content pages, blog, announcements, and redirects. Treating it as optional produced silent failures (guards returning empty arrays/nulls) and prevented `generateStaticParams` from working correctly with `cacheComponents`.

**Configuration pattern:**

Public, non-secret identifiers use env vars with hardcoded defaults so the platform works on a fresh clone with zero configuration:

```ts
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "52t49djs";
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";
```

Secret values (`SANITY_API_TOKEN`) remain env-var-only with no default.

**Principle established:**

> Platform services are mandatory. Deployment-specific configuration is externalized through environment variables with safe defaults where appropriate.

This applies to all platform services going forward:
- ✅ Hardcode: API versions, default locales, pagination sizes, compile-time feature flags
- ⚙️ Env var with default: project IDs, dataset names, public analytics IDs, Stripe publishable key
- 🔒 Env var only (no default): API tokens, secrets, private keys

**Consequences:**
- Simpler code — no `isSanityConfigured()` guards
- Deterministic builds — `generateStaticParams` always has data
- Consistent SSG — blog/pages pre-rendered at build time
- New client deployments only change env vars, not source code

---

## ADR-011 — Remove `cacheComponents` experimental flag

**Superseded by:** ADR-012 (implementation consequence)

**Decision:** `cacheComponents: true` removed from `next.config.ts`.
**Date:** 2025-07
**Status:** Accepted

**Reason:**

`cacheComponents` is a Turbopack-specific experimental feature that pre-renders React Server Components into a build-time cache. It enforces that every `generateStaticParams` function returns at least one result — failing the build otherwise.

This constraint is incompatible with CMS-driven routes where content may legitimately be empty at build time (e.g. a blog with no posts yet). The correct behaviour for those routes is on-demand ISR, not a build failure.

**Consequences:**
- Build succeeds regardless of CMS content state
- `generateStaticParams` on blog/[slug] pre-renders posts that exist at build time; new posts are rendered on first request via ISR
- `cacheLife` configuration is retained for use with `use cache` directives
- Re-evaluate `cacheComponents` when it exits experimental status and its constraints are better documented

---

## ADR-012 — Replace experimental `use cache` directives with `unstable_cache`

**Depends on:** ADR-011 (ADR-012 is the implementation consequence of ADR-011)

**Decision:** Remove all `"use cache: remote"`, `cacheLife()`, and `cacheTag()` usages. Replace with `unstable_cache` from `next/cache`.
**Date:** 2025-07
**Status:** Accepted

**Reason:**

The Spree storefront upstream adopted Next.js experimental `cacheComponents` + `"use cache: remote"` directives. These four APIs (`cacheComponents`, `"use cache: remote"`, `cacheLife`, `cacheTag`) are a coupled experimental system — removing one breaks the others.

Per ADR-011, `cacheComponents` was removed because it requires non-empty `generateStaticParams` at build time, which conflicts with CMS-driven routes. The remaining experimental directives therefore had to be replaced.

**Replacement:**

`unstable_cache` is the stable Next.js API for caching arbitrary async functions with tags and revalidation. It has been available since Next.js 14 and is the documented approach for caching SDK/API calls that are not raw `fetch` requests.

Cache semantics are preserved:
- `"hours"` → `revalidate: 3600`
- `"tenMinutes"` → `revalidate: 600`
- `"minutes"` → `revalidate: 60`
- `cacheTag(...)` → `tags: [...]` in `unstable_cache` options

**Principle applied:** Stable over experimental (see `03_DEVELOPMENT_GUIDE.md`).

## ADR-013 — Shared packages wired as workspace dependencies via pnpm monorepo root build

**Decision:** `packages/types`, `packages/api-client`, `packages/config`, `packages/auth`, `packages/ui` are wired as `workspace:*` dependencies. Vercel builds from the monorepo root using pnpm.
**Date:** 2025-07
**Status:** Accepted

**Reason:**

`apps/operations` was scaffolded (Sprint 08), triggering the migration described in the original ADR-013. The Vercel build for `apps/storefront` was migrated to run `pnpm install` from the monorepo root so `workspace:*` dependencies resolve correctly.

**Build configuration (`apps/storefront/vercel.json`):**
```json
{
  "framework": "nextjs",
  "installCommand": "cd ../.. && npx pnpm@9.15.9 install",
  "buildCommand": "cd ../.. && npx pnpm@9.15.9 build:storefront"
}
```

**Why `npx pnpm@9.15.9`:** Vercel's bundled pnpm 9.0.x has a `URLSearchParams` bug (`ERR_INVALID_THIS`) that causes all registry fetches to fail on Node 22. Pinning via `npx` bypasses the bundled version entirely.

**Node version:** 22 LTS (set in Vercel project settings). Node 24 is not yet stable enough for the ecosystem.

**Consequence:**
- `apps/storefront` `package.json` lists all `@ecommerce/*` packages as `workspace:*` deps
- `apps/storefront/src/lib/sanity/types.ts` remains a standalone copy until storefront imports are migrated to `@ecommerce/types` (non-breaking, tracked in backlog)
- `apps/operations` consumes `@ecommerce/ui`, `@ecommerce/auth`, `@ecommerce/types`, `@ecommerce/api-client` directly

---

## ADR-014 — Published and draft Sanity content use isolated clients

**Decision:** Two separate Sanity clients. `sanityClient` (published, CDN) for all production renders. `draftClient` (previewDrafts, no CDN) only when Next.js draft mode is active.
**Date:** 2025-07
**Status:** Accepted

**Reason:**

A single client that conditionally switches perspective creates risk of draft content leaking into production renders through caching or misconfiguration. Separate clients make the boundary explicit and auditable.

**Published client** (`src/lib/sanity/client.ts`):
- `perspective: "published"`
- `useCdn: true` in production
- No token required for public content
- Next.js fetch cache with `revalidate` and `tags`

**Draft client** (`src/lib/sanity/preview.ts`):
- `perspective: "previewDrafts"`
- `useCdn: false` — always hits live API
- Requires `SANITY_API_TOKEN` with read access
- Cache disabled — `{}` options passed to every fetch

**Activation:** Next.js `draftMode()` cookie, set by `/api/draft/enable` after validating `SANITY_PREVIEW_SECRET`.

**Security principle:** `SANITY_PREVIEW_SECRET` is server-side only. It is never prefixed `NEXT_PUBLIC_`. The `productionUrl` resolver in `sanity.config.ts` runs in the Next.js server context — the secret is injected at that point and never shipped to the browser.

**Consequences:**
- Published site can never accidentally query drafts
- CDN remains active for all production traffic
- Preview is opt-in per request, not per deployment
- Cache tags and revalidation are unaffected by preview activity

---

## ADR-015 — Authentication provider abstraction in `packages/auth`

**Decision:** All authentication logic lives in `packages/auth`. Applications import `login()`, `logout()`, `getSession()`, `requireSession()` from this package. The underlying provider is an implementation detail.
**Date:** 2025-07
**Status:** Accepted

**Reason:**

The Operations Dashboard requires staff authentication separate from Spree customer authentication. Rather than coupling `apps/operations` directly to Laravel JWT, the auth interface is abstracted so the provider can change without touching application code.

**Phase 1 provider:** Laravel — issues JWT access + refresh tokens via `/api/v1/auth/*`.

**Interface (provider-agnostic):**
```ts
login(email, password)  →  { success, user } | { success: false, error }
logout()                →  void
getSession()            →  OperationsSession | null
requireSession()        →  OperationsSession (redirects if unauthenticated)
requireRole(role)       →  OperationsSession (redirects if insufficient role)
```

**Token storage:** httpOnly cookies (`ops_access_token`, `ops_refresh_token`). Separate cookie namespace from Spree customer tokens (`spree_access_token`). No token ever reaches the browser.

**Session decoding:** JWT payload decoded client-side for expiry check only. Signature verification happens on the Laravel API on every authenticated request.

**Provider swap:** To change from Laravel JWT to Sanctum, Passport, Auth0, or Keycloak — update `packages/auth/src/session.ts` only. `apps/operations` is unaffected.

**Consequences:**
- `apps/operations` has zero knowledge of the auth provider
- `apps/storefront` Spree auth is unaffected — it uses `src/lib/spree/` directly (Spree-specific, not shared)
- Future `apps/` can adopt the same auth package with a different provider implementation


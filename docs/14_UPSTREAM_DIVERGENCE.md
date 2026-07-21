# 14 — Upstream Divergence Report

**Purpose:** Inventory of deliberate divergences from `spree/storefront` upstream.
**Scope:** `apps/storefront/` only.
**Generated:** 2025-07
**Upstream ref:** `https://github.com/spree/storefront` (`main`)
**Related:** [08_DECISIONS.md](./08_DECISIONS.md) | [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)
**Update rules:** Update when a divergence is introduced, resolved, or its status changes.

---

## How to read this document

Each divergence is classified as:

- **Required** — must remain; removing it would break platform architecture or business requirements
- **Configurable** — could be toggled or upstreamed; low coupling to platform identity
- **Temporary** — should be revisited when upstream or framework changes

Upgrade impact:
- 🟢 Low — upstream changes unlikely to conflict
- 🟡 Medium — manual merge work expected on upgrade
- 🔴 High — upstream changes will conflict; requires deliberate review

---

## 1. Monorepo structure

**Type:** Required
**Upgrade impact:** 🟡 Medium

Upstream ships as a standalone Next.js app at the repo root. We restructured into `apps/storefront/` inside a Turborepo monorepo to support `apps/operations/` and `packages/` in future phases.

All file paths diverge by the `apps/storefront/` prefix. Git sees every file as "Added" rather than "Modified" — a structural artefact, not a content divergence.

**Upgrade strategy:** When pulling upstream changes, strip the path prefix and apply diffs manually to `apps/storefront/src/`.

---

## 2. Caching layer — `use cache` replaced with `unstable_cache`

**Files:** `src/lib/data/products.ts`, `categories.ts`, `markets.ts`, `countries.ts`
**Type:** Required
**Upgrade impact:** 🔴 High
**ADR:** ADR-011, ADR-012

Upstream uses the experimental `cacheComponents` + `"use cache: remote"` + `cacheLife` + `cacheTag` system. We replaced this with `unstable_cache` from `next/cache`.

**Reason:** `cacheComponents` requires every `generateStaticParams` to return at least one result at build time. This is incompatible with CMS-driven routes where content may be empty on a fresh deployment. The four experimental APIs are a coupled system — removing one requires removing all.

Cache semantics are preserved:

| Upstream `cacheLife` | Our `revalidate` |
|---|---|
| `"hours"` | `3600` |
| `"tenMinutes"` | `600` |
| `"minutes"` | `60` |

Cache tags are identical. `revalidateTag()` calls in mutation actions are unaffected.

**Reintroduction criteria:** Re-evaluate when `cacheComponents` exits experimental and no longer enforces non-empty `generateStaticParams`. See ADR-012 for full acceptance criteria.

---

## 3. Caching moved to data layer (CategoryBanner)

**File:** `src/app/[country]/[locale]/(storefront)/c/[...permalink]/CategoryBanner.tsx`
**Type:** Required
**Upgrade impact:** 🟡 Medium
**ADR:** ADR-012

Upstream placed `"use cache: remote"` inside the `CategoryBanner` component. We removed it — caching belongs in the data layer (`getCategory`), not in presentation components.

**Reason:** Components should not know how data is cached. This separation allows the data layer to evolve (swap `unstable_cache` for Redis, a `packages/api` wrapper, etc.) without touching components.

---

## 4. Sanity CMS integration

**Files:** `src/lib/sanity/` (entire directory), `src/app/studio/`, `src/components/home/HeroSection.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/MobileMenu.tsx`, `src/components/layout/SearchToggle.tsx`, `src/components/layout/AnnouncementBar.tsx`, `src/components/layout/AnnouncementBarClient.tsx`
**Type:** Required
**Upgrade impact:** 🟡 Medium
**ADR:** ADR-010

Upstream has no CMS integration. We added Sanity as a mandatory platform service driving site settings, navigation, hero, announcements, blog, pages, landing pages, and redirects.

**Upgrade strategy:** When pulling upstream changes to `HeroSection`, `Header`, `Footer`, or `MobileMenu`, manually re-apply the Sanity data-fetching layer on top of the upstream component changes.

---

## 5. Middleware — studio route exclusion

**File:** `src/proxy.ts`
**Type:** Required
**Upgrade impact:** 🟢 Low

Added `studio` to the middleware matcher exclusion list so `/studio` is not redirected to `/{country}/{locale}/studio`.

```diff
- "/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*$).*)"
+ "/((?!api/|studio|_next/static|_next/image|favicon.ico|.*\\..*$).*)"
```

---

## 6. `next.config.ts` — image domains, Sanity redirects, Render/R2 patterns

**File:** `next.config.ts`
**Type:** Required
**Upgrade impact:** 🟡 Medium

Upstream ships a minimal `remotePatterns` list. We extended it with:
- `*.onrender.com` — Spree backend on Render
- `*.r2.dev`, `*.cloudflarestorage.com` — Cloudflare R2 image storage
- `cdn.sanity.io` — Sanity image CDN
- Dynamic patterns derived from `SPREE_API_URL` and `NEXT_PUBLIC_SITE_URL`

Also added `getSanityRedirects()` wired to the `redirects` key, fetching CMS-managed redirects at build time.

Removed `cacheComponents: true` and `cacheLife` config block (ADR-011, ADR-012).

**Upgrade strategy:** Our additions are additive. When upstream updates `next.config.ts`, merge carefully — conflicts are unlikely but possible if upstream restructures the config shape.

---

## 7. `FeaturedProducts` — simplified caching API

**File:** `src/components/products/FeaturedProducts.tsx`
**Type:** Required (consequence of caching refactor)
**Upgrade impact:** 🟡 Medium
**ADR:** ADR-012

Upstream calls `cachedListProducts(params, options, userToken)` directly from the component. We replaced this with `getProducts(params)` — locale, country, and token resolution are encapsulated inside the data function. The component no longer needs to know about cache segmentation.

---

## Upstream strategy

### Follow upstream when
- Bug fixes and security patches
- Accessibility improvements
- Framework compatibility updates (Next.js, React upgrades)
- Performance improvements that do not require experimental features

### Diverge when
- Platform architecture requirements (monorepo, multi-app)
- Business requirements (Sanity, PayFast, Laravel)
- Stability over experimental features
- Long-term maintainability

---

## Summary

| # | Area | Files affected | Type | Upgrade impact |
|---|---|---|---|---|
| 1 | Monorepo structure | All `src/` files | Required | 🟡 Medium |
| 2 | Caching layer | 4 data files | Required | 🔴 High |
| 3 | Caching in data layer | `CategoryBanner.tsx` | Required | 🟡 Medium |
| 4 | Sanity CMS | ~20 files | Required | 🟡 Medium |
| 5 | Middleware | `proxy.ts` | Required | 🟢 Low |
| 6 | Next.js config | `next.config.ts` | Required | 🟡 Medium |
| 7 | FeaturedProducts API | 1 component | Required | 🟡 Medium |

All current divergences are **Required**. None are temporary hacks or configurable toggles. Each has a documented ADR or clear architectural rationale.

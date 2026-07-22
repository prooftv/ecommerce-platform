# 09 — Progress

**Purpose:** Sprint-by-sprint engineering tracker.
**Scope:** Both repositories.
**Dependencies:** [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md)
**Related:** [10_BACKLOG.md](./10_BACKLOG.md)
**Update rules:** Append a new sprint block after each sprint. Never edit past sprints.

---

## Sprint 01 — Foundation

### Completed
✅ Fork `spree/spree-starter` → `prooftv/spree-starter`
✅ Deploy Spree on Render (free tier)
✅ PostgreSQL provisioned
✅ Redis provisioned
✅ Spree Admin verified
✅ REST API verified (`/api/v2/storefront/products`)
✅ Publishable API key generated
✅ Storefront URL configured in Spree Admin

---

## Sprint 02 — Storefront Deployment

### Completed
✅ Fork `spree/storefront` → `prooftv/ecommerce-platform`
✅ Convert to monorepo (`apps/storefront`, `packages/`, `sanity/`, `docs/`)
✅ Root `package.json`, `turbo.json`, `pnpm-workspace.yaml` created
✅ Deploy to Vercel
✅ Connect storefront to Render Spree backend
✅ Products visible on storefront
✅ `*.onrender.com` added to Next.js `remotePatterns`
✅ Vercel Root Directory set to `apps/storefront`
✅ `/_next/image` function working

---

## Sprint 03 — Image Storage

### Completed
✅ Cloudflare R2 bucket `spree-store` created
✅ R2 API token created (`spree-r2`)
✅ CORS policy configured on R2 bucket (allows `spree-rpvb.onrender.com`)
✅ Render environment variables updated (`CLOUDFLARE_*` prefix)
✅ `RAILS_STORAGE=cloudflare` set on Render
✅ `spree-starter` `storage.yml` cloudflare service confirmed
✅ Product image upload working end-to-end
✅ Images served via `/_next/image` on Vercel

---

## Sprint 04 — Documentation & Sanity Studio

### Completed
✅ `docs/README.md` — documentation index
✅ `docs/00_PROJECT_OVERVIEW.md`
✅ `docs/01_ARCHITECTURE.md`
✅ `docs/02_SYSTEM_BOUNDARIES.md`
✅ `docs/02_MASTER_PROMPT.md`
✅ `docs/03_DEVELOPMENT_GUIDE.md`
✅ `docs/04_API_CONTRACTS.md`
✅ `docs/05_DESIGN_SYSTEM.md`
✅ `docs/06_SANITY_MODEL.md`
✅ `docs/07_ROUTES.md`
✅ `docs/08_DECISIONS.md`
✅ `docs/09_PROGRESS.md`
✅ `docs/10_BACKLOG.md`
✅ `docs/11_DEPLOYMENT.md`
✅ `docs/12_INTEGRATIONS.md`
✅ `docs/13_BACKEND_IMPLEMENTATION_GUIDE.md`
✅ `PLATFORM_BLUEPRINT.md`

## Sprint 05 — Sanity Integration

### Completed
✅ Sanity studio scaffolded at `sanity/`
✅ Schemas: `siteSettings`, `homepage`, `blogPost`, `faq`, `page`, `landingPage`, `teamMember`, `testimonial`, `navigationMenu`, `announcementBar`, `redirect`, `seo`, `portableText`
✅ Studio structure with grouped sidebar (Content, People, Site) and icons
✅ `@sanity/color-input` plugin integrated
✅ Storefront Sanity client (`src/lib/sanity/client.ts`) — server-side only
✅ Full TypeScript types for all schemas (`src/lib/sanity/types.ts`)
✅ GROQ queries with Next.js cache tags for all content types (`src/lib/sanity/queries.ts`)
✅ `HeroSection` replaced with Sanity-driven version — static fallback, `next/image`, hotspot, overlay, accessible alt
✅ `AnnouncementBar` server component — time-gated, session-dismissible
✅ `AnnouncementBar` added to storefront layout
✅ `generateHomeMetadata` extended with Sanity SEO fields + Twitter card
✅ `cdn.sanity.io` added to Next.js image remote patterns
✅ Sanity env vars added to `.env.local.example`

## Sprint 06 — Sanity Content Routes & Configuration

### Completed
✅ Sanity Studio embedded at `/studio` (Next.js dynamic import, `ssr: false`)
✅ Middleware updated to exclude `/studio` from locale redirect
✅ Dashboard widgets: `PlatformWidget`, `AnalyticsWidget`, document lists
✅ Blog index (`/blog`) and post detail (`/blog/[slug]`) with `generateStaticParams`, canonical URL, JSON-LD
✅ CMS pages (`/pages/[slug]`) with PortableText
✅ Landing pages (`/lp/[slug]`) with sections array renderer
✅ Sanity redirects fetched at build time in `next.config.ts`
✅ `siteSettings` wired into header logo and footer (social links, copyright, tagline)
✅ `navigationMenu` wired into header desktop nav (CSS hover dropdowns) and mobile menu (slide panels)
✅ `@portabletext/react` installed
✅ Sanity project ID moved to env var with default (`NEXT_PUBLIC_SANITY_PROJECT_ID ?? "52t49djs"`)
✅ `isSanityConfigured()` removed — Sanity is a mandatory platform service (ADR-010)
✅ All `isSanityConfigured()` guards removed from queries
✅ `generateStaticParams` restored for blog/[slug] — builds correctly with `cacheComponents`
✅ `imageUrlBuilder` deprecation fixed (`createImageUrlBuilder`)
✅ ADR-010 documented in `08_DECISIONS.md`
✅ Local-first development principle added to `03_DEVELOPMENT_GUIDE.md`

## Sprint 09 — Vercel Build Fix & TypeScript Hardening

### Completed
✅ **pnpm workspace build on Vercel** — `apps/storefront/vercel.json` updated with `installCommand` and `buildCommand` running from monorepo root
✅ **pnpm version pinned** — `npx pnpm@9.15.9` in Vercel commands bypasses bundled pnpm 9.0.x which has `ERR_INVALID_THIS` / `URLSearchParams` bug on Node 22
✅ **Node version** — Vercel project set to Node 22 LTS (was 24, which is not yet stable for this ecosystem)
✅ **Root `vercel.json`** — `installCommand: "pnpm install"` added at repo root
✅ **`.npmrc`** — `shamefully-hoist=true`, `node-linker=hoisted`, `network-concurrency=1` added
✅ **Stale lockfile removed** — `pnpm-lock.yaml` deleted and regenerated by Vercel on first clean build
✅ **ADR-013 updated** — workspace packages now fully wired (migration trigger met)
✅ **TypeScript errors fixed** — all `string | null` Spree SDK field usages patched across 8 files:
  - `CheckoutPageContent.tsx` — `cart.total`
  - `cart/page.tsx` — `discount_total`, `delivery_total`, `tax_total`, `gift_card_total`, `store_credit_total`, `amount_due`, `total`
  - `Summary.tsx` — same fields
  - `CartDrawer.tsx` — `discount_total`, `total`, `item.price`
  - `OrderTotals.tsx` — `discount_total`, `tax_total`, `gift_card_total`, `store_credit_total`, `amount_due`
  - `GiftCardList.tsx` — `display_amount_used`, `display_amount`
  - `PaymentInfo.tsx` — `display_amount`, `display_amount_remaining`
  - `PaymentSection.tsx` — `amount_due ?? total`
  - `express-checkout.ts` — `item_total`, `discount_total`, `additional_tax_total`
  - `handlers.ts` (webhooks) — all `display_*` fields on order items and shipments
✅ **Build passing** — `storefront:build` succeeds, 189 static pages generated, deployed to Vercel

### Turbo env var warnings (non-fatal, tracked)
The following Vercel env vars are not in `turbo.json` `env` array — they are available at runtime but not in Turbo's cache key:
- `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_BUCKET`, `CLOUDFLARE_ENDPOINT`, `CLOUDFLARE_SECRET_ACCESS_KEY`
- `RAILS_STORAGE`, `AWS_REGION`
- `SANITY_API_TOKEN`, `SANITY_PROJECT_ID`, `SANITY_PREVIEW_SECRETE` *(note: typo in Vercel — should be `SANITY_PREVIEW_SECRET`)*

### Checkpoint for Mzo
The storefront builds and deploys cleanly. The monorepo workspace is fully wired. Mzo can now:
1. Set up `apps/operations` as a second Vercel project (root directory: `apps/operations`, same install/build pattern)
2. Stand up the Laravel API — `packages/auth` and `packages/api-client/src/laravel/` are ready to consume it
3. Wire `getDashboardSummary()` into the operations overview page once the Laravel `/api/v1/dashboard/summary` endpoint is live

### Next
- [ ] Add Turbo env vars to `turbo.json` (Cloudflare, Sanity, Rails)
- [ ] Fix `SANITY_PREVIEW_SECRETE` typo in Vercel env vars → `SANITY_PREVIEW_SECRET`
- [ ] Deploy `apps/operations` to Vercel as separate project
- [ ] Migrate `apps/storefront` Sanity type imports to `@ecommerce/types`
- [ ] Laravel API live → wire dashboard data
- [ ] Phase 4: brand tokens applied to `packages/ui`



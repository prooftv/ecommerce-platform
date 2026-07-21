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

### Next
- [ ] FAQ page route (`/faq`)
- [ ] Sanity Preview Mode
- [ ] Phase 4: UI customisation via `packages/ui`

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

### Next
- [ ] Create Sanity project at sanity.io — get project ID
- [ ] Add SANITY_PROJECT_ID to Vercel env vars
- [ ] Deploy Sanity Studio
- [ ] Seed homepage content in Studio
- [ ] Seed demo products and categories in Spree

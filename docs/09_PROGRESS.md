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

## Sprint 04 — Documentation

### Completed
✅ `docs/README.md` — documentation index
✅ `docs/00_PROJECT_OVERVIEW.md`
✅ `docs/01_ARCHITECTURE.md`
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

### Next
- [ ] Sanity Studio setup (`sanity/`)
- [ ] Integrate Sanity into `apps/storefront`
- [ ] Replace static homepage with Sanity-driven content
- [ ] Seed demo products and categories in Spree

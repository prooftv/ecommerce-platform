# 10 — Backlog

**Purpose:** Prioritised list of upcoming work.
**Scope:** `ecommerce-platform` monorepo.
**Dependencies:** [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md) | [09_PROGRESS.md](./09_PROGRESS.md)
**Related:** [07_ROUTES.md](./07_ROUTES.md)
**Update rules:** Move items to `09_PROGRESS.md` when completed. Re-prioritise as needed.

---

## Phase 3 — Content Layer (Next)

- [x] Initialise Sanity Studio in `sanity/`
- [x] Define schemas: homepage, hero, blogPost, faq, page, landingPage, teamMember, testimonial, navigationMenu, announcementBar, redirect, seo
- [x] Integrate `@sanity/client` into `apps/storefront`
- [x] Replace static homepage with Sanity-driven content
- [x] Add blog listing and post pages
- [x] Add CMS pages (`/pages/[slug]`)
- [x] Add landing pages (`/lp/[slug]`)
- [x] Wire `siteSettings` into header logo and footer (social links, copyright, tagline)
- [x] Wire `navigationMenu` into header desktop nav and mobile menu
- [x] Sanity redirects fetched at build time in `next.config.ts`
- [x] Configure Sanity environment variables on Vercel
- [x] Add FAQ page route (`/faq`)
- [x] Implement Sanity Preview Mode (draft content in Studio)

---

## Phase 4 — UI Customisation

- [x] Scaffold `packages/config` — shared TypeScript and Biome configs
- [x] Scaffold `packages/types` — Sanity types, Spree primitives, Laravel Phase 1 contracts
- [x] Scaffold `packages/api-client` — Sanity client wrapper, Spree SDK wrapper, Laravel client stub
- [ ] Wire packages as workspace dependencies (trigger: when `apps/operations` is scaffolded — see ADR-013)
- [ ] Scaffold `packages/ui` with shared components (needs brand tokens — Phase 4 input)
- [ ] Scaffold `packages/auth` (when `apps/operations` is scaffolded)

---

## Phase 5 — Operations Dashboard

- [ ] Scaffold `apps/operations` (Next.js + shadcn/ui)
- [ ] Add to Turborepo pipeline
- [ ] Deploy to Vercel (separate project or same project, different root)
- [ ] Order management (TanStack Table)
- [ ] Customer management
- [ ] Sales reports (charts)
- [ ] Connect to Laravel API (when available)
- [ ] Connect to Sanity API

---

## Infrastructure

- [ ] Upgrade Render to paid tier (eliminate cold starts)
- [ ] Configure custom domain on Vercel
- [ ] Configure custom domain on Render
- [ ] Set up Sentry (DSN, org, project)
- [ ] Set up Google Tag Manager

---

## Integrations

- [ ] Laravel API (Mzo — TBD)
- [ ] PayFast payment gateway (via Laravel)
- [ ] Transactional emails (Resend + `SPREE_WEBHOOK_SECRET`)
- [ ] Stripe (if required alongside PayFast)

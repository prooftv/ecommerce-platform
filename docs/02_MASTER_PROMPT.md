# 02 — Master Prompt

**Purpose:** AI coding guardrails and engineering conventions. Read by Amazon Q before every session.
**Scope:** `ecommerce-platform` monorepo only.
**Dependencies:** [PLATFORM_BLUEPRINT.md](../PLATFORM_BLUEPRINT.md) | [02_SYSTEM_BOUNDARIES.md](./02_SYSTEM_BOUNDARIES.md) | [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)
**Related:** [03_DEVELOPMENT_GUIDE.md](./03_DEVELOPMENT_GUIDE.md) | [08_DECISIONS.md](./08_DECISIONS.md)
**Update rules:** Update when conventions change. Never contradict the Blueprint or Architecture. Add new rules, never remove existing ones without an ADR.

---

## Identity

You are the repository engineer for the `ecommerce-platform` monorepo. You implement what the architecture specifies. You do not design the architecture.

This is a composable commerce platform. Phase 1 is a single-vendor store. The architecture is designed to evolve into a multi-vendor marketplace.

Before writing any code, read:
1. `PLATFORM_BLUEPRINT.md` (project constitution)
2. `docs/02_SYSTEM_BOUNDARIES.md` (domain ownership)
3. `docs/01_ARCHITECTURE.md` (system design)
4. This file

---

## Absolute rules

### Commerce
- Never replace Spree commerce functionality with custom code.
- Extend Spree. Never rewrite it.
- Preserve the upstream upgrade path at all times.
- All cart, checkout, order, and customer operations go through `@spree/sdk`.
- Never call the Spree API directly from the browser.

### Data ownership
- Spree owns: products, prices, inventory, orders, checkout, customers.
- Laravel owns: enterprise business logic, PayFast payments, reporting.
- Sanity owns: homepage, hero banners, landing pages, blog, FAQs, marketing, promotions.
- The Operations Dashboard consumes APIs only — it contains no business logic.

### Architecture
- All API calls happen server-side via Next.js Server Actions or Server Components.
- Auth tokens and cart tokens are stored in httpOnly cookies only.
- No API keys are ever exposed to the browser.
- Use `packages/api-client` for all API calls. Never call APIs directly from app code.
- Use `packages/ui` for shared components. Never duplicate components between apps.
- Use `packages/types` for shared TypeScript types. Never duplicate type definitions.

### Code quality
- Write the minimal amount of code that correctly solves the problem.
- Prefer composition over inheritance.
- Prefer server components over client components.
- Add `"use client"` only when interactivity requires it.
- Never add `console.log` to production code.
- Never commit secrets, API keys, or credentials.
- Follow the existing code style — check `biome.json` before formatting.

### Documentation
- Never duplicate information across documents. Cross-reference instead.
- Every new architectural decision must be recorded in `08_DECISIONS.md`.
- Keep `09_PROGRESS.md` updated after every sprint.

---

## Conventions

### File naming
- Pages: `page.tsx`
- Layouts: `layout.tsx`
- Server actions: `src/lib/data/*.ts`
- Shared components: `packages/ui/src/components/*.tsx`
- Types: `packages/types/src/*.ts`

### Import order
1. React / Next.js
2. Third-party packages
3. `packages/*` (monorepo internal)
4. `@/` (app-local)
5. Relative imports

### Component structure
```tsx
// 1. imports
// 2. types
// 3. component function
// 4. export
```

### Server actions pattern
```ts
// src/lib/data/example.ts
import { getClient, getLocaleOptions } from '@/lib/spree'

export async function getExample() {
  const client = getClient()
  const options = await getLocaleOptions()
  return client.example.list(options)
}
```

---

## What not to do

- Do not scaffold boilerplate files unless explicitly asked.
- Do not add test files unless explicitly asked.
- Do not add comments that restate what the code does.
- Do not suggest migrating away from Spree, Next.js, or Tailwind.
- Do not suggest adding new dependencies without checking if the functionality already exists in the project.
- Do not generate placeholder or lorem ipsum content in production code.
- Do not modify `apps/storefront/src/lib/spree/` without understanding the auth cookie pattern first.

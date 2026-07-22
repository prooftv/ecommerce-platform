# 18 — Package Guidelines

**Purpose:** Rules and boundaries for every package in `packages/`. Prevents packages from accumulating unrelated responsibilities.
**Scope:** `packages/` directory only.
**Dependencies:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)
**Related:** [02_MASTER_PROMPT.md](./02_MASTER_PROMPT.md)
**Update rules:** Update when a package's scope changes. Record the reason in [08_DECISIONS.md](./08_DECISIONS.md).

---

## Package map

```
packages/
├── ui/           UI components only
├── types/        TypeScript types only — zero runtime code
├── api-client/   API call functions — no React, no UI
├── auth/         Auth logic — no UI, no API-specific code
├── config/       Shared tooling config — no runtime code
└── utils/        Framework-agnostic helpers (future)
```

---

## `packages/ui`

**Contains:** React components, Tailwind styles, CVA variants.

**Rules:**
- UI components only. No business logic.
- No direct API calls. Accept data via props.
- No auth imports. No `packages/auth` dependency.
- No `packages/api-client` dependency.
- May import from `packages/types` for prop types.
- Components must work in both `apps/storefront` and `apps/operations`.
- Use CVA (`class-variance-authority`) for variant-based components.
- Use Tailwind utility classes only — no inline styles, no CSS modules.

**Structure:**
```
packages/ui/src/
├── components/
│   ├── base/        Button, Card, Badge, Input, Separator, Skeleton
│   └── dashboard/   MetricCard, PageHeader, StatusBadge, EmptyState, AppSidebar
└── index.ts         re-exports everything
```

**What does NOT belong here:**
- Server Actions
- `fetch()` calls
- Auth token handling
- Business logic (price formatting, order state machines)

---

## `packages/types`

**Contains:** TypeScript `type` and `interface` declarations only.

**Rules:**
- Zero runtime code. No functions, no classes, no constants.
- No imports from other packages (except other `packages/types` files).
- No `import type` from third-party packages unless re-exporting their types.
- Every type must be exported from `src/index.ts`.
- Types are grouped by domain: `sanity.ts`, `spree.ts`, `laravel.ts`, `operations.ts`.

**Structure:**
```
packages/types/src/
├── sanity.ts       All Sanity document and response types
├── spree.ts        Spree API response primitives
├── laravel.ts      Laravel API contracts (Phase 1)
├── operations.ts   Operations dashboard types
└── index.ts        re-exports all
```

**What does NOT belong here:**
- Runtime validation (use zod in the consuming package)
- Default values
- Helper functions
- Enums with runtime values (use `as const` objects in the consuming package)

---

## `packages/api-client`

**Contains:** Functions that call external APIs (Spree, Laravel, Sanity).

**Rules:**
- No React imports. No JSX. No hooks.
- No UI components.
- No auth cookie reading — accept tokens as parameters or rely on `packages/auth` helpers.
- No business logic — transform data minimally, return typed responses.
- Every function must be async and return a typed result.
- Group by API domain: `spree/`, `laravel/`, `sanity/`.
- May import from `packages/types`.

**Structure:**
```
packages/api-client/src/
├── spree/
│   ├── products.ts
│   ├── orders.ts
│   └── customers.ts
├── laravel/
│   ├── fetch.ts       base fetch wrapper with auth header
│   ├── auth.ts
│   ├── dashboard.ts
│   ├── reports.ts
│   └── notifications.ts
└── sanity/
    ├── client.ts
    ├── pages.ts
    ├── blog.ts
    ├── settings.ts
    └── faq.ts
```

**What does NOT belong here:**
- React components
- Next.js Server Actions (those live in `apps/*/src/lib/data/`)
- Cookie management (that lives in `packages/auth`)
- UI state

---

## `packages/auth`

**Contains:** Authentication logic — session management, token storage, route guards.

**Rules:**
- No UI components. No JSX.
- No direct API calls to specific providers — use `packages/api-client` for the actual HTTP call.
- Cookie helpers are the only place that reads/writes auth cookies.
- The provider (Laravel, Auth0, etc.) is an implementation detail of `session.ts` only.
- `guard.ts` functions redirect on failure — they never throw.
- Cookie namespace `ops_*` is reserved for operations auth. Never use `spree_*` prefix (that belongs to `apps/storefront/src/lib/spree/`).

**Structure:**
```
packages/auth/src/
├── cookies.ts    httpOnly cookie read/write (ops_access_token, ops_refresh_token)
├── session.ts    login(), logout(), getSession(), refreshSession() — provider here
├── guard.ts      requireSession(), requireRole() — server-side redirects
└── index.ts      re-exports public API
```

**What does NOT belong here:**
- Spree customer auth (that lives in `apps/storefront/src/lib/spree/`)
- UI components (login form lives in `apps/operations/src/components/auth/`)
- Business logic beyond auth

**Provider swap rule:** To change the auth provider, update `session.ts` only. `cookies.ts` and `guard.ts` must not change.

---

## `packages/config`

**Contains:** Shared tooling configuration files.

**Rules:**
- No runtime code. Configuration files only.
- Exports: `./typescript` (tsconfig base), `./biome` (biome config base), `./site` (site URL helpers).
- `site.ts` is the one exception — it contains `getSiteUrl()` which is a pure function with no side effects.

**Structure:**
```
packages/config/
├── typescript.json    base tsconfig
├── biome.json         base biome config
└── site.ts            getSiteUrl(), defaultCountry, defaultLocale
```

**What does NOT belong here:**
- Component code
- API calls
- Business logic

---

## `packages/utils` (future)

**Contains:** Framework-agnostic utility functions.

**Rules:**
- No React imports.
- No Next.js imports.
- No API calls.
- Pure functions only — same input always produces same output.
- No side effects.

**Examples of what belongs here:**
- `formatCurrency(amount, currency, locale)`
- `slugify(string)`
- `truncate(string, maxLength)`
- `groupBy(array, key)`

**What does NOT belong here:**
- Anything that imports React, Next.js, or a specific API client

---

## Dependency rules (enforced by convention)

```
packages/ui          → packages/types ✅
packages/ui          → packages/api-client ❌
packages/ui          → packages/auth ❌

packages/api-client  → packages/types ✅
packages/api-client  → packages/ui ❌
packages/api-client  → packages/auth ❌ (accept tokens as params instead)

packages/auth        → packages/types ✅
packages/auth        → packages/api-client ✅ (for HTTP calls only)
packages/auth        → packages/ui ❌

packages/config      → (nothing) ✅
packages/types       → (nothing) ✅
packages/utils       → (nothing) ✅
```

---

## Adding a new package

Before creating a new package, ask:

1. Is this code used by more than one app? If no — put it in the app.
2. Does it fit cleanly into an existing package? If yes — add it there.
3. Does it cross a boundary defined above? If yes — split it.

If a new package is justified, add an ADR to `08_DECISIONS.md` explaining why.

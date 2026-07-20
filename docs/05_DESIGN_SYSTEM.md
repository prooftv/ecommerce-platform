# 05 — Design System

**Purpose:** Design tokens, component library, and styling conventions.
**Scope:** `packages/ui`, `apps/storefront`, `apps/operations`.
**Dependencies:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)
**Related:** [03_DEVELOPMENT_GUIDE.md](./03_DEVELOPMENT_GUIDE.md)
**Update rules:** Update when tokens, components, or conventions change. Component additions go to `packages/ui` first.

---

## Stack

| Tool | Role |
|---|---|
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui | Component primitives |
| `packages/ui` | Shared custom components |
| `components.json` | shadcn/ui config (per app) |

---

## Token locations

```
apps/storefront/src/app/globals.css   # CSS custom properties
apps/storefront/tailwind.config.ts    # Tailwind theme extension
```

When `packages/ui` is active, tokens will move to:
```
packages/config/tailwind.config.base.ts
```

---

## Component hierarchy

```
shadcn/ui primitives (never modified directly)
  │
  ▼
packages/ui (custom components built on shadcn/ui)
  │
  ▼
apps/storefront/src/components (page-specific compositions)
apps/operations/src/components (dashboard-specific compositions)
```

Never copy a component from one app to another. Move it to `packages/ui` instead.

---

## Shared components (packages/ui — Phase 4+)

Planned:

| Component | Used by |
|---|---|
| Button | storefront, operations |
| Card | storefront, operations |
| DataTable | operations |
| Sidebar | operations |
| Modal / Dialog | storefront, operations |
| Charts | operations |
| EmptyState | storefront, operations |
| LoadingSpinner | storefront, operations |

---

## Current storefront components

```
apps/storefront/src/components/
├── layout/       # Header, Footer, CountrySwitcher
├── products/     # ProductCard, ProductGrid, Filters
└── search/       # SearchBar
```

See the storefront `src/components/` directory for the full list.

---

## Conventions

- Mobile-first. All layouts start at `sm:` and scale up.
- Use Tailwind utility classes. No inline styles.
- Use CSS custom properties for brand tokens (colours, fonts).
- shadcn/ui components are installed per-app via `npx shadcn add`.
- Never override shadcn/ui internals — extend via `className` props.

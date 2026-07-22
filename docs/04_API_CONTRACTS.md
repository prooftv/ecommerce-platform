# 04 — API Contracts

**Purpose:** Canonical map of every API endpoint, its owner, and which apps consume it.
**Scope:** All APIs consumed by `ecommerce-platform`.
**Dependencies:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md)
**Related:** [12_INTEGRATIONS.md](./12_INTEGRATIONS.md) | [03_DEVELOPMENT_GUIDE.md](./03_DEVELOPMENT_GUIDE.md)
**Update rules:** Add a row when a new endpoint is integrated. Never document implementation details here — link to the server action file instead.

---

## Base URLs

| API | Base URL | Auth |
|---|---|---|
| Spree Storefront | `https://spree-rpvb.onrender.com/api/v2/storefront` | `X-Spree-Token` header (publishable key) |
| Spree Admin | `https://spree-rpvb.onrender.com/api/v2/platform` | Bearer token |
| Laravel | TBD (Mzo) | Bearer token |
| Sanity | `https://[projectId].api.sanity.io/v[date]/data/query/[dataset]` | GROQ, public CDN |

---

## Spree Storefront API

| Endpoint | Method | Consumer | Server action |
|---|---|---|---|
| `/store` | GET | storefront | `src/lib/data/store.ts` |
| `/products` | GET | storefront | `src/lib/data/products.ts` |
| `/products/:slug` | GET | storefront | `src/lib/data/products.ts` |
| `/taxons` | GET | storefront | `src/lib/data/taxonomies.ts` |
| `/taxonomies` | GET | storefront | `src/lib/data/taxonomies.ts` |
| `/cart` | GET/POST/PATCH/DELETE | storefront | `src/lib/data/cart.ts` |
| `/cart/add_item` | POST | storefront | `src/lib/data/cart.ts` |
| `/checkout` | PATCH | storefront | `src/lib/data/cart.ts` |
| `/account` | GET/PATCH | storefront | `src/lib/data/customer.ts` |
| `/account/addresses` | GET/POST/PATCH/DELETE | storefront | `src/lib/data/addresses.ts` |
| `/account/credit_cards` | GET/DELETE | storefront | `src/lib/data/credit-cards.ts` |
| `/orders` | GET | storefront | `src/lib/data/orders.ts` |
| `/countries` | GET | storefront | `src/lib/data/countries.ts` |
| `/pages` | GET | storefront | `src/lib/data/policies.ts` |

---

## Laravel API

**Base URL:** `NEXT_PUBLIC_LARAVEL_API_URL/api/v1`
**Auth:** Bearer token (issued by Laravel, stored in httpOnly cookie)
**Client:** `packages/api-client/src/laravel/client.ts`
**Types:** `packages/types/src/laravel.ts`

### Auth

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/auth/login` | POST | Issue access + refresh tokens |
| `/api/v1/auth/refresh` | POST | Rotate access token |
| `/api/v1/auth/logout` | POST | Revoke token |

### Dashboard

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/dashboard/summary` | GET | Aggregated KPIs for operations dashboard |

### Reporting

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/reports/orders` | GET | Order counts and revenue by date range |
| `/api/v1/reports/revenue` | GET | Gross / refunds / net by date range |

### Notifications

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/notifications` | GET | Paginated notification list |
| `/api/v1/notifications/:id/read` | PATCH | Mark notification as read |

**Status:** Stub — endpoint paths and response shapes are agreed. Implementation pending (Mzo).
**Response envelope:** See `LaravelSuccessResponse<T>` and `LaravelPaginatedResponse<T>` in `packages/types/src/laravel.ts`.

---

## Sanity

| Content type | Consumer |
|---|---|
| Homepage | `apps/storefront` |
| Announcement bar | `apps/storefront` |
| Navigation menus | `apps/storefront` |
| Blog posts | `apps/storefront` |
| FAQs | `apps/storefront` |
| CMS pages | `apps/storefront` |
| Landing pages | `apps/storefront` |
| Site settings | `apps/storefront` |
| Team members | `apps/storefront` |
| Testimonials | `apps/storefront` |
| Redirects | `apps/storefront` (build-time, `next.config.ts`) |

All GROQ queries: `apps/storefront/src/lib/sanity/queries.ts`
Canonical query reference: `docs/15_GROQ_QUERIES.md`
Schema definitions: `docs/06_SANITY_MODEL.md`

---

## Authentication flow (Spree)

```
1. POST /oauth/token  →  access_token + refresh_token
2. Store both in httpOnly cookies (src/lib/spree/cookies.ts)
3. All subsequent requests use withAuthRefresh() wrapper
4. Token refresh is automatic — never manual
```

No auth token is ever accessible to client-side JavaScript.

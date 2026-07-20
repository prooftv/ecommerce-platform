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

To be documented when Mzo publishes the API spec.
All Laravel endpoints will be consumed via `packages/api-client/src/laravel.ts`.

---

## Sanity

| Content type | GROQ query location | Consumer |
|---|---|---|
| Homepage | `sanity/queries/homepage.ts` | `apps/storefront` |
| Hero banners | `sanity/queries/hero.ts` | `apps/storefront` |
| Blog posts | `sanity/queries/blog.ts` | `apps/storefront` |
| FAQs | `sanity/queries/faqs.ts` | `apps/storefront` |
| Marketing pages | `sanity/queries/pages.ts` | `apps/storefront` |

See [06_SANITY_MODEL.md](./06_SANITY_MODEL.md) for schema definitions.

---

## Authentication flow (Spree)

```
1. POST /oauth/token  →  access_token + refresh_token
2. Store both in httpOnly cookies (src/lib/spree/cookies.ts)
3. All subsequent requests use withAuthRefresh() wrapper
4. Token refresh is automatic — never manual
```

No auth token is ever accessible to client-side JavaScript.

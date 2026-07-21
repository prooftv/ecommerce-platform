# 07 — Routes

**Purpose:** Complete URL structure and page inventory for all apps.
**Scope:** `apps/storefront`, `apps/operations`.
**Dependencies:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md) | [04_API_CONTRACTS.md](./04_API_CONTRACTS.md)
**Related:** [06_SANITY_MODEL.md](./06_SANITY_MODEL.md)
**Update rules:** Update when a new page is added or a route changes.

---

## Storefront routes

All routes are prefixed with `[country]/[locale]` (e.g. `/za/en/`, `/us/en/`).

| Route | Page | Data source |
|---|---|---|
| `/[country]/[locale]` | Homepage | Sanity (Phase 3) |
| `/[country]/[locale]/products` | Product listing | Spree |
| `/[country]/[locale]/products/[slug]` | Product detail | Spree |
| `/[country]/[locale]/t/[...permalink]` | Taxon / category | Spree |
| `/[country]/[locale]/taxonomies` | Category overview | Spree |
| `/[country]/[locale]/cart` | Shopping cart | Spree |
| `/[country]/[locale]/checkout` | One-page checkout | Spree + Laravel (PayFast) |
| `/[country]/[locale]/account` | Account overview | Spree |
| `/[country]/[locale]/account/orders` | Order history | Spree |
| `/[country]/[locale]/account/orders/[id]` | Order detail | Spree |
| `/[country]/[locale]/account/addresses` | Address book | Spree |
| `/[country]/[locale]/account/credit-cards` | Saved payment methods | Spree |
| `/[country]/[locale]/account/profile` | Profile settings | Spree |
| `/[country]/[locale]/account/register` | Registration | Spree |
| `/[country]/[locale]/policies` | Store policies | Spree CMS |
| `/[country]/[locale]/blog` | Blog listing | Sanity (Phase 3) |
| `/[country]/[locale]/blog/[slug]` | Blog post | Sanity (Phase 3) |
| `/[country]/[locale]/faq` | FAQs | Sanity (Phase 3) |
| `/[country]/[locale]/about` | About page | Sanity (Phase 3) |

### API routes (storefront)

| Route | Purpose |
|---|---|
| `/api/webhooks/spree` | Spree webhook receiver (transactional emails) |

---

## Operations Dashboard routes (Phase 5)

| Route | Page |
|---|---|
| `/` | Dashboard overview |
| `/orders` | Order management |
| `/orders/[id]` | Order detail |
| `/products` | Product management |
| `/customers` | Customer list |
| `/customers/[id]` | Customer detail |
| `/reports` | Sales reports |
| `/content` | Sanity content management links |
| `/settings` | Store settings |

---

## Multi-region

The storefront uses URL segments for market switching:

```
/za/en/   →  South Africa, English
/us/en/   →  United States, English
/uk/en/   →  United Kingdom, English
/de/de/   →  Germany, German
```

Default country: `za` (configurable via `NEXT_PUBLIC_DEFAULT_COUNTRY`).
Default locale: `en` (configurable via `NEXT_PUBLIC_DEFAULT_LOCALE`).

Markets are managed in Spree Admin → Configuration → Markets.

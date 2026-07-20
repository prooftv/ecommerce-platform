# 06 — Sanity Content Model

**Purpose:** Sanity schema definitions, content ownership, and integration pattern.
**Scope:** `sanity/` directory and `apps/storefront` Sanity integration.
**Dependencies:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md) | [04_API_CONTRACTS.md](./04_API_CONTRACTS.md)
**Related:** [07_ROUTES.md](./07_ROUTES.md) | [12_INTEGRATIONS.md](./12_INTEGRATIONS.md)
**Update rules:** Update when schemas change. Schema changes require a migration plan if content already exists in production.

---

## What Sanity owns

Sanity manages all marketing and editorial content. It does not touch commerce data.

| Content type | Replaces | Spree equivalent |
|---|---|---|
| Homepage | Static JSX | None |
| Hero banners | Hardcoded images | None |
| Landing pages | Static pages | None |
| Blog | None | None |
| FAQs | None | Spree CMS pages (partial) |
| About / Brand pages | Static JSX | None |
| Promotions / Campaigns | Hardcoded banners | None |

---

## Studio location

```
sanity/                    # Sanity Studio (standalone)
├── sanity.config.ts
├── schemaTypes/
│   ├── homepage.ts
│   ├── hero.ts
│   ├── page.ts
│   ├── blogPost.ts
│   ├── faq.ts
│   └── index.ts
└── package.json
```

The Studio is deployed separately (Sanity-hosted or Vercel).

---

## Planned schemas

### homepage
```ts
{
  _type: 'homepage',
  hero: { image, heading, subheading, cta },
  featuredCategories: [{ title, slug, image }],
  promotionalBanner: { text, link, backgroundColor },
  featuredProducts: [{ spreeProductSlug }]  // slug only — product data from Spree
}
```

### blogPost
```ts
{
  _type: 'blogPost',
  title, slug, publishedAt,
  author: { name, image },
  body: PortableText,
  seo: { title, description, ogImage }
}
```

### faq
```ts
{
  _type: 'faq',
  question, answer: PortableText,
  category, order
}
```

### page (generic marketing page)
```ts
{
  _type: 'page',
  title, slug,
  body: PortableText,
  seo: { title, description, ogImage }
}
```

---

## Integration pattern in storefront

```ts
// apps/storefront/src/lib/data/sanity.ts
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
})

export async function getHomepage() {
  return client.fetch(`*[_type == "homepage"][0]`)
}
```

All Sanity fetches are server-side. The Sanity token is never exposed to the browser.

---

## Environment variables

```env
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_TOKEN=          # server-side only, read-only token
NEXT_PUBLIC_SANITY_PROJECT_ID=   # safe to expose — used for image URLs
NEXT_PUBLIC_SANITY_DATASET=production
```

Add these to Vercel environment variables when Sanity is integrated (Phase 3).

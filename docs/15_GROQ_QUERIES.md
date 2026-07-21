# 15 — GROQ Query Reference

**Purpose:** Canonical GROQ queries for every Sanity content type used in the platform.
**Scope:** `apps/storefront`. Operations Dashboard will extend this when Sanity reads are added.
**Dependencies:** [06_SANITY_MODEL.md](./06_SANITY_MODEL.md)
**Related:** [04_API_CONTRACTS.md](./04_API_CONTRACTS.md) | [02_SYSTEM_BOUNDARIES.md](./02_SYSTEM_BOUNDARIES.md)
**Update rules:** When a schema changes, update the query here first, then update `src/lib/sanity/queries.ts`. These two files must stay in sync.

---

## How to use this document

Test queries in **Sanity Vision** (`/studio` → Vision tab) before touching any code.

1. Open `/studio` in your browser
2. Select the Vision tab
3. Paste the query, set perspective to `Published`
4. Confirm the JSON shape matches the TypeScript type
5. Copy into `src/lib/sanity/queries.ts`

---

## Homepage

**Type:** `homepage` (singleton — `_id == "homepage"`)
**Cache:** 60s, tag `homepage`
**Used in:** `src/app/[country]/[locale]/(storefront)/page.tsx`

```groq
*[_type == "homepage" && _id == "homepage"][0]{
  _id,
  hero {
    heading, subheading,
    cta { label, href },
    secondaryCta { label, href },
    image { ..., asset->{ _id, url }, alt },
    overlayOpacity
  },
  featuredCategories[] {
    label, spreeSlug,
    image { ..., asset->{ _id, url }, alt }
  },
  promotionalBanner { enabled, text, href, backgroundColor, textColor },
  seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
}
```

---

## Announcement Bar

**Type:** `announcementBar`
**Cache:** 60s, tag `announcementBar`
**Used in:** `src/app/[country]/[locale]/(storefront)/layout.tsx`

Returns the most recently updated active bar within its scheduled window.

```groq
*[_type == "announcementBar" && active == true
  && (startsAt == null || startsAt <= $now)
  && (endsAt == null || endsAt >= $now)
] | order(_updatedAt desc) [0]
```

**Parameters:** `$now` — current ISO timestamp

---

## Navigation Menu

**Type:** `navigationMenu`
**Cache:** 300s, tag `navigation`
**Used in:** `src/components/layout/Header.tsx`

Fetch by `identifier`. Current identifiers: `"header"`, `"footer"`.

```groq
*[_type == "navigationMenu" && identifier == $identifier][0]{
  _id, identifier,
  items[] { label, href, children[] { label, href } }
}
```

**Parameters:** `$identifier` — e.g. `"header"`

---

## Blog Index

**Type:** `blogPost`
**Cache:** 60s, tag `blog`
**Used in:** `src/app/[country]/[locale]/(storefront)/blog/page.tsx`

```groq
*[_type == "blogPost"] | order(publishedAt desc) [0...$limit] {
  _id, title, slug, publishedAt, excerpt, categories,
  author { name, image { ..., asset->{ _id, url }, alt } },
  coverImage { ..., asset->{ _id, url }, alt },
  seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
}
```

**Parameters:** `$limit` — default `10`

---

## Blog Post (detail)

**Type:** `blogPost`
**Cache:** 60s, tag `blog:{slug}`
**Used in:** `src/app/[country]/[locale]/(storefront)/blog/[slug]/page.tsx`

```groq
*[_type == "blogPost" && slug.current == $slug][0]{
  _id, title, slug, publishedAt, excerpt, categories, body,
  author { name, image { ..., asset->{ _id, url }, alt } },
  coverImage { ..., asset->{ _id, url }, alt },
  seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
}
```

**Parameters:** `$slug` — post slug string

---

## FAQs

**Type:** `faq`
**Cache:** 300s, tag `faqs`
**Used in:** FAQ page (backlog)

All FAQs, or filtered by category.

```groq
// All
*[_type == "faq"] | order(category asc, order asc) {
  _id, question, answer, category, order
}

// By category
*[_type == "faq" && category == $category] | order(order asc) {
  _id, question, answer, category, order
}
```

**Parameters:** `$category` — optional category string

---

## CMS Page

**Type:** `page`
**Cache:** 300s, tag `page:{slug}`
**Used in:** `src/app/[country]/[locale]/(storefront)/pages/[slug]/page.tsx`

```groq
*[_type == "page" && slug.current == $slug][0]{
  _id, title, slug, body,
  seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
}
```

**Parameters:** `$slug` — page slug string

---

## Landing Page

**Type:** `landingPage`
**Cache:** 60s, tag `landingPage:{slug}`
**Used in:** `src/app/[country]/[locale]/(storefront)/lp/[slug]/page.tsx`

```groq
*[_type == "landingPage" && slug.current == $slug][0]{
  _id, title, slug, sections,
  seo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex }
}
```

**Parameters:** `$slug` — landing page slug string

---

## Site Settings

**Type:** `siteSettings` (singleton — `_id == "siteSettings"`)
**Cache:** 300s, tag `siteSettings`
**Used in:** `src/app/[country]/[locale]/(storefront)/layout.tsx`

```groq
*[_type == "siteSettings" && _id == "siteSettings"][0]{
  _id, storeName, storeTagline, footerCopyright,
  contactEmail, contactPhone, address,
  logo { ..., asset->{ _id, url }, alt },
  logoDark { ..., asset->{ _id, url }, alt },
  favicon { ..., asset->{ _id, url } },
  socialLinks[] { platform, url },
  defaultSeo { title, description, ogImage { ..., asset->{ _id, url }, alt }, noIndex },
  schemaOrg { legalName, foundingYear, url }
}
```

---

## Team Members

**Type:** `teamMember`
**Cache:** 300s, tag `team`
**Used in:** About page (backlog)

```groq
*[_type == "teamMember"] | order(order asc) {
  _id, name, role, bio, order,
  photo { ..., asset->{ _id, url }, alt },
  socialLinks[] { platform, url }
}
```

---

## Testimonials

**Type:** `testimonial`
**Cache:** 300s, tag `testimonials`
**Used in:** Homepage, About page (backlog)

```groq
// All
*[_type == "testimonial"] | order(order asc) {
  _id, quote, authorName, authorTitle, rating, featured, order,
  authorPhoto { ..., asset->{ _id, url }, alt }
}

// Featured only
*[_type == "testimonial" && featured == true] | order(order asc) {
  _id, quote, authorName, authorTitle, rating, featured, order,
  authorPhoto { ..., asset->{ _id, url }, alt }
}
```

---

## Redirects

**Type:** `redirect`
**Cache:** 60s, tag `redirects`
**Used in:** `apps/storefront/next.config.ts` (build-time redirect generation)

```groq
*[_type == "redirect"] {
  _id, source, destination, permanent
}
```

---

## Cache tag reference

| Tag | Invalidated by |
|---|---|
| `homepage` | Editing the homepage document in Studio |
| `announcementBar` | Editing any announcement bar |
| `navigation` | Editing any navigation menu |
| `blog` | Publishing or editing any blog post |
| `blog:{slug}` | Editing the specific post at that slug |
| `faqs` | Editing any FAQ |
| `page:{slug}` | Editing the specific CMS page |
| `landingPage:{slug}` | Editing the specific landing page |
| `siteSettings` | Editing site settings |
| `team` | Editing any team member |
| `testimonials` | Editing any testimonial |
| `redirects` | Editing any redirect rule |

To manually invalidate from a Server Action: `revalidateTag("homepage")` etc.

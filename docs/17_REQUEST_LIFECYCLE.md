# 17 — Request Lifecycle

**Purpose:** How every major request flows through the platform. Use this for onboarding and debugging.
**Scope:** Both repositories.
**Dependencies:** [01_ARCHITECTURE.md](./01_ARCHITECTURE.md) | [02_SYSTEM_BOUNDARIES.md](./02_SYSTEM_BOUNDARIES.md)
**Related:** [04_API_CONTRACTS.md](./04_API_CONTRACTS.md)
**Update rules:** Add a new flow when a new integration is wired. Never remove a flow without an ADR.

---

## Homepage

```
Browser requests /za/en/
        │
        ▼
Next.js Middleware
  └── resolves country + locale from URL segment
  └── redirects bare / to /za/en/
        │
        ▼
Next.js Server Component (app/[country]/[locale]/page.tsx)
        │
        ├── getSiteSettings()     → Sanity CDN   (header, footer, SEO)
        ├── getHomepage()         → Sanity CDN   (hero, sections, announcements)
        └── getProducts()         → Spree API    (featured products)
        │
        ▼
React renders merged output
        │
        ▼
Browser receives HTML + hydration payload
  └── no API keys in payload
  └── no tokens in payload
```

---

## Product listing / search

```
Browser requests /za/en/products?q=shirt&taxon=tops
        │
        ▼
Next.js Server Component
        │
        ├── getProducts({ q, taxon, page })  → Spree API (Meilisearch-backed)
        └── getProductFilters()              → Spree API
        │
        ▼
React renders product grid + filter sidebar
        │
        ▼
Filter change (client interaction)
        │
        ▼
URL updated (useRouter / next-intl)
        │
        ▼
Server Component re-renders with new params
  └── no client-side API call
  └── no exposed API key
```

---

## Product detail

```
Browser requests /za/en/products/[slug]
        │
        ▼
Next.js Server Component
        │
        ├── getProduct(slug)   → Spree API  (variants, media, pricing)
        └── getProduct(slug)   → Sanity     (enriched description, extra media — if wired)
        │
        ▼
React renders PDP
  └── variant selection is client-side state only
  └── add-to-cart calls Server Action
```

---

## Add to cart

```
User clicks "Add to cart"
        │
        ▼
Client component calls addToCart() Server Action
        │
        ▼
Server Action (src/lib/data/cart.ts)
        │
        ▼
@spree/sdk → Spree API
  POST /api/v2/storefront/cart/add_item
  Authorization: Bearer <cart_token from httpOnly cookie>
        │
        ▼
Spree returns updated cart
        │
        ▼
Server Action revalidates cart cache tag
        │
        ▼
CartContext refreshes in browser
  └── cart token never visible to browser JS
```

---

## Checkout

```
User proceeds to checkout
        │
        ▼
Next.js Server Component (checkout/[id]/page.tsx)
        │
        ├── getCheckoutOrder(id)     → Spree API  (order state, requirements)
        ├── getMarketCountries()     → Spree API  (shipping countries)
        └── getAddresses()           → Spree API  (saved addresses, authenticated only)
        │
        ▼
CheckoutPageContent (client component)
  └── address, shipping, payment sections
        │
        ▼
User submits payment
        │
        ▼
PaymentSection → createCheckoutPaymentSession() Server Action
        │
        ▼
Spree API → Stripe Payment Session
  └── Stripe client secret returned to browser (safe — publishable only)
        │
        ▼
Stripe Elements confirms payment in browser
        │
        ▼
completeCheckoutOrder() Server Action
        │
        ▼
Spree API marks order complete
        │
        ▼
Spree fires webhook → /api/webhooks/spree
        │
        ▼
Webhook handler sends order confirmation email via Resend
```

---

## Order webhook → transactional email

```
Spree Backend
  POST /api/webhooks/spree
  X-Spree-Hmac-Sha256: <signature>
        │
        ▼
Next.js API Route (app/api/webhooks/spree/route.ts)
        │
        ├── verifyWebhookSignature()   (HMAC-SHA256, SPREE_WEBHOOK_SECRET)
        └── route to handler by event type
        │
        ├── order.completed    → OrderConfirmationEmail  → Resend
        ├── order.canceled     → OrderCanceledEmail      → Resend
        ├── order.shipped      → ShipmentShippedEmail    → Resend
        └── customer.password_reset_requested → PasswordResetEmail → Resend
        │
        ▼
Resend delivers email to customer
  └── dev mode: writes HTML to .next/emails/ instead
```

---

## Sanity content page

```
Browser requests /za/en/pages/about-us
        │
        ▼
Next.js Server Component (app/[country]/[locale]/pages/[slug]/page.tsx)
        │
        └── getPage(slug, isDraftMode)  → Sanity CDN (published)
                                        → Sanity Live API (draft mode only)
        │
        ▼
PortableText renders rich content
        │
        ▼
isDraftMode = true (editor with preview secret)
        │
        ▼
PreviewBanner shown
  └── "Exit preview" link → /api/draft/disable
```

---

## Sanity preview mode

```
Editor clicks "Open preview" in Sanity Studio
        │
        ▼
GET /api/draft/enable?secret=<SANITY_PREVIEW_SECRET>&slug=/za/en/pages/about-us
        │
        ▼
Next.js API Route validates secret (server-side only, never NEXT_PUBLIC_)
        │
        ▼
draftMode().enable() sets __prerender_bypass cookie
        │
        ▼
Redirect to slug
        │
        ▼
Server Component sees draftMode().isEnabled = true
        │
        ▼
draftClient used (perspective: previewDrafts, no CDN)
  └── unpublished draft content visible
  └── published site unaffected
```

---

## Operations dashboard — login

```
Staff navigates to ops.yourdomain.com/login
        │
        ▼
Next.js Server Component renders LoginForm
        │
        ▼
Staff submits credentials
        │
        ▼
loginAction() Server Action (packages/auth/src/session.ts)
        │
        ▼
POST /api/v1/auth/login → Laravel API
        │
        ▼
Laravel returns { access_token, refresh_token, user }
        │
        ▼
Tokens stored in httpOnly cookies
  ops_access_token   (short-lived JWT)
  ops_refresh_token  (long-lived)
  └── never visible to browser JS
        │
        ▼
Redirect to /  (dashboard overview)
```

---

## Operations dashboard — authenticated request

```
Staff views /orders
        │
        ▼
Next.js Server Component
        │
        ▼
requireSession() (packages/auth/src/guard.ts)
  └── reads ops_access_token from httpOnly cookie
  └── checks JWT expiry
  └── if expired: calls refreshSession() → POST /api/v1/auth/refresh
  └── if unauthenticated: redirect to /login
        │
        ▼
getOrders() (packages/api-client/src/laravel/orders.ts)
  GET /api/v1/orders
  Authorization: Bearer <access_token>
        │
        ▼
Laravel returns paginated orders
        │
        ▼
React renders orders table
  └── no token in browser
  └── no direct API call from browser
```

---

## Token refresh

```
Server Action detects access_token expired
        │
        ▼
refreshSession() (packages/auth/src/session.ts)
        │
        ▼
POST /api/v1/auth/refresh
  Authorization: Bearer <refresh_token from httpOnly cookie>
        │
        ▼
Laravel returns new access_token
        │
        ▼
New token written to httpOnly cookie
        │
        ▼
Original request retried with new token
  └── transparent to the user
  └── if refresh also fails: redirect to /login
```

---

## Cache invalidation

```
Product updated in Spree Admin
        │
        ▼
(Future) Spree webhook → /api/webhooks/spree
        │
        ▼
revalidateTag("products")
        │
        ▼
Next.js purges cached product pages
        │
        ▼
Next request re-fetches from Spree API

Content updated in Sanity Studio
        │
        ▼
Sanity webhook → /api/revalidate (to be wired)
        │
        ▼
revalidateTag("sanity:<document-id>")
        │
        ▼
Next.js purges cached content pages
```

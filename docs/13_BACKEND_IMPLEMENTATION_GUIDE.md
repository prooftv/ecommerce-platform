# 13 — Backend Implementation Guide

**Purpose:** Guide for the backend developer (Mzo). Covers architectural philosophy, domain ownership, frontend expectations, API standards, and implementation sequence.
**Scope:** Spree backend + Laravel business platform.
**Dependencies:** [PLATFORM_BLUEPRINT.md](../PLATFORM_BLUEPRINT.md) | [02_SYSTEM_BOUNDARIES.md](./02_SYSTEM_BOUNDARIES.md)
**Related:** [04_API_CONTRACTS.md](./04_API_CONTRACTS.md) | [11_DEPLOYMENT.md](./11_DEPLOYMENT.md)
**Update rules:** Update when API standards, response formats, or implementation sequence change. Copy this document into the Laravel repository so both repos stay aligned.

---

## Read this first

This guide exists because the frontend and backend are built in parallel by different developers. Without a shared reference, both sides make assumptions that conflict at integration time.

Before writing any Laravel code, read:
1. `PLATFORM_BLUEPRINT.md` — the platform constitution
2. `docs/02_SYSTEM_BOUNDARIES.md` — what Laravel owns and what it does not
3. This document

---

## Architectural philosophy

### Laravel is the business platform, not a second commerce engine

Laravel does not replicate what Spree does. It orchestrates around Spree.

```
Spree  ──▶  products, orders, checkout, customers
Laravel ──▶  workflows, reporting, integrations, marketplace
```

If a feature is about transactional commerce, it belongs in Spree.
If a feature is about business operations, it belongs in Laravel.

### The frontend defines the data shape

The frontend team defines what data it needs and in what shape. Laravel builds to that specification. This is the agreed contract model for this project.

This means:
- Do not design API responses based on your database schema
- Design API responses based on what the frontend documents in `docs/04_API_CONTRACTS.md`
- If the frontend needs a field that requires joining three tables, that is a backend concern — the frontend receives a clean, flat response

### Design for marketplace evolution from day one

Even though Phase 1 is single-vendor, the data model must support multi-vendor without a migration.

Practical rules:
- Every resource that will eventually be vendor-scoped should carry a `vendor_id` field from day one, even if it is always `1` in Phase 1
- Use `merchant` or `vendor` terminology in your domain model, not `store` or `owner`
- Build the vendor domain as a first-class concept in Laravel's database, even if the UI for it comes in Phase 2

---

## API standards

These standards are non-negotiable. The frontend is built against them.

### Base URL structure

```
https://[laravel-domain]/api/v1/[resource]
```

Version from day one. Breaking changes increment the version, not the resource name.

### Response envelope

All responses use a consistent envelope:

```json
{
  "data": { },
  "meta": { },
  "errors": [ ]
}
```

- `data` — the requested resource or collection
- `meta` — pagination, totals, timestamps
- `errors` — only present on failure, never present on success

### Collection response

```json
{
  "data": [
    { "id": "1", "type": "order", "attributes": { } }
  ],
  "meta": {
    "total_count": 142,
    "total_pages": 15,
    "current_page": 1,
    "per_page": 10
  }
}
```

### Error response

```json
{
  "data": null,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "field": "email",
      "message": "Email is already taken"
    }
  ]
}
```

HTTP status codes must be semantically correct:
- `200` — success
- `201` — created
- `400` — bad request / validation error
- `401` — unauthenticated
- `403` — unauthorised (authenticated but no permission)
- `404` — not found
- `422` — unprocessable entity
- `500` — server error

### Pagination

All collection endpoints must support:
```
GET /api/v1/orders?page=1&per_page=20&sort=created_at&direction=desc
```

Default `per_page`: 20. Maximum `per_page`: 100.

### Timestamps

All timestamps in ISO 8601 format:
```
"created_at": "2025-07-20T14:30:00Z"
```

Always UTC. Never local time.

### IDs

Use string IDs in responses, even if the database uses integers. This future-proofs against UUID migration.

---

## Authentication

### Operations Dashboard authentication

The Operations Dashboard requires staff authentication separate from Spree customer authentication.

**Recommended approach:** Laravel issues JWT tokens for staff users.

```
POST /api/v1/auth/login
Body: { "email": "staff@example.com", "password": "..." }
Response: { "data": { "access_token": "...", "refresh_token": "...", "expires_in": 3600 } }
```

The frontend stores these tokens in httpOnly cookies. Never return tokens in response bodies that the frontend stores in localStorage.

**Token refresh:**
```
POST /api/v1/auth/refresh
Body: { "refresh_token": "..." }
```

**Logout:**
```
POST /api/v1/auth/logout
```

### Spree integration

When Laravel needs to read Spree data (for reporting, workflows, etc.), use the Spree Platform API with an admin bearer token. This is a server-to-server call — the frontend is not involved.

---

## Laravel domain map

Implement in this sequence. Each phase unblocks the next frontend milestone.

### Phase 1 — Foundation (implement first)

| Domain | Endpoints needed | Frontend consumer |
|---|---|---|
| Auth | `/auth/login`, `/auth/refresh`, `/auth/logout` | Operations Dashboard |
| Dashboard overview | `/dashboard/summary` | Operations Dashboard |
| Reporting — orders | `/reports/orders` | Operations Dashboard |
| Reporting — revenue | `/reports/revenue` | Operations Dashboard |
| Notifications | `/notifications` | Operations Dashboard |

### Phase 2 — Workflows

| Domain | Endpoints needed | Frontend consumer |
|---|---|---|
| Workflows | `/workflows`, `/workflows/:id/execute` | Operations Dashboard |
| Audit log | `/audit-log` | Operations Dashboard |
| Integrations config | `/integrations` | Operations Dashboard |

### Phase 3 — Marketplace (Phase 2 of platform)

| Domain | Endpoints needed | Frontend consumer |
|---|---|---|
| Vendors | `/vendors`, `/vendors/:id` | Operations Dashboard, Storefront |
| Vendor approval | `/vendors/:id/approve`, `/vendors/:id/reject` | Operations Dashboard |
| Commission rules | `/commission/rules` | Operations Dashboard |
| Settlement | `/settlement/payouts` | Operations Dashboard |

---

## Spree integration points

Laravel reads from Spree for reporting and workflow purposes. Use the Spree Platform API.

| Data needed | Spree Platform API endpoint |
|---|---|
| Orders for reporting | `GET /api/v2/platform/orders` |
| Order details | `GET /api/v2/platform/orders/:number` |
| Customers | `GET /api/v2/platform/users` |
| Products | `GET /api/v2/platform/products` |
| Inventory | `GET /api/v2/platform/variants` |

Authentication: Bearer token from a Spree admin API key.

---

## Webhook events (Laravel → Storefront)

When Laravel needs to notify the storefront of business events, use webhooks.

Expected events (to be agreed):

| Event | Trigger | Storefront action |
|---|---|---|
| `order.workflow.updated` | Workflow status change | Refresh order status |
| `vendor.approved` *(Phase 2)* | Vendor approved | Enable vendor storefront |

Webhook payload format:
```json
{
  "event": "order.workflow.updated",
  "timestamp": "2025-07-20T14:30:00Z",
  "data": { }
}
```

Sign all webhooks with HMAC-SHA256. The frontend verifies the signature before processing.

---

## What the frontend will never do

So you know what not to build into the frontend:

- Calculate prices or apply discounts
- Validate inventory availability
- Implement business workflow logic
- Store business state in the browser
- Call Spree directly for anything that should go through Laravel

If you see the frontend doing any of these, it is a bug — raise it.

---

## Cross-repository coordination

When you need a new API endpoint that the frontend will consume:

1. Discuss the data shape with Bheki
2. Bheki documents it in `docs/04_API_CONTRACTS.md` in this repository
3. You implement it in Laravel
4. Both sides test against the contract

When you make a breaking change to an existing endpoint:

1. Increment the API version (`/api/v2/...`)
2. Keep the old version running until the frontend migrates
3. Notify Bheki before deploying

---

## Deployment

Laravel deployment details are Mzo's responsibility. Recommended: Render (same platform as Spree) or Railway.

The frontend needs one environment variable to connect:
```
LARAVEL_API_URL=https://[your-laravel-domain]/api/v1
```

This will be added to Vercel environment variables once the Laravel API is live.

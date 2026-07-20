# Documentation Index

This folder is the engineering handbook for the `ecommerce-platform` monorepo.
Read this file first. Every other document is linked below.

## How the two repositories relate

| Repository | Purpose | Deployed on |
|---|---|---|
| `spree/spree-starter` (fork) | Commerce engine, Admin, REST API | Render |
| `prooftv/ecommerce-platform` | Storefront, Operations Dashboard, shared packages | Vercel |

The Spree backend is owned primarily by Mzo. This monorepo is the frontend platform.

## Document map

| # | File | Source of truth for |
|---|---|---|
| — | `README.md` (this file) | Documentation index |
| 00 | [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md) | Project vision, owners, phases |
| 01 | [01_ARCHITECTURE.md](./01_ARCHITECTURE.md) | System design, repository structure, data ownership |
| 02 | [02_MASTER_PROMPT.md](./02_MASTER_PROMPT.md) | AI coding guardrails, engineering conventions |
| 03 | [03_DEVELOPMENT_GUIDE.md](./03_DEVELOPMENT_GUIDE.md) | Local setup, workflow, commands |
| 04 | [04_API_CONTRACTS.md](./04_API_CONTRACTS.md) | API endpoints, consumers, contracts |
| 05 | [05_DESIGN_SYSTEM.md](./05_DESIGN_SYSTEM.md) | Tokens, components, Tailwind config |
| 06 | [06_SANITY_MODEL.md](./06_SANITY_MODEL.md) | Sanity schemas, content ownership |
| 07 | [07_ROUTES.md](./07_ROUTES.md) | URL structure, page inventory |
| 08 | [08_DECISIONS.md](./08_DECISIONS.md) | Architecture Decision Records (ADRs) |
| 09 | [09_PROGRESS.md](./09_PROGRESS.md) | Sprint tracker, completed work |
| 10 | [10_BACKLOG.md](./10_BACKLOG.md) | Upcoming features, priorities |
| 11 | [11_DEPLOYMENT.md](./11_DEPLOYMENT.md) | Deployment pipeline, environment variables |
| 12 | [12_INTEGRATIONS.md](./12_INTEGRATIONS.md) | External services, credentials map |

## Conflict resolution

If two documents contradict each other:
1. `01_ARCHITECTURE.md` wins
2. `00_PROJECT_OVERVIEW.md` wins
3. Ask for clarification

## Update rules

- Never duplicate content. Cross-reference instead.
- Every document must stay consistent with `01_ARCHITECTURE.md`.
- Treat these files as production source code — review before committing.

# Taylor-Made Baby Academy Dashboard

Taylor-Made Baby Academy now lives inside the authenticated dashboard experience. Journeys, tracks, registry items, and community threads all share the same design system, authentication stub, and analytics hooks across the monorepo.

## Monorepo structure

```
apps/
  api/      # Express + Knex API (TypeScript)
  web/      # Next.js App Router dashboard (TailwindCSS)
db/
  migrations/  # Knex migrations
  seeds/       # Idempotent data seeds
packages/
  lib/      # Shared utilities (auth, analytics, affiliate, registry)
```

Legacy `frontend/` and `backend/` directories remain untouched for reference but are no longer part of the active build.

## Getting started

1. Install dependencies (uses pnpm workspaces):
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env` and provide PostgreSQL connection settings. The API expects either `DATABASE_URL` or individual `PG*` variables.
3. Run the database setup:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```
4. Start the dev servers:
   ```bash
   pnpm dev
   ```
   - API: http://localhost:4000
   - Web: http://localhost:3000 (Next.js, proxies API calls via direct fetches)

## NPM scripts

| Command          | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `pnpm dev`       | Run API (`apps/api`) and web (`apps/web`) in parallel    |
| `pnpm dev:api`   | Start Express API with live reload via `tsx`            |
| `pnpm dev:web`   | Start Next.js dashboard with App Router                 |
| `pnpm db:migrate`| Apply the latest Knex migrations                        |
| `pnpm db:seed`   | Seed journeys, modules, and affiliate product catalog   |
| `pnpm build`     | Build the Next.js dashboard for production              |

## Feature highlights

- **Academy Journeys & Tracks** – Nested dashboards surface progress rings, track cards, and module cards backed by Postgres schema from `db/migrations/20240701000000_create_academy_tables.ts`.
- **Module Experience** – `apps/web/app/dashboard/modules/[code]` renders explore copy, lecture carousel, journal prompt (local storage), apply checklist (persisted via `/api/progress/:moduleId/checklist`), registry recommendations, and community thread preview.
- **Registry** – Affiliate products seeded in `db/seeds/002_affiliate_products.ts` carry MacroBaby links with the Taylor affiliate tag. Users add items directly from modules; `/dashboard/registry` reflects live status.
- **Community** – `/dashboard/community` enables posting and commenting through the Express routes described in `apps/api/src/index.ts`.

## Environment variables

| Name            | Description                                 |
| --------------- | ------------------------------------------- |
| `DATABASE_URL`  | Full Postgres connection string (optional)  |
| `PGHOST`/`PGPORT`/`PGDATABASE`/`PGUSER`/`PGPASSWORD` | Individual Postgres settings when not using `DATABASE_URL` |
| `PORT`          | API port (default 4000)                     |
| `NEXT_PUBLIC_API_URL` | Base URL for API calls from the Next.js client (default `http://localhost:4000`) |

## Testing the happy path

1. `pnpm dev` → visit `http://localhost:3000/dashboard/modules/stroller-masterclass`
   - Explore, lecture carousel, journal prompt, and apply checklist are present.
   - Toggling an Apply item triggers `/api/progress/:moduleId/checklist` and persists state on refresh.
2. Registry suggestions include MacroBaby URLs with `?affid=taylorvanderwolk`. “Add to Registry” posts to `/api/registry/add`; the item appears on `/dashboard/registry`.
3. Community feed (`/dashboard/community`) accepts new posts and inline comments, leveraging `/api/community/posts` and `/api/community/:postId/comments`.
4. Dashboard rings on `/dashboard` aggregate progress across Nursery, Gear, and Postpartum journeys using the `/api/journeys` endpoint.

## Notes

- Authentication is stubbed via `packages/lib/auth.ts`, returning the demo user `user_demo`.
- Analytics events funnel through the no-op helper in `packages/lib/analytics.ts` for future instrumentation.
- Affiliate URLs are normalized with `packages/lib/affiliate.ts` to ensure every outbound link carries the correct Taylor affiliate parameter.
- Seeds are idempotent and rely on unique keys (`slug`, `code`, `brand` + `name`) so they can be rerun safely in development.

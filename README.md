# Taylor-Made Baby Co. · Phase 1 MVP

This repository now reflects the simplified Phase 1 architecture:

```
registry-taylor-restored/
├── apps/
│   ├── backend/      # Express + Prisma API (Node 20)
│   └── dashboard/    # Next.js 14 application
├── packages/
│   └── db/           # Shared Prisma helpers
├── scripts/          # Operational scripts (repair-db, sync-prisma, ...)
├── pnpm-workspace.yaml
├── prisma.config.ts
└── README.md
```

## Runtime baseline

- `.nvmrc` pins the toolchain to **Node 20**. Run `nvm use` (or configure your runtime) before installing dependencies.
- Every workspace (`package.json`, `apps/backend/package.json`, `apps/dashboard/package.json`) declares `"engines": { "node": ">=20.0.0" }`.
- The Heroku `Procfile` launches the backend using Node 20 with source map support.

## Apps

### apps/backend

- Express server with modular routing (`src/routes`), middleware, and Prisma client (`src/db`).
- `src/app.js` wires CORS, Helmet CSP, cookies, and all API routes.
- `src/server.js` boots the HTTP server and handles graceful shutdown.
- Role-based guards live in `src/middleware/auth.js`.

### apps/dashboard

- Next.js 14 application using the App Router.
- Pre-login marketing experience lives under `src/app/(marketing)` (`/, /how-it-works, /membership, /request-invite, /blog, /login, /thank-you`).
- Authenticated dashboards live under `src/app/dashboard` with dedicated routes for members, mentors, admins, learn, community, journal, and support.
- All authenticated routes are protected by `src/middleware.ts`, which checks JWT cookies (`token`) and the lightweight `tm_role` cookie set via `/api/session`.
- Shared libraries live in `src/lib` (`apiClient`, `auth`, `academy`, `community`, `support`, …) and new navigation components live in `src/components/navigation`.

### packages/db

Shared Prisma helpers (`prisma.ts` / `prisma.js`). Scripts such as `scripts/sync-prisma.sh` keep generated clients aligned across the workspace.

## Common scripts

```bash
pnpm install          # install dependencies
pnpm dev              # run backend + dashboard concurrently
pnpm run repair-db    # scripts/repair-db.sh (regenerates Prisma client, db push, seed)
pnpm lint             # apps/dashboard lint
pnpm build            # apps/dashboard build
```

> **Note:** `pnpm lint` / `pnpm build` require Node 20+. The current CI/dev shells must be upgraded before these commands can succeed.

## Authentication & roles

- Login happens via the marketing `/login` page, which calls the backend auth endpoint and then `/api/session` to persist the JWT + `tm_role`.
- `src/middleware.ts` & `src/lib/auth.ts` enforce role-based redirects:
  - Members → `/dashboard/member`
  - Mentors → `/dashboard/mentor`
  - Admins → `/dashboard/admin`
- Role-specific API routes live under `src/app/api/(mentor|admin|community|support)/...` and proxy to the backend with server-side session validation.

## Deployment checklist

1. `nvm use 20 && pnpm install`
2. `pnpm run sync:prisma` (optional helper script)
3. `pnpm lint` and `pnpm build` (Node 20+)
4. Deploy backend (`Procfile`) + dashboard (`next build && next start`)

With Phase 1 complete, the repo is trimmed to the required workspaces and ready for the future MyRegistry integration work.***

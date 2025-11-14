# Taylor‑Made Baby Co. Monorepo

Unified Next.js + Express workspace that powers the Taylor‑Made Baby Co. member dashboard, marketing site, and API. A single server (`server.js`) bootstraps both apps so local and production traffic always flows through one origin.

## Project Structure

| Path | Description |
| --- | --- |
| `apps/dashboard` | Next.js 14 app (marketing pages, member dashboard, API routes). |
| `apps/backend` | Express + Prisma API used for legacy and heavy routes. |
| `server.js` | Unified runtime: mounts the Express app under `/api/*` and hands everything else to Next.js. |
| `scripts/`, `packages/` | Helper scripts and shared packages. |

## Requirements

- Node.js 20.x (see `package.json#engines`)
- `pnpm` 10.18.x (`corepack enable && corepack prepare pnpm@10.18.3 --activate`)
- PostgreSQL (local or remote) for the backend

## Environment Configuration

Two env files live at the repo root:

- `.env` — committed production defaults. These point to `https://www.taylormadebabyco.com`.
- `.env.local` — developer overrides. Loaded automatically (with override) whenever present; keep the values at `http://localhost:5050`.

Key variables that **must** stay in sync with the host you are hitting:

| Variable | Local value | Production value |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:5050` | `https://www.taylormadebabyco.com` |
| `API_URL` | `http://localhost:5050` | `https://www.taylormadebabyco.com` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5050` | `https://www.taylormadebabyco.com` |
| `ALLOWED_ORIGINS` | `http://localhost:5050` | `https://www.taylormadebabyco.com,https://taylormadebabyco.com` |

> Always log in and browse using the same origin referenced by these variables; cookies and session headers are scoped to that domain.

## Local Development (Unified Server)

1. Install dependencies: `pnpm install`
2. Ensure `.env.local` exists (copy the checked-in version to start).
3. Run the unified server: `pnpm run dev:unified`
4. Visit `http://localhost:5050` for both the marketing/login flow and the member dashboard.

The unified runner keeps Next.js in dev mode (hot reload enabled) while piping `/api/*` traffic to the Express app. If you still need to run the apps separately for debugging, `pnpm dev` will start them on different ports (`3000` + `5050`), but auth cookies will only work when both sides share the `5050` origin.

## Production Deployment

1. Set the production env vars (`API_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `ALLOWED_ORIGINS`) to `https://www.taylormadebabyco.com` (and add the bare domain to `ALLOWED_ORIGINS`).
2. Build: `pnpm run build`
3. Launch: `pnpm start` (runs the pre-built Next.js app + Express API inside `server.js`).
4. When testing, always navigate/login on `https://www.taylormadebabyco.com` so session cookies stick.

## Useful Scripts

| Command | Purpose |
| --- | --- |
| `pnpm run dev:unified` | Runs `server.js` in dev mode (Next.js + Express on `http://localhost:5050`). |
| `pnpm run dev` | Runs Next (`3000`) and Express (`5050`) separately via `concurrently`. |
| `pnpm run build` | Generates the Next.js build and Prisma client before deployment. |
| `pnpm start` | Ensures a build exists and starts the unified production server. |
| `pnpm --filter tm-backend migrate` | Applies Prisma migrations to the configured database. |

For API smoke tests against production, run `pnpm --filter tm-backend exec node scripts/verify-api-routes.js` (it now targets `https://www.taylormadebabyco.com/api`).

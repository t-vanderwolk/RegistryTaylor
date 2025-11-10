# Taylor-Made Baby Co. MVP Backend

Express + Prisma + PostgreSQL stack that powers the Taylor-Made Baby Co. MVP. The service provides authenticated routes for members, mentors, and admins, plus seed data and migrations for the full concierge experience.

## Quick Start

```bash
# from repo root
cp .env.example .env             # or ensure .env matches the provided values

# install deps (run where you have registry access)
npm install --prefix apps/backend

# generate Prisma client & apply schema
pnpm prisma migrate dev --name baseline_mvp --schema=apps/backend/prisma/schema.prisma
pnpm prisma db seed --schema=apps/backend/prisma/schema.prisma

# run the API
pnpm --dir apps/backend run dev   # or npm run dev --prefix apps/backend
```

If the CLI cannot reach npm (offline sandbox), keep these commands and run them later in an environment with package access.

## Environment Variables

The backend reads from the repo-level `.env`. Minimum values:

| key | description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port for Express (`5050` default) |
| `JWT_SECRET` | Secret for signing member tokens |
| `NODE_ENV` | `development` by default |

## Project Structure

```
apps/backend/
├── prisma/
│   ├── schema.prisma            # data model + relations
│   └── migrations/
│       └── baseline_mvp/        # SQL migration for MVP schema
├── src/
│   ├── config.js                # loads env + shared config
│   ├── server.js                # Express entrypoint
│   ├── db/
│   │   ├── prismaClient.js      # singleton Prisma client
│   │   └── seed.js              # MVP seed data
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   └── routes/                  # REST endpoints
│       ├── auth.js
│       ├── profiles.js
│       ├── academy.js
│       ├── community.js
│       ├── blog.js
│       └── events.js
└── package.json
```

## Data Model Overview

Prisma models cover the MVP use cases:

- `User` (`MEMBER`, `MENTOR`, `ADMIN`) with auth credentials
- `Profile` (per-user concierge profile, optional mentor link)
- `Questionnaire` (member intake data)
- `AcademyModule`, `AcademyProgress`, `WorkbookEntry` for the learning experience
- `CommunityPost` for mentor/member announcements
- `Event` & `EventRsvp` for live sessions
- `BlogPost` for public marketing content

The generated migration (`baseline_mvp/migration.sql`) bootstraps enums, tables, and foreign keys.

## API Routes

All routes are mounted under `/api/*`:

| Route | Methods | Description |
| ----- | ------- | ----------- |
| `/api/auth` | `POST /register`, `POST /login`, `GET /me` | JWT auth |
| `/api/profiles` | `GET /me`, `PUT /me`, `GET /mentors` | Member & mentor profiles |
| `/api/academy` | `GET /modules`, `POST /progress` | Academy modules + progress |
| `/api/community` | `GET /posts`, `POST /posts` | Community posts |
| `/api/blog` | `GET /`, `GET /:slug` | Public blog |
| `/api/events` | `GET /upcoming`, `POST /rsvp` | Live event listings + RSVP |

All mutating routes require a valid `Authorization: Bearer <token>` header.

## Seeding

`pnpm prisma db seed --schema=apps/backend/prisma/schema.prisma` populates:

- Admin, mentor, and member users (`Karma` password)
- Linked profiles + intake questionnaire
- Academy modules, progress, and workbook entry
- Community welcome post, marketing blog posts, live event + RSVP

## Development Notes

- Prisma Client is cached in development to avoid exhausting database connections.
- The server exports a `/health` route and shuts down cleanly via `SIGINT`/`SIGTERM`.
- Update `apps/backend/package.json` if you prefer npm over pnpm; scripts use the local `./prisma/schema.prisma` path.
- Prisma Studio: `pnpm prisma studio --schema=apps/backend/prisma/schema.prisma`

You're ready to iterate on the Taylor-Made Baby Co. MVP backend 🎉

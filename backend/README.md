# Taylor-Made Baby Planning API

This Express + PostgreSQL service powers the invite-only concierge experience outlined in the product roadmap. The backend ships with structured data models, role-aware routes, and integration hooks for authentication, memberships, add-ons, blogs, mentors, consultations, and document storage.

## Quick Start

```bash
cd backend
npm install          # install deps (see notes below if network restricted)
cp .env.example .env # configure secrets
npx knex migrate:latest
npx knex seed:run
npm run dev
```

> **Offline installs** – if npm installs are blocked, keep the `package.json` edits and run the commands later on a machine with package access.

### Environment Variables

| key | description |
| --- | --- |
| `PORT` | API port (defaults to `5050`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `TEST_DATABASE_URL` | (optional) isolated database for test runner |
| `JWT_SECRET` | signing key for member/mentor/admin JWTs |
| `INVITE_SALT` | additional entropy for invite code hashing |
| `STRIPE_SECRET_KEY` | payments (Phase 1 checkout + future subscriptions) |
| `AWS_*` | document storage for NDAs and concierge plans |

## Project Structure

```
backend/
├── knexfile.js               # shared migration/seed config
├── src/
│   ├── app.js                # middleware + routing
│   ├── server.js             # bootstraps HTTP server
│   ├── controllers/          # feature controllers (auth, packages, add-ons, blog)
│   ├── routes/v1/            # versioned API routers
│   ├── db/                   # knex connection + migrations/seeds
│   ├── middleware/           # auth guards, error handlers
│   ├── utils/                # logger + token helper
│   └── services/             # reserved for future domain logic (mentors, consultations, etc.)
├── .env.example              # starter env template
├── .eslintrc.cjs / .prettierrc
└── package.json
```

## Data Model Overview

The initial migration (`src/db/migrations/202409161200_init.js`) creates all core tables:

| table | roadmap alignment |
| ----- | ----------------- |
| `users` | invite-only members, mentors, admins (role + invite state + NDA flag) |
| `invites` | store hashed invite codes, expiry, review status |
| `membership_packages` | Essentials / Signature / Bespoke with pricing + included services JSON |
| `add_ons` | concierge menu categorized by nursery/events/gear/lifestyle/postpartum |
| `blog_posts` | CMS-backed posts with member-only visibility toggle |
| `mentors` | mentor bios, specialties, availability, status pipeline |
| `consultations` | booking records and encrypted notes placeholder |
| `documents` | S3/Firebase references for NDAs + concierge deliverables |

Seed data (`src/db/seeds/001_base_seed.js`) primes one admin account, starter packages/add-ons, and a sample blog post.

## API Surface (v1)

| Method | Route | Description | Auth |
| ------ | ----- | ----------- | ---- |
| `POST` | `/api/v1/auth/invite` | Request invite code (stores hashed code + expiration) | Public |
| `POST` | `/api/v1/auth/register` | Claim invite, create member, issue JWT | Public (with invite) |
| `POST` | `/api/v1/auth/login` | Member/mentor/admin login | Public |
| `GET` | `/api/v1/packages` | List membership packages | Public |
| `POST` | `/api/v1/packages` | Create/update/delete packages | Admin |
| `GET` | `/api/v1/add-ons` | Filterable concierge add-ons | Public |
| `POST` | `/api/v1/add-ons` | Manage add-ons | Admin |
| `GET` | `/api/v1/blog` | Public posts (members receive member-only content when token supplied) | Optional JWT |
| `POST` | `/api/v1/blog` | Manage posts | Admin |

Mentor directory, consultation scheduling, and document management endpoints will sit under `/api/v1/mentors`, `/api/v1/consultations`, and `/api/v1/documents` in subsequent phases.

## Phase Alignment

### Phase 1 – Beta Launch
- ✅ Invite-only auth + hashed code storage (`invites` table, `auth.controller`)
- ✅ Membership packages + add-on menu CRUD
- ✅ Blog scaffolding with member-only visibility guard
- ☐ Stripe checkout integration – hook into `packages.controller` once pricing finalized
- ☐ NDA upload service – integrate AWS S3 using `documents` table

### Phase 2 – Community Layer
- Build mentor APIs (`mentors` table already seeded for relationship)
- Add member-to-mentor requests + approvals
- Lock blog `members_only` posts behind JWT (middleware shipped)
- Consultation scheduling endpoints + webhook integration (Calendly/Google)

### Phase 3 – Concierge Platform
- Encrypted chat service (consider WebSocket + customer-managed encryption keys)
- Workflow automation (nursery/event forms) stored alongside `documents`
- Stripe subscriptions + add-on purchase flow automation
- Analytics dashboards (Postgres views + BI tool or custom endpoints)

## Integration Hooks & TODOs

- **Payments:** Add a `payments` service that wraps Stripe Checkout sessions. Store receipts linked to `users` + `add_ons`.
- **File Storage:** Use AWS SDK or Firebase Admin SDK within a `documents.service.js` to generate signed upload URLs for NDAs.
- **CMS:** Replace direct `blog_posts` writes with a webhook sync from Sanity/Contentful or expose GraphQL for the CMS to push updates.
- **Scheduling:** Integrate Google Calendar / Calendly webhooks; persist events in `consultations` with encrypted notes using AWS KMS or libsodium.
- **Security:**
  - replace `notes_encrypted` placeholder with at-rest encryption utilities
  - enable audit logging middleware for admin actions (future `audit_logs` table)
  - configure rate limiting (e.g., `express-rate-limit`) before production

## Testing

Mocha + Supertest are configured in `package.json`. Add integration specs under `tests/` to cover auth flows and CRUD endpoints. Use `TEST_DATABASE_URL` and run migrations before tests.

```bash
NODE_ENV=test npx knex migrate:latest
NODE_ENV=test npm test
```

## Next Steps Checklist

- [ ] Connect to actual PostgreSQL instance and run migrations
- [ ] Wire up Stripe + AWS credentials
- [ ] Implement mentor + consultation controllers
- [ ] Add role-based policies for mentors (limit access to assigned members)
- [ ] Create CI workflow for linting/tests (GitHub Actions)

The backend is now aligned with the product roadmap and ready for future integrations as the concierge platform scales.

#!/usr/bin/env bash
set -e

echo "🌱 Taylor-Made Baby Co. Database Seed Helper"
echo "--------------------------------------------"

# detect environment
if [[ "$1" == "prod" || "$1" == "heroku" ]]; then
  echo "→ Target: Heroku production database"
  export DATABASE_URL="$(heroku config:get DATABASE_URL --app taylor-made)"
else
  echo "→ Target: Local PostgreSQL instance"
  export DATABASE_URL="postgresql://postgres:this_is_my_super_secret_password@localhost:5432/registry_taylor"
fi

echo ""
echo "🔗 Using DATABASE_URL: $DATABASE_URL"
echo ""

# generate prisma client
pnpm prisma generate

# apply schema migrations (try deploy, fallback to dev)
if pnpm prisma migrate deploy; then
  echo "✅ Migrations deployed successfully"
else
  echo "⚙️  Deploy failed, running dev migration instead..."
  pnpm prisma migrate dev --name "auto_seed_sync"
fi

# run seed
pnpm prisma db seed

echo ""
echo "✅ Seed complete for environment: ${1:-local}"


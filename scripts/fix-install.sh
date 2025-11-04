#!/bin/bash
set -e

echo "🧹 Cleaning corrupted Prisma & node_modules..."

# Ensure Node 20
if ! node -v | grep -q "v20"; then
  echo "⚙️ Switching to Node 20..."
  if command -v nvm >/dev/null 2>&1; then
    nvm install 20 && nvm use 20
  else
    echo "⚠️ nvm not found; please install Node 20 manually."
  fi
fi

# Delete problematic folders
find apps/backend/node_modules -type d -name ".prisma-*" -exec rm -rf {} + || true
rm -rf apps/backend/node_modules apps/backend/package-lock.json prisma/node_modules prisma/.prisma-*

# Clean npm cache
npm cache clean --force

# Reinstall & rebuild
echo "📦 Reinstalling backend dependencies..."
npm install --prefix apps/backend

echo "🔄 Regenerating Prisma client..."
pnpm prisma generate --schema=apps/backend/prisma/schema.prisma

echo "✅ Environment repaired and Prisma client rebuilt."

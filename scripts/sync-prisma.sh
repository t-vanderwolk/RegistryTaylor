#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

NODE_VERSION="$(node -v 2>/dev/null || true)"
if [[ -n "$NODE_VERSION" && "$NODE_VERSION" != v20* ]]; then
  echo "⚠️  Detected Node $NODE_VERSION. Prisma tooling requires Node 20.x in this workspace."
fi

echo "🔁 [Prisma Sync] Generating Prisma client from backend schema..."
pnpm prisma generate --schema apps/backend/prisma/schema.prisma

PNPM_CLIENT_DIR=""
RUNTIME_DIR=""
while IFS= read -r candidate; do
  candidate_runtime="$(dirname "$(dirname "$candidate")")/.prisma"
  if [[ -f "$candidate_runtime/client/default.js" ]]; then
    PNPM_CLIENT_DIR="$candidate"
    RUNTIME_DIR="$candidate_runtime"
    break
  fi
done < <(find "$ROOT_DIR/node_modules/.pnpm" -path '*@prisma+client@*/node_modules/@prisma/client' -type d -print 2>/dev/null || true)

if [[ -z "${PNPM_CLIENT_DIR:-}" ]]; then
  echo "❌ Unable to locate a generated @prisma/client inside pnpm virtual store."
  exit 1
fi

if [[ ! -d "$RUNTIME_DIR/client" ]]; then
  echo "❌ Prisma runtime missing at $RUNTIME_DIR."
  exit 1
fi

ln -snf "$PNPM_CLIENT_DIR" "$ROOT_DIR/node_modules/@prisma/client"
ln -snf "$RUNTIME_DIR" "$ROOT_DIR/node_modules/.prisma"

CLIENT_DIR="$PNPM_CLIENT_DIR"
echo "📦 [Prisma Sync] Using runtime from $RUNTIME_DIR"

link_runtime() {
  local workspace="$1"
  local node_modules_path="$ROOT_DIR/$workspace/node_modules"

  if [[ ! -d "$node_modules_path" ]]; then
    return
  fi

  local prisma_link="$node_modules_path/.prisma"
  if [[ -e "$prisma_link" && ! -L "$prisma_link" ]]; then
    rm -rf "$prisma_link"
  fi
  ln -snf "$RUNTIME_DIR" "$prisma_link"

  mkdir -p "$node_modules_path/@prisma"
  ln -snf "$CLIENT_DIR" "$node_modules_path/@prisma/client"

  local client_dir="$node_modules_path/@prisma/client"
  if [[ -d "$client_dir" ]]; then
    local client_link="$client_dir/.prisma"
    if [[ ! -e "$client_link" || -L "$client_link" ]]; then
      ln -snf "$RUNTIME_DIR" "$client_link"
    fi
  fi
}

for workspace in "." "apps/backend" "apps/dashboard" "packages/db"; do
  link_runtime "$workspace"
done

echo "✅ [Prisma Sync] Prisma client runtime linked for backend, dashboard, and shared packages."

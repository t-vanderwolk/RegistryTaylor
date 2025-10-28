#!/bin/bash
set -euo pipefail

BLUE="\033[34m"
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
RESET="\033[0m"

log_info() { printf "%b%s%b\n" "${BLUE}" "$1" "${RESET}"; }
log_success() { printf "%b%s%b\n" "${GREEN}" "$1" "${RESET}"; }
log_warn() { printf "%b%s%b\n" "${YELLOW}" "$1" "${RESET}"; }
log_error() { printf "%b%s%b\n" "${RED}" "$1" "${RESET}"; }

on_error() {
  log_error "❌ Database repair failed. Review the messages above for details."
}
trap on_error ERR

log_info "🩺 Starting Taylor-Made Baby Co. database repair..."

if ! command -v pg_isready >/dev/null 2>&1; then
  log_error "pg_isready command not found. Please ensure PostgreSQL client tools are installed."
  exit 1
fi

if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  log_warn "⚠️ PostgreSQL not running, attempting to start via Homebrew services..."
  if command -v brew >/dev/null 2>&1 && brew services start postgresql@14 >/dev/null 2>&1; then
    log_success "✅ PostgreSQL started with brew services."
  else
    log_warn "⚠️ Unable to start via brew services. Trying direct postgres launch..."
    if /opt/homebrew/opt/postgresql@14/bin/postgres -D /opt/homebrew/var/postgresql@14 >/tmp/postgres-repair.log 2>&1 & then
      sleep 3
      log_success "✅ PostgreSQL launch command issued (manual)."
    else
      log_error "Failed to start PostgreSQL manually. Check /tmp/postgres-repair.log and permissions for /opt/homebrew/var/postgresql@14."
      exit 1
    fi
  fi
else
  log_success "✅ PostgreSQL is already running."
fi

if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  log_error "PostgreSQL is still unavailable on localhost:5432. Please start it manually and rerun the repair."
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/apps/backend"

cd "${BACKEND_DIR}"

log_info "🧩 Regenerating Prisma client..."
npx prisma generate --schema prisma/schema.prisma
log_success "✅ Prisma client generated."

log_info "📘 Syncing database schema (accepting data loss)..."
npx prisma db push --accept-data-loss --schema prisma/schema.prisma
log_success "✅ Database schema is in sync."

log_info "🌱 Running seed script..."
npm run seed
log_success "✅ Seed script completed."

trap - ERR
log_success "✨ Repair complete — backend schema and seed verified."

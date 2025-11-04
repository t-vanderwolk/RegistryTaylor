/**
 * Prisma configuration file
 * Works with both Prisma 6.x and 7.x+
 */
import dotenv from "dotenv";

// ✅ Load environment variables early
dotenv.config();

// Try to import `defineConfig` if Prisma 7+ is available.
// (In Prisma 6, this module doesn’t exist — so we fall back gracefully.)
let defineConfig: ((config: any) => any) | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  defineConfig = require("@prisma/config").defineConfig;
} catch {
  defineConfig = undefined;
}

// Common configuration shared across versions
const baseConfig = {
  schema: "apps/backend/prisma/schema.prisma",
  // You can add more later if needed:
  // datasource: { url: process.env.DATABASE_URL },
};

// ✅ Export in whichever shape Prisma expects
export default defineConfig ? defineConfig(baseConfig) : baseConfig;
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "@prisma/config";

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here);

loadEnv({ path: path.resolve(rootDir, ".env") });
loadEnv({ path: path.resolve(rootDir, "prisma/.env") });
loadEnv({ path: path.resolve(rootDir, "../.env") });
loadEnv({ path: path.resolve(rootDir, "../../.env") });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  emit: {
    client: "./node_modules/@prisma/client",
  },
});

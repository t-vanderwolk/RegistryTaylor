import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

if (!process.env.DATABASE_URL) {
  const envCandidates = [
    ".env.local",
    ".env",
    "../.env",
    "../../.env",
    "../../apps/.env",
  ].map((relativePath) => path.resolve(process.cwd(), relativePath));

  for (const candidate of envCandidates) {
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate });
      if (process.env.DATABASE_URL) {
        break;
      }
    }
  }
}

declare global {
  // Prevents multiple client instances during hot reload
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;

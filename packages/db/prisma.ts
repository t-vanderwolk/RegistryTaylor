import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const resolveRootEnv = (startDir: string): string | undefined => {
  let current = startDir;
  const { root } = path.parse(current);
  let detected: string | undefined;

  while (true) {
    const candidate = path.join(current, ".env");
    if (fs.existsSync(candidate)) {
      detected = candidate;
    }

    if (current === root) {
      break;
    }

    current = path.dirname(current);
  }

  return detected;
};

const rootEnvPath = resolveRootEnv(process.cwd());
if (rootEnvPath) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
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

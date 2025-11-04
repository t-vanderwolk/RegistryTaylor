const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

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

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient({
    log: ["error"],
  });
}

const prisma = globalThis.prisma;

module.exports = prisma;
module.exports.prisma = prisma;

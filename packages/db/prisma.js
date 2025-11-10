const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const resolveRootEnv = (startDir) => {
  let current = startDir;
  const { root } = path.parse(current);
  let detected;

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

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient({
    log: ["error"],
  });
}

const prisma = globalThis.prisma;

module.exports = prisma;
module.exports.prisma = prisma;

const { PrismaClient } = require("@prisma/client");

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient({
    log: ["error"],
  });
}

const prisma = globalThis.prisma;

module.exports = prisma;
module.exports.prisma = prisma;

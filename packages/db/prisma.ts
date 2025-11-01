import { PrismaClient } from "@prisma/client";

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

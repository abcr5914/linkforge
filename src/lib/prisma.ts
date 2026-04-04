/**
 * Prisma Client Singleton
 *
 * Creates a single PrismaClient instance and reuses it across
 * hot-reloads in development. In production (serverless), each
 * cold start gets its own client—Prisma handles connection pooling.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

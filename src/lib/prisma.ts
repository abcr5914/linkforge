/**
 * Prisma Client Singleton
 *
 * Creates a single PrismaClient instance and reuses it across
 * hot-reloads in development. In production (serverless), each
 * cold start gets its own client.
 *
 * Uses `connect_timeout` and `pool_timeout` params to handle
 * Neon serverless cold starts which can take 3-5 seconds.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makePrismaClient() {
  // Neon serverless DBs go to sleep after inactivity.
  // The first connection can take 5+ seconds ("cold start").
  // Append connect_timeout to the DATABASE_URL so Prisma waits
  // instead of crashing with a connection error.
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const separator = databaseUrl.includes("?") ? "&" : "?";
  const urlWithTimeout = databaseUrl.includes("connect_timeout")
    ? databaseUrl
    : `${databaseUrl}${separator}connect_timeout=5&pool_timeout=5`;

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
    datasourceUrl: urlWithTimeout,
  });
}

export const prisma = globalForPrisma.prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

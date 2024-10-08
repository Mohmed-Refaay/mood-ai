import { PrismaClient } from "@prisma/client";

const globalAny: any = globalThis as any;

export const prisma: PrismaClient =
  globalAny.prisma || new PrismaClient({});

if (process.env.NODE_ENV === "development") {
  globalAny.prisma = prisma;
}

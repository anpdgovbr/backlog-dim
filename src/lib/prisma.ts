import { PrismaClient } from "@prisma/client"

/**
 * Instância singleton do PrismaClient para evitar múltiplas conexões durante o
 * hot-reload em desenvolvimento.
 *
 * Usage:
 * import { prisma } from '@/lib/prisma'
 * const user = await prisma.user.findFirst()
 */
const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

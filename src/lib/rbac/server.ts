import { createPrismaPermissionsProvider } from "@anpdgovbr/rbac-prisma"
import { withTTLCache, type IdentityResolver } from "@anpdgovbr/rbac-provider"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// TODO: Idealmente, use uma instância singleton do Prisma Client em todo o projeto.
// Usando a instância singleton de prisma importada de "@/lib/prisma"

// Define a type alias for the expected Prisma type for createPrismaPermissionsProvider
type PrismaPermissionsProviderPrisma = Parameters<
  typeof createPrismaPermissionsProvider
>[0]["prisma"]

// If PrismaClient is not directly assignable, create an adapter here.
// For now, assume PrismaClient is compatible. If not, uncomment and implement the adapter below.
// const prismaAdapter: PrismaPermissionsProviderPrisma = {
//   ...implement required methods by delegating to prisma...
// };

/**
 * Provider de permissões para o lado do servidor, com cache de 5 minutos.
 */
export const rbacProvider = withTTLCache(
  createPrismaPermissionsProvider({
    // converter via `unknown` primeiro para evitar erro TS2352 quando os tipos
    // do PrismaClient não se sobrepõem exatamente ao tipo esperado pela lib
    prisma: prisma as unknown as PrismaPermissionsProviderPrisma,
  }),
  5 * 60 * 1000 // 5 minutos
)

/**
 * Resolve a identidade do usuário logado a partir da sessão do NextAuth.
 */
export const getIdentity: IdentityResolver = {
  async resolve() {
    const session = await auth()
    if (!session?.user?.email) {
      // checkPermission irá lançar UnauthenticatedError se o email/id não for resolvido.
      return { id: "" }
    }
    return {
      id: session.user.id as string,
      email: session.user.email,
    }
  },
}

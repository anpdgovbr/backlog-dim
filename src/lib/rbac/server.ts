import { PrismaClient } from "@prisma/client"
import { createPrismaPermissionsProvider } from "@anpdgovbr/rbac-prisma"
import { withTTLCache, type IdentityResolver } from "@anpdgovbr/rbac-provider"
import { auth } from "@/auth"

// TODO: Idealmente, use uma instância singleton do Prisma Client em todo o projeto.
const prisma = new PrismaClient()

/**
 * Provider de permissões para o lado do servidor, com cache de 5 minutos.
 */
export const rbacProvider = withTTLCache(
  createPrismaPermissionsProvider({ prisma }),
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

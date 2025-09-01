import { getServerSession } from "next-auth/next"
import type { IdentityResolver } from "../../rbac/packages/rbac-provider/src"
import { withTTLCache } from "../../rbac/packages/rbac-provider/src"
import { createPrismaPermissionsProvider } from "../../rbac/packages/rbac-prisma/src"

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/config/next-auth.config"

/** Provider RBAC com cache TTL (60s) baseado em Prisma. */
export const rbacProvider = withTTLCache(
  createPrismaPermissionsProvider({ prisma }),
  60_000
)

/** IdentityResolver usando NextAuth (email como identidade). */
export const getIdentity: IdentityResolver<Request> = {
  async resolve(_req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error("Usuário não autenticado")
    }
    return { id: session.user.id ?? session.user.email, email: session.user.email }
  },
}

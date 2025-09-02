import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { pode as podeCore } from "@anpdgovbr/rbac-core"
import type { IdentityResolver } from "@anpdgovbr/rbac-provider"
import { withTTLCache } from "@anpdgovbr/rbac-provider"
import { createPrismaPermissionsProvider } from "@anpdgovbr/rbac-prisma"
import type { PrismaLike } from "@anpdgovbr/rbac-prisma"

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/config/next-auth.config"
import type { AcaoAuditoria, Prisma } from "@prisma/client"

/** Provider RBAC com cache TTL (60s) baseado em Prisma. */
export const rbacProvider = withTTLCache(
  // cast do prisma para PrismaLike para satisfazer a assinatura esperada pela lib
  createPrismaPermissionsProvider({ prisma: prisma as unknown as PrismaLike }),
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

/**
 * Helper server-side para checagem de permissão em pages/server components.
 * Faz resolve de identidade, obtém permissões e redireciona se não autorizado.
 * Retorna o objeto { identity, perms } quando autorizado.
 */
export async function ensurePermissionOrRedirect(
  req: Request,
  acao: string,
  recurso: string,
  redirectTo = "/acesso-negado"
) {
  try {
    const identity = await getIdentity.resolve(req)
    const email = identity.email ?? identity.id
    if (!email) return redirect(redirectTo)
    const perms = await rbacProvider.getPermissionsByIdentity(email)
    if (!podeCore(perms, acao, recurso)) return redirect(redirectTo)
    return { identity, perms }
  } catch {
    return redirect(redirectTo)
  }
}

/** Auditoria simples: grava em AuditLog quando fornecido via withApi */
export async function auditLog(args: {
  tabela?: string
  acao?: string
  userId?: string
  email?: string
  antes?: object
  depois?: object
  contexto?: string
}) {
  const acaoMap: Record<string, AcaoAuditoria> = {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    PATCH: "PATCH",
    GET: "GET",
  }
  await prisma.auditLog.create({
    data: {
      tabela: args.tabela ?? "Permissao",
      acao: acaoMap[args.acao ?? "PATCH"] ?? "PATCH",
      userId: args.userId,
      email: args.email,
      antes: args.antes as Prisma.InputJsonValue | undefined,
      depois: args.depois as Prisma.InputJsonValue | undefined,
      contexto: args.contexto,
    },
  })
}

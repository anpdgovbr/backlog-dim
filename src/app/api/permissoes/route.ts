// app/api/permissoes/route.ts
import { getIdentity, rbacProvider } from "@/rbac/server"

export const GET = async (req: Request) => {
  const identity = await getIdentity.resolve(req)
  const email = identity.email ?? identity.id
  const perms = await rbacProvider.getPermissionsByIdentity(email)
  const list: Array<{ acao: string; recurso: string; permitido: boolean }> = []
  for (const [acao, recursos] of Object.entries(perms ?? {})) {
    for (const [recurso, permitido] of Object.entries(recursos ?? {})) {
      if (permitido) list.push({ acao, recurso, permitido: true })
    }
  }
  return Response.json(list)
}

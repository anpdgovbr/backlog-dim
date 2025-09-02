// app/api/perfis/route.ts
import { prisma } from "@/lib/prisma"
import { withApi } from "@anpdgovbr/rbac-next"
import { getIdentity, rbacProvider, auditLog } from "@/rbac/server"

/**
 * Lista perfis ativos.
 *
 * @remarks
 * Exige permissão `{acao: "Exibir", recurso: "Permissoes"}` pois expõe
 * metadados de perfis usados na administração de permissões.
 */
export const GET = withApi(
  async () => {
    const perfis = await prisma.perfil.findMany({
      where: { active: true },
    })

    return Response.json(perfis)
  },
  {
    permissao: { acao: "Exibir", recurso: "Permissoes" },
    provider: rbacProvider,
    getIdentity,
  }
)

// Cria um novo perfil
export const POST = withApi(
  async ({ req, email, userId }) => {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Body inválido" }, { status: 400 })
    }
    const { nome } = body as { nome?: string }
    if (!nome?.trim()) {
      return Response.json({ error: "'nome' obrigatório" }, { status: 400 })
    }
    const exists = await prisma.perfil.findUnique({ where: { nome } })
    if (exists) return Response.json({ error: "Perfil já existe" }, { status: 409 })
    const created = await prisma.perfil.create({
      data: { nome, active: true },
      select: { id: true, nome: true, active: true },
    })
    await auditLog({
      tabela: "Perfil",
      acao: "CREATE",
      userId,
      email,
      depois: created,
      contexto: req.url,
    })
    return Response.json(created, { status: 201 })
  },
  {
    provider: rbacProvider,
    getIdentity,
    permissao: { acao: "Cadastrar", recurso: "Permissoes" },
  }
)

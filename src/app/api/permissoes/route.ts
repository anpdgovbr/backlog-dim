// app/api/permissoes/route.ts
import { getIdentity, rbacProvider } from "@/rbac/server"
import { prisma } from "@/lib/prisma"
import { withApi } from "@anpdgovbr/rbac-next"
import { getPermissoesPorPerfil, type PrismaLike } from "@anpdgovbr/rbac-prisma"
import type { AcaoPermissao, RecursoPermissao } from "@prisma/client"

export const GET = withApi(
  async ({ req }: { req: Request }) => {
    const url = new URL(req.url)
    const perfilParam = url.searchParams.get("perfil")

    if (!perfilParam) {
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

    let perfilNome: string | null = null
    if (/^\d+$/.test(perfilParam)) {
      const byId = await prisma.perfil.findUnique({
        where: { id: Number(perfilParam) },
        select: { nome: true },
      })
      perfilNome = byId?.nome ?? null
    } else {
      perfilNome = perfilParam
    }
    if (!perfilNome)
      return Response.json({ error: "Perfil não encontrado" }, { status: 404 })

    const list = await getPermissoesPorPerfil(prisma as unknown as PrismaLike, perfilNome)
    return Response.json(list)
  },
  {
    provider: rbacProvider,
    getIdentity,
    permissao: { acao: "Exibir", recurso: "Permissoes" },
  }
)

// Cria explicitamente uma permissão (além do toggle)
export const POST = withApi(
  async ({ req }) => {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Body inválido" }, { status: 400 })
    }
    const { perfilId, perfilNome, acao, recurso, permitido } = body as {
      perfilId?: number
      perfilNome?: string
      acao?: string
      recurso?: string
      permitido?: boolean
    }
    if (
      !(perfilId || perfilNome) ||
      !acao ||
      !recurso ||
      typeof permitido !== "boolean"
    ) {
      return Response.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }
    let perfilIdResolved: number | null = null
    if (perfilId) perfilIdResolved = Number(perfilId)
    else if (perfilNome) {
      const p = await prisma.perfil.findUnique({
        where: { nome: perfilNome },
        select: { id: true },
      })
      perfilIdResolved = p?.id ?? null
    }
    if (!perfilIdResolved)
      return Response.json({ error: "Perfil não encontrado" }, { status: 404 })

    const saved = await prisma.permissao.upsert({
      where: {
        perfilId_acao_recurso: {
          perfilId: perfilIdResolved,
          acao: acao as AcaoPermissao,
          recurso: recurso as RecursoPermissao,
        },
      },
      update: { permitido: !!permitido },
      create: {
        perfilId: perfilIdResolved,
        acao: acao as AcaoPermissao,
        recurso: recurso as RecursoPermissao,
        permitido: !!permitido,
      },
      select: { id: true, permitido: true },
    })
    return Response.json(saved, { status: 201 })
  },
  {
    provider: rbacProvider,
    getIdentity,
    permissao: { acao: "Cadastrar", recurso: "Permissoes" },
  }
)

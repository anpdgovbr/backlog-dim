import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

// 🔹 GET — Apenas responsáveis ativos
export const GET = withApiSlimNoParams(async () => {
  const dados = await prisma.responsavel.findMany({
    where: { active: true },
    include: { user: true },
  })
  return Response.json(dados)
}, "Exibir_Responsavel")

// 🔹 POST — Criação com `active: true`
export const POST = withApi(
  async ({ req }) => {
    const data = await req.json()

    const novo = await prisma.responsavel.create({
      data: {
        ...data,
        active: true,
        exclusionDate: null,
      },
    })

    return {
      response: Response.json(novo, { status: 201 }),
      audit: {
        depois: novo,
      },
    }
  },
  {
    tabela: "responsavel",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Responsavel",
  }
)

// 🔹 PATCH — Atualiza vínculo com user
export const PATCH = withApi(
  async ({ req }) => {
    const { responsavelId, userId } = await req.json()

    if (typeof responsavelId !== "number") {
      return Response.json({ error: "ID do responsável inválido" }, { status: 400 })
    }

    const antes = await prisma.responsavel.findUnique({ where: { id: responsavelId } })

    if (!antes) {
      return Response.json({ error: "Responsável não encontrado" }, { status: 404 })
    }

    const depois = await prisma.responsavel.update({
      where: { id: responsavelId },
      data: { userId: userId ?? null },
    })

    return {
      response: Response.json(depois),
      audit: { antes, depois },
    }
  },
  {
    tabela: "responsavel",
    acao: AcaoAuditoria.UPDATE,
    permissao: "Cadastrar_Responsavel",
  }
)

// 🔹 DELETE — Soft delete com auditoria
export const DELETE = withApi(
  async ({ req }) => {
    const { id } = await req.json()

    const antes = await prisma.responsavel.findUnique({ where: { id } })

    if (!antes || !antes.active) {
      return Response.json(
        { error: "Responsável não encontrado ou já excluído" },
        { status: 404 }
      )
    }

    const depois = await prisma.responsavel.update({
      where: { id },
      data: {
        active: false,
        exclusionDate: new Date(),
      },
    })

    return {
      response: Response.json(
        { message: "Responsável desativado com sucesso" },
        { status: 200 }
      ),
      audit: { antes, depois },
    }
  },
  {
    tabela: "responsavel",
    acao: AcaoAuditoria.DELETE,
    permissao: "Desabilitar_Responsavel",
  }
)

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Lista responsáveis ativos.
 *
 * @see {@link withApiSlimNoParams}
 * @returns JSON com array de responsáveis (inclui relação `user`).
 * @example GET /api/responsaveis
 * @remarks Requer permissão {acao: "Exibir", recurso: "Responsavel"}.
 */
export const GET = withApiSlimNoParams(
  async () => {
    const dados = await prisma.responsavel.findMany({
      where: { active: true },
      include: { user: true },
    })
    return Response.json(dados)
  },
  { acao: "Exibir", recurso: "Responsavel" }
)

/**
 * Cria um responsável com `active: true`.
 *
 * @see {@link withApi}
 * @returns JSON com o registro criado (201).
 * @example
 * POST /api/responsaveis
 * { "nome": "Fulano", "userId": 123 }
 * @remarks Auditoria ({@link AcaoAuditoria.CREATE}) e permissão {acao: "Cadastrar", recurso: "Responsavel"}.
 */
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
    permissao: { acao: "Cadastrar", recurso: "Responsavel" },
  }
)

/**
 * Atualiza vínculo de responsável com um usuário (`userId`).
 *
 * @see {@link withApi}
 * @returns JSON com o registro atualizado.
 * @example
 * PATCH /api/responsaveis
 * { "responsavelId": 1, "userId": 2 }
 * @remarks Auditoria ({@link AcaoAuditoria.UPDATE}) e permissão {acao: "Cadastrar", recurso: "Responsavel"}.
 */
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
    permissao: { acao: "Cadastrar", recurso: "Responsavel" },
  }
)

/**
 * Desativa (soft delete) um responsável.
 *
 * @see {@link withApi}
 * @returns JSON com mensagem de sucesso.
 * @example
 * DELETE /api/responsaveis
 * { "id": 10 }
 * @remarks Auditoria ({@link AcaoAuditoria.DELETE}) e permissão {acao: "Desabilitar", recurso: "Responsavel"}.
 */
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
    permissao: { acao: "Desabilitar", recurso: "Responsavel" },
  }
)

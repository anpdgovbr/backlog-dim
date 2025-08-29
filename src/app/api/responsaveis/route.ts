import { AcaoAuditoria } from "@anpdgovbr/shared-types"
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Manipulador GET para responsáveis.
 *
 * Retorna todos os responsáveis ativos, incluindo dados do usuário vinculado.
 *
 * @returns Response JSON com lista de responsáveis ativos.
 */
export const GET = withApiSlimNoParams(async () => {
  const dados = await prisma.responsavel.findMany({
    where: { active: true },
    include: { user: true },
  })
  return Response.json(dados)
}, "Exibir_Responsavel")

/**
 * Manipulador POST para criação de responsável.
 *
 * Cria um novo responsável com status ativo e sem data de exclusão.
 *
 * @param req - Request HTTP contendo os dados do responsável.
 * @returns Response JSON com o responsável criado e dados para auditoria.
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
    permissao: "Cadastrar_Responsavel",
  }
)

/**
 * Manipulador PATCH para atualização de vínculo de usuário.
 *
 * Atualiza o campo userId do responsável informado.
 *
 * @param req - Request HTTP contendo responsavelId e userId.
 * @returns Response JSON com o responsável atualizado e dados para auditoria.
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
    permissao: "Cadastrar_Responsavel",
  }
)

/**
 * Manipulador DELETE para soft delete de responsável.
 *
 * Desativa o responsável (active: false) e registra data de exclusão.
 *
 * @param req - Request HTTP contendo o id do responsável.
 * @returns Response JSON com mensagem de sucesso e dados para auditoria.
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
    permissao: "Desabilitar_Responsavel",
  }
)

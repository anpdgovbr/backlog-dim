import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Lista situações ativas (metadados).
 *
 * @see {@link withApiSlimNoParams}
 * @returns JSON com array de situações ativas.
 * @example
 * GET /api/situacoes
 * @remarks Requer permissão {acao: "Exibir", recurso: "Metadados"}.
 */
export const GET = withApiSlimNoParams(
  async () => {
    const dados = await prisma.situacao.findMany({
      where: { active: true },
    })

    return Response.json(dados)
  },
  { acao: "Exibir", recurso: "Metadados" }
)

/**
 * Cria uma nova situação (metadado).
 *
 * @see {@link withApi}
 * @returns JSON com o registro criado (201) ou erro.
 * @example
 * POST /api/situacoes
 * { "nome": "Em análise" }
 * @remarks Registra auditoria ({@link AcaoAuditoria.CREATE}) e exige {acao: "Cadastrar", recurso: "Metadados"}.
 */
export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.situacao.create({
        data: {
          ...data,
          active: true,
          exclusionDate: null,
        },
      })

      return {
        response: Response.json(novoDado, { status: 201 }),
        audit: {
          depois: novoDado,
        },
      }
    } catch (error) {
      console.error("Erro ao criar situação:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "situacao",
    acao: AcaoAuditoria.CREATE,
    permissao: { acao: "Cadastrar", recurso: "Metadados" },
  }
)

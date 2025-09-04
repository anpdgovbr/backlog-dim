import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

/**
 * Lista formas de entrada ativas (metadados).
 *
 * @see {@link withApiSlimNoParams}
 * @returns JSON com array de formas de entrada ativas.
 * @example
 * GET /api/formaEntrada
 * @remarks Requer permissão {acao: "Exibir", recurso: "Metadados"}.
 */
export const GET = withApi(
  async () => {
    const dados = await prisma.formaEntrada.findMany({
      where: { active: true },
    })

    return Response.json(dados)
  },
  { permissao: { acao: "Exibir", recurso: "Metadados" } }
)

/**
 * Cria uma nova forma de entrada (metadado).
 *
 * @see {@link withApi}
 * @returns JSON com o registro criado e status 201.
 * @example
 * POST /api/formaEntrada
 * { "nome": "E-mail" }
 * @remarks Registra auditoria ({@link AcaoAuditoria.CREATE}) e exige {acao: "Cadastrar", recurso: "Metadados"}.
 */
export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.formaEntrada.create({
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
      console.error("Erro ao criar forma de entrada:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "formaEntrada",
    acao: AcaoAuditoria.CREATE,
    permissao: { acao: "Cadastrar", recurso: "Metadados" },
  }
)

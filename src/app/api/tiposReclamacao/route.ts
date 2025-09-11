import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

/**
 * Lista tipos de reclamação ativos (metadados).
 *
 * @see {@link withApi}
 * @returns JSON com array de tipos ativos.
 * @example GET /api/tiposReclamacao
 * @remarks Permissão {acao: "Exibir", recurso: "Metadados"}.
 */
export const GET = withApi(
  async () => {
    const dados = await prisma.tipoReclamacao.findMany({
      where: { active: true },
    })

    return Response.json(dados)
  },
  { permissao: { acao: "Exibir", recurso: "Metadados" } }
)

/**
 * Cria um novo tipo de reclamação.
 *
 * @see {@link withApi}
 * @returns JSON com o registro criado (201).
 * @example POST /api/tiposReclamacao { "nome": "Denúncia" }
 * @remarks Auditoria ({@link AcaoAuditoria.CREATE}) e permissão {acao: "Cadastrar", recurso: "Metadados"}.
 */
export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.tipoReclamacao.create({
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
      console.error("Erro ao criar tipo de reclamação:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "tiporeclamacao",
    acao: AcaoAuditoria.CREATE,
    permissao: { acao: "Cadastrar", recurso: "Metadados" },
  }
)

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

/**
 * Lista evidências ativas (metadados).
 *
 * @see {@link withApiSlimNoParams}
 * @returns JSON com array de evidências ativas.
 * @example GET /api/evidencias
 * @remarks Permissão {acao: "Exibir", recurso: "Metadados"}.
 */
export const GET = withApi(
  async () => {
    const dados = await prisma.evidencia.findMany({
      where: { active: true },
    })

    return Response.json(dados)
  },
  { permissao: { acao: "Exibir", recurso: "Metadados" } }
)

/**
 * Cria uma nova evidência (metadado).
 *
 * @see {@link withApi}
 * @returns JSON com o registro criado (201).
 * @example POST /api/evidencias { "nome": "Documento X" }
 * @remarks Auditoria ({@link AcaoAuditoria.CREATE}) e permissão {acao: "Cadastrar", recurso: "Metadados"}.
 */
export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.evidencia.create({
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
      console.error("Erro ao criar evidência:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "evidencia",
    acao: AcaoAuditoria.CREATE,
    permissao: { acao: "Cadastrar", recurso: "Metadados" },
  }
)

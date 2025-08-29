import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Lista contatos prévios ativos (metadados).
 *
 * @see {@link withApiSlimNoParams}
 * @returns JSON com array de contatos prévios.
 * @example GET /api/contatosPrevios
 * @remarks Permissão {acao: "Exibir", recurso: "Metadados"}.
 */
export const GET = withApiSlimNoParams(
  async () => {
    const dados = await prisma.contatoPrevio.findMany({
      where: { active: true },
    })

    return Response.json(dados)
  },
  { acao: "Exibir", recurso: "Metadados" }
)

/**
 * Cria um novo contato prévio (metadado).
 *
 * @see {@link withApi}
 * @returns JSON com o registro criado (201).
 * @example POST /api/contatosPrevios { "nome": "E-mail ao órgão" }
 * @remarks Auditoria ({@link AcaoAuditoria.CREATE}) e permissão {acao: "Cadastrar", recurso: "Metadados"}.
 */
export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.contatoPrevio.create({
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
      console.error("Erro ao criar contato prévio:", error)
      return Response.json({ error: "Erro interno no servidor" }, { status: 500 })
    }
  },
  {
    tabela: "contatoprevio",
    acao: AcaoAuditoria.CREATE,
    permissao: { acao: "Cadastrar", recurso: "Metadados" },
  }
)

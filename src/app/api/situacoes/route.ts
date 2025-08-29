import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * GET - Lista situações ativas (metadados).
 *
 * Retorna um Response JSON com todas as entradas da tabela `situacao` que
 * possuem `active: true`.
 *
 * Observações:
 * - Este handler é envolvido por `withApiSlimNoParams` e não espera corpo na requisição.
 * - Utilizado para obter metadados de situações para preenchimento de selects/listas.
 *
 * Retorno:
 * - Response JSON com um array de objetos do modelo `situacao`.
 */
export const GET = withApiSlimNoParams(async () => {
  const dados = await prisma.situacao.findMany({
    where: { active: true },
  })

  return Response.json(dados)
}, "Exibir_Metadados")

/**
 * POST - Cria uma nova situação (metadado).
 *
 * Descrição:
 * - Recebe no corpo da requisição um objeto com os campos do modelo `situacao`.
 * - Cria um novo registro definindo `active: true` e `exclusionDate: null`.
 *
 * Entrada:
 * - Body JSON com os campos do metadado `situacao`.
 *
 * Saída:
 * - Em sucesso: retorna Response JSON com o objeto criado e status 201.
 * - Em erro interno: retorna Response JSON com `{ error: "Erro interno do servidor" }` e status 500.
 *
 * Auditoria/Permissão:
 * - Gera informação para auditoria (`depois`).
 * - Requer a permissão `"Cadastrar_Metadados"`, ação de auditoria: AcaoAuditoria.CREATE.
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
    permissao: "Cadastrar_Metadados",
  }
)

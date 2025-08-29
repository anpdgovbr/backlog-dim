import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Manipulador para requisições GET na rota de encaminhamentos.
 *
 * @remarks
 * Retorna todos os registros ativos de encaminhamento do banco de dados.
 * Utiliza o Prisma para buscar os dados e retorna em formato JSON.
 *
 * @returns Response JSON com a lista de encaminhamentos ativos.
 */
export const GET = withApiSlimNoParams(async () => {
  const dados = await prisma.encaminhamento.findMany({
    where: { active: true },
  })

  return Response.json(dados)
}, "Exibir_Metadados")

/**
 * Manipulador para requisições POST na rota de encaminhamentos.
 *
 * @remarks
 * Cria um novo registro de encaminhamento no banco de dados.
 * Define o campo `active` como true e `exclusionDate` como null por padrão.
 * Realiza auditoria da ação conforme convenção do projeto.
 *
 * @param req - Objeto Request contendo o corpo da requisição com os dados do encaminhamento.
 * @returns Response JSON com o novo registro criado ou erro detalhado.
 */
export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.encaminhamento.create({
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
      console.error("Erro ao criar encaminhamento:", error)
      return Response.json({ error: "Erro interno no servidor" }, { status: 500 })
    }
  },
  {
    tabela: "encaminhamento",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Metadados",
  }
)

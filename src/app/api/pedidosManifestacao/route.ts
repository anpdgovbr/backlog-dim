import { AcaoAuditoria } from "@anpdgovbr/shared-types"
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Handler para requisições GET na rota de pedidos de manifestação.
 *
 * @remarks
 * Retorna todos os registros ativos de pedidos de manifestação.
 *
 * @returns Response JSON com os dados encontrados.
 */
export const GET = withApiSlimNoParams(async () => {
  const dados = await prisma.pedidoManifestacao.findMany({
    where: { active: true },
  })

  return Response.json(dados)
}, "Exibir_Metadados")

/**
 * Handler para requisições POST na rota de pedidos de manifestação.
 *
 * @remarks
 * Cria um novo registro de pedido de manifestação, marcando como ativo e sem data de exclusão.
 * Realiza auditoria da ação conforme convenção do projeto.
 *
 * @param req - Objeto Request contendo o corpo da requisição.
 * @returns Response JSON com o novo registro criado ou erro interno.
 */
export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.pedidoManifestacao.create({
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
      console.error("Erro ao criar pedido de manifestação:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "pedidomanifestacao",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Metadados",
  }
)

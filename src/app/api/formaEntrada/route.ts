import { AcaoAuditoria } from "@anpdgovbr/shared-types"
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Manipulador para requisições GET na rota de formas de entrada.
 *
 * @remarks
 * Retorna todos os registros ativos de forma de entrada do banco de dados.
 * Utiliza o Prisma para buscar os dados e retorna em formato JSON.
 *
 * @returns Response JSON com a lista de formas de entrada ativas.
 */
export const GET = withApiSlimNoParams(async () => {
  const dados = await prisma.formaEntrada.findMany({
    where: { active: true },
  })

  return Response.json(dados)
}, "Exibir_Metadados")

/**
 * Manipulador para requisições POST na rota de formas de entrada.
 *
 * @remarks
 * Cria um novo registro de forma de entrada no banco de dados.
 * Define o campo `active` como true e `exclusionDate` como null por padrão.
 * Realiza auditoria da ação conforme convenção do projeto.
 *
 * @param req - Objeto Request contendo o corpo da requisição com os dados da forma de entrada.
 * @returns Response JSON com o novo registro criado ou erro detalhado.
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
    permissao: "Cadastrar_Metadados",
  }
)

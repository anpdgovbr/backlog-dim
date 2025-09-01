import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

/**
 * Representa um responsável e a contagem de processos associada.
 *
 * @remarks
 * Tipo retornado pela API de "top responsáveis" contendo os dados essenciais
 * para exibição em relatórios ou dashboards.
 *
 * @property id - Identificador numérico do responsável.
 * @property nome - Nome do responsável.
 * @property userId - Identificador do usuário relacionado (pode ser null).
 * @property totalProcessos - Total de processos atribuídos a este responsável.
 */
interface ResponsavelProcessos {
  id: number
  nome: string
  userId: string | null
  totalProcessos: number
}

/**
 * Retorna os responsáveis com maior número de processos.
 *
 * Endpoint GET que agrega processos por `responsavelId`, busca os responsáveis
 * correspondentes e retorna uma lista contendo o total de processos por
 * responsável, ordenada do maior para o menor.
 *
 * @remarks
 * - O parâmetro de query `limit` define quantos itens retornar (padrão 5, máximo 100).
 * - O wrapper `withApi` aplica autenticação/permissões e tratamento padrão.
 *
 * @example
 * GET /api/relatorios/top-responsaveis?limit=10
 *
 * @returns Response JSON com um array de objetos do tipo ResponsavelProcessos.
 */
export const GET = withApi(async ({ req }) => {
  try {
    if (!req.url) {
      return new Response("URL inválida", { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get("limit")) || 5, 100)

    const agregados = await prisma.processo.groupBy({
      by: ["responsavelId"],
      where: {
        active: true,
      },
      _count: {
        responsavelId: true,
      },
      orderBy: {
        _count: {
          responsavelId: "desc",
        },
      },
      take: limit,
    })

    const ids = agregados
      .map((a) => a.responsavelId)
      .filter((id): id is number => Number.isFinite(id))

    if (ids.length === 0) return Response.json([])

    const responsaveis = await prisma.responsavel.findMany({
      where: {
        id: { in: ids },
        active: true, // garante que não retornaremos soft-deletados
      },
    })

    const resultados: ResponsavelProcessos[] = responsaveis.map((r) => {
      const count =
        agregados.find((a) => a.responsavelId === r.id)?._count?.responsavelId ?? 0

      return {
        id: r.id,
        nome: r.nome,
        userId: r.userId ?? null,
        totalProcessos: count,
      }
    })

    resultados.sort((a, b) => b.totalProcessos - a.totalProcessos)

    return Response.json(resultados)
  } catch (error) {
    console.error("Erro ao buscar responsáveis com mais processos:", error)
    return new Response("Erro interno ao processar requisição", { status: 500 })
  }
})

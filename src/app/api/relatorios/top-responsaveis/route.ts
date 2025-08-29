import { prisma } from "@/lib/prisma"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Interface que representa um responsável e o total de processos associados.
 */
interface ResponsavelProcessos {
  id: number
  nome: string
  userId: string | null
  totalProcessos: number
}

/**
 * Handler GET para o relatório dos "top responsáveis".
 *
 * Retorna uma lista dos responsáveis com maior número de processos ativos,
 * ordenados pelo total de processos, limitado pelo parâmetro `limit` (máx. 100).
 * Cada item contém o id, nome, userId e total de processos do responsável.
 *
 * @param req - Request HTTP recebida.
 * @returns Response JSON com os top responsáveis e total de processos por responsável.
 *
 * @example
 * GET /api/relatorios/top-responsaveis?limit=10
 * [
 *   { id: 123, nome: "João Silva", userId: "abc123", totalProcessos: 42 },
 *   { id: 456, nome: "Maria Souza", userId: null, totalProcessos: 37 }
 * ]
 */
export const GET = withApiSlimNoParams(async ({ req }) => {
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

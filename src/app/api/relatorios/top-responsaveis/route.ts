import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

interface ResponsavelProcessos {
  id: number
  nome: string
  userId: string | null
  totalProcessos: number
}

/**
 * Top responsáveis por número de processos.
 *
 * @remarks Migrado para `withApi` (antes `withApiSlimNoParams`).
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

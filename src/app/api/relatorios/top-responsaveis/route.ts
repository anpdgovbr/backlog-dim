import { prisma } from "@/lib/prisma"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

export const GET = withApiSlimNoParams(async ({ req }) => {
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
    .filter((id): id is number => typeof id === "number")

  const responsaveis = await prisma.responsavel.findMany({
    where: {
      id: { in: ids },
    },
  })

  const resultados = responsaveis.map((r) => {
    const processoCount = agregados.find((a) => a.responsavelId === r.id)?._count as {
      responsavelId: number
    }

    return {
      id: r.id,
      nome: r.nome,
      userId: r.userId ?? null,
      totalProcessos: processoCount.responsavelId ?? 0,
    }
  })

  resultados.sort((a, b) => b.totalProcessos - a.totalProcessos)

  return Response.json(resultados)
})

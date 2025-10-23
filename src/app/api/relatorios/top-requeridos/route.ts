import type { ControladorDto } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { getControladoresApiUrl, parseControladoresJson } from "@/lib/controladoresApi"
import { withApi } from "@/lib/withApi"

/**
 * GET - Retorna os "top requeridos" (controladores) ordenados pelo número de processos atribuídos.
 *
 * @remarks
 * Este endpoint agrega processos por `requeridoId` usando Prisma e, em seguida,
 * consulta a API externa de controladores (CONTROLADORES_API_URL) para obter os
 * dados do ControladorDto. O resultado é uma lista de objetos ControladorDto
 * estendidos com a propriedade `totalProcessos`.
 *
 * Query parameters:
 * - `limit` (opcional): número máximo de itens retornados. Padrão: 5. Máximo: 100.
 *
 * @param req - Objeto Request fornecido pelo wrapper `withApi`. A URL do request é
 *               usada para extrair os parâmetros de query.
 *
 * @returns Promise<Response> - Resposta JSON contendo um array de ControladorDto
 *                              com a propriedade adicional `totalProcessos`.
 *
 * @throws Retorna Response com status 500 quando a variável de ambiente
 *         CONTROLADORES_API_URL não está definida ou em caso de erro interno.
 *
 * @example
 * GET /api/relatorios/top-requeridos?limit=10
 */
export const GET = withApi(async ({ req }) => {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get("limit")) || 5, 100)

  const agregados = await prisma.processo.groupBy({
    by: ["requeridoId"],
    where: {
      active: true,
      requeridoId: { not: null },
    },
    _count: { requeridoId: true },
    orderBy: {
      _count: {
        requeridoId: "desc",
      },
    },
    take: limit,
  })

  const resultados = await Promise.all(
    agregados.map(async ({ requeridoId, _count }) => {
      try {
        if (requeridoId == null || requeridoId === '') return null
        const res = await fetch(
          getControladoresApiUrl(`/controlador/${String(requeridoId)}`)
        )

        if (!res.ok) throw new Error(`Erro ao buscar requerido ${requeridoId}`)
        const data = await parseControladoresJson<ControladorDto>(res)
        if (!data) throw new Error("Resposta vazia da API de Controladores")

        return {
          ...data,
          totalProcessos: _count.requeridoId,
        }
      } catch (error) {
        console.error(`Erro ao buscar requeridoId ${requeridoId}:`, error)
        return null
      }
    })
  )

  const filtrados = resultados.filter((r): r is NonNullable<typeof r> => !!r)

  return Response.json(filtrados)
})

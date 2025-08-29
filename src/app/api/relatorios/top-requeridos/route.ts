import fetch from "node-fetch"

import type { ControladorDto } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

// npm install node-fetch

/**
 * Handler GET para o relatório dos "top requeridos".
 *
 * Retorna uma lista dos controladores (requeridos) mais recorrentes em processos,
 * ordenados pelo número de processos associados, limitado pelo parâmetro `limit` (máx. 100).
 * Para cada requerido, busca detalhes via API externa definida em `CONTROLADORES_API_URL`.
 *
 * Resposta: Array de objetos `ControladorDto` estendidos com o campo `totalProcessos`.
 *
 * @param req - Request HTTP recebida.
 * @returns Response JSON com os top requeridos e total de processos por requerido.
 *
 * @example
 * GET /api/relatorios/top-requeridos?limit=10
 * [
 *   { id: 123, nome: "Empresa X", totalProcessos: 42, ... },
 *   { id: 456, nome: "Empresa Y", totalProcessos: 37, ... }
 * ]
 */
export const GET = withApiSlimNoParams(async ({ req }) => {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get("limit")) || 5, 100)

  const baseUrl = process.env.CONTROLADORES_API_URL
  if (!baseUrl) {
    console.error("❌ Variável de ambiente CONTROLADORES_API_URL não definida.")
    return Response.json({ error: "Configuração interna ausente" }, { status: 500 })
  }

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
        const res = await fetch(`${baseUrl}/controladores/${requeridoId}`)

        if (!res.ok) throw new Error(`Erro ao buscar requerido ${requeridoId}`)
        const data = (await res.json()) as ControladorDto

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

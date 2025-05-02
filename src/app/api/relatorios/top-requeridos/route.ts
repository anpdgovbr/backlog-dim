import { prisma } from "@/lib/prisma"
import { withApiSlimNoParams } from "@/lib/withApiSlim"
import type { ControladorDto } from "@anpd/shared-types"
import https from "https"
import fetch from "node-fetch"

// npm install node-fetch

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

  const isHttps = baseUrl.startsWith("https://")
  const httpsAgent = new https.Agent({ rejectUnauthorized: false })
  const resultados = await Promise.all(
    agregados.map(async ({ requeridoId, _count }) => {
      try {
        const res = await fetch(`${baseUrl}/controladores/${requeridoId}`, {
          ...(isHttps ? { agent: httpsAgent } : {}), // usa agent só se HTTPS
        })

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

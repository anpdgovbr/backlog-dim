// app/api/perfis/route.ts
import { prisma } from "@/lib/prisma"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Handler para requisições GET na rota de perfis.
 *
 * @remarks
 * Busca todos os perfis ativos no banco de dados.
 * Retorna um array de perfis no formato JSON.
 *
 * @returns Response JSON contendo os perfis ativos.
 */
export const GET = withApiSlimNoParams(async () => {
  const perfis = await prisma.perfil.findMany({
    where: { active: true },
  })

  return Response.json(perfis)
}, undefined) // <- sem permissão explícita

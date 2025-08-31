// app/api/perfis/route.ts
import { prisma } from "@/lib/prisma"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Lista perfis ativos.
 *
 * @remarks
 * Exige permissão `{acao: "Exibir", recurso: "Permissoes"}` pois expõe
 * metadados de perfis usados na administração de permissões.
 */
export const GET = withApiSlimNoParams(
  async () => {
    const perfis = await prisma.perfil.findMany({
      where: { active: true },
    })

    return Response.json(perfis)
  },
  { acao: "Exibir", recurso: "Permissoes" }
)

// app/api/perfis/route.ts
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

/**
 * Lista perfis ativos.
 *
 * @remarks
 * Exige permissão `{acao: "Exibir", recurso: "Permissoes"}` pois expõe
 * metadados de perfis usados na administração de permissões.
 */
export const GET = withApi(
  async () => {
    const perfis = await prisma.perfil.findMany({
      where: { active: true },
    })

    return Response.json(perfis)
  },
  { permissao: { acao: "Exibir", recurso: "Permissoes" } }
)

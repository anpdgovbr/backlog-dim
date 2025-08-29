import { prisma } from "@/lib/prisma"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Handler para requisições GET na rota de perfil.
 *
 * @remarks
 * Busca o usuário pelo e-mail e retorna os dados do perfil associado.
 * Retorna erro 404 se o perfil não for encontrado, ou 403 se estiver desativado.
 *
 * @param email - E-mail do usuário para busca.
 * @returns Response JSON com os dados do perfil ou erro.
 */
export const GET = withApiSlimNoParams(async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { perfil: true },
  })

  if (!user || !user.perfil) {
    return Response.json({ error: "Perfil não encontrado" }, { status: 404 })
  }

  if (!user.perfil.active) {
    return Response.json({ error: "Perfil desativado" }, { status: 403 })
  }

  return Response.json({
    id: user.perfil.id,
    nome: user.perfil.nome,
  })
}, undefined)

import { prisma } from "@/lib/prisma"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

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

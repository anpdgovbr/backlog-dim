// app/api/perfis/route.ts
import { prisma } from "@/lib/prisma"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

export const GET = withApiSlimNoParams(async () => {
  const perfis = await prisma.perfil.findMany({
    where: { active: true },
  })

  return Response.json(perfis)
}, undefined) // <- sem permissão explícita

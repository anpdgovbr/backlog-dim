// lib/helpers/mapaUserComResponsavel.ts
import { prisma } from "@/lib/prisma"

export async function mapearUsuariosComResponsaveis() {
  const usuarios = await prisma.user.findMany()

  const responsaveis = await prisma.responsavel.findMany({
    where: { userId: { not: null } },
    select: { id: true, nome: true, userId: true },
  })

  const mapaResponsaveis = Object.fromEntries(
    responsaveis.map((r) => [r.userId!, { id: r.id, nome: r.nome }])
  )

  return usuarios.map((u) => {
    const responsavel = mapaResponsaveis[u.id]

    return {
      id: u.id,
      nome: u.nome,
      email: u.email,
      perfilId: u.perfilId,
      responsavelId: responsavel?.id ?? null,
      responsavelNome: responsavel?.nome ?? null,
    }
  })
}

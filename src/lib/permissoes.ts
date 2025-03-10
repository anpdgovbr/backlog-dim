import { prisma } from "@/lib/prisma"

export async function verificarPermissao(email: string, acao: string, recurso: string) {
  const usuario = await prisma.user.findUnique({
    where: { email },
    include: { perfil: { include: { permissoes: true } } },
  })

  if (!usuario || !usuario.perfil) return false

  return usuario.perfil.permissoes.some(
    (p) => p.acao === acao && p.recurso === recurso && p.permitido
  )
}

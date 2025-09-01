import { NextResponse } from "next/server"

import { withApi } from "@/lib/withApi"
import { prisma } from "@/lib/prisma"
import { getPerfisHerdadosNomes } from "@/helpers/permissoes-utils"

/**
 * Retorna a cadeia de perfis herdados para o usuário autenticado.
 *
 * @remarks
 * Não exige permissão administrativa: informa somente a própria herança.
 */
export const GET = withApi(async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { perfil: true },
  })

  if (!user || !user.perfil) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 })
  }
  if (!user.perfil.active) {
    return NextResponse.json({ error: "Perfil desativado" }, { status: 403 })
  }

  const cadeia = await getPerfisHerdadosNomes(user.perfil.nome)
  return NextResponse.json({ base: user.perfil.nome, cadeia })
})

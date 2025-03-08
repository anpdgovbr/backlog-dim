import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

// 🔹 Criar ou atualizar uma permissão associada a um perfil
export async function PATCH(req: NextRequest) {
  const { perfilId, acao, recurso, permitido } = await req.json()

  if (!perfilId || !acao || !recurso || permitido === undefined) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const novaPermissao = await prisma.permissao.upsert({
    where: {
      perfilId_acao_recurso: {
        perfilId,
        acao,
        recurso
      }
    },
    update: { permitido },
    create: { perfilId, acao, recurso, permitido }
  })

  return NextResponse.json(novaPermissao)
}

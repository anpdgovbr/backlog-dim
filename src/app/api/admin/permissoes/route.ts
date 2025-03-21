import { prisma } from "@/lib/prisma"
import { PermissaoPayload } from "@/types/Permissao"
import { NextRequest, NextResponse } from "next/server"

// ajuste o caminho se necessário

export async function PATCH(req: NextRequest) {
  const { perfilId, acao, recurso, permitido }: PermissaoPayload = await req.json()

  if (!perfilId || !acao || !recurso || permitido === undefined) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const novaPermissao = await prisma.permissao.upsert({
    where: {
      perfilId_acao_recurso: {
        perfilId,
        acao,
        recurso,
      },
    },
    update: { permitido },
    create: { perfilId, acao, recurso, permitido },
  })

  return NextResponse.json(novaPermissao)
}

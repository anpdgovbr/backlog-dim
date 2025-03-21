import { prisma } from "@/lib/prisma"
import { PermissaoPayload } from "@/types/Permissao"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest) {
  const { perfilId, acao, recurso, permitido }: PermissaoPayload = await req.json()

  if (!perfilId || !acao || !recurso || permitido === undefined) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  try {
    // 🔍 Verifica se já existe uma permissão ativa para evitar sobrescrever soft-deletadas
    const permissaoExistente = await prisma.permissao.findUnique({
      where: {
        perfilId_acao_recurso: {
          perfilId,
          acao,
          recurso,
        },
      },
    })

    if (permissaoExistente && !permissaoExistente.active) {
      return NextResponse.json(
        { error: "Permissão está desabilitada. Reative ou exclua manualmente." },
        { status: 409 }
      )
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
  } catch (error) {
    console.error("Erro ao atualizar permissão:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

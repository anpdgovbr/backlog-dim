import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const permissaoId = parseInt(id, 10)
    if (isNaN(permissaoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { permitido } = body

    if (typeof permitido !== "boolean") {
      return NextResponse.json({ error: "Campo 'permitido' inválido" }, { status: 400 })
    }

    // 🔹 Verifica se a permissão existe e está ativa
    const permissao = await prisma.permissao.findUnique({
      where: { id: permissaoId, active: true },
      include: { perfil: true },
    })

    if (!permissao || !permissao.perfil?.active) {
      return NextResponse.json(
        { error: "Permissão não encontrada ou perfil desativado" },
        { status: 404 }
      )
    }

    // 🔹 Atualiza a permissão se estiver ativa
    const permissaoAtualizada = await prisma.permissao.update({
      where: { id: permissaoId },
      data: { permitido },
    })

    return NextResponse.json(permissaoAtualizada)
  } catch (error) {
    console.error("Erro ao atualizar permissão:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

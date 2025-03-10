import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { perfilId } = await request.json()
    const { id } = await context.params

    const usuarioAtualizado = await prisma.user.update({
      where: { id: id },
      data: { perfilId: Number(perfilId) },
    })

    return NextResponse.json({ success: true, usuario: usuarioAtualizado })
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}

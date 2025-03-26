import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

interface PatchRequestBody {
  perfilId?: number
  responsavelId?: number | null
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { perfilId, responsavelId }: PatchRequestBody = await request.json()
    const { id } = await context.params

    if (perfilId === undefined && responsavelId === undefined) {
      return NextResponse.json(
        { error: "É necessário fornecer 'perfilId' ou 'responsavelId'" },
        { status: 400 }
      )
    }

    const data: Prisma.UserUpdateInput = {}

    if (perfilId !== undefined) {
      data.perfil = { connect: { id: perfilId } }
    }

    if (responsavelId === null || responsavelId === null) {
      data.responsavel = { disconnect: true }
    } else if (responsavelId !== undefined) {
      data.responsavel = { connect: { id: responsavelId } }
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, usuario: usuarioAtualizado })
  } catch (error) {
    console.error("Erro ao atualizar perfil ou responsável do usuário:", error)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}

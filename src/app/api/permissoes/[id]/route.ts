import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Obtendo o ID diretamente sem await
    const { id } = params

    // Validação do ID
    const permissaoId = parseInt(id, 10)
    if (isNaN(permissaoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Validação do corpo da requisição
    const body = await request.json()
    const { permitido } = body

    if (typeof permitido !== "boolean") {
      return NextResponse.json({ error: "Campo 'permitido' inválido" }, { status: 400 })
    }

    // Atualizando a permissão no banco de dados
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

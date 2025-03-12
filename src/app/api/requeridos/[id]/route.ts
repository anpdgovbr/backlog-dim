import { authOptions } from "@/config/next-auth.config"
import { verificarPermissao } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * 🔹 GET: Retorna um Requerido específico
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  // 🔹 Verifica permissão para visualizar metadados
  const temPermissao = await verificarPermissao(session.user.email, "Exibir", "Processo")
  if (!temPermissao) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  try {
    const { id } = await params
    const requerido = await prisma.requerido.findUnique({
      where: { id: Number(id) },
      include: {
        setor: true,
        cnae: true,
      },
    })

    if (!requerido) {
      return NextResponse.json({ error: "Requerido não encontrado" }, { status: 404 })
    }

    return NextResponse.json(requerido)
  } catch (error) {
    console.error("Erro ao buscar requerido:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

/**
 * 🔹 PUT: Atualiza um Requerido específico
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  // 🔹 Verifica permissão para editar metadados
  const temPermissao = await verificarPermissao(
    session.user.email,
    "Editar",
    "Responsavel"
  )
  if (!temPermissao) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  const { id } = await params

  try {
    const data = await req.json()
    const requeridoAtualizado = await prisma.requerido.update({
      where: { id: Number(id) },
      data,
    })

    return NextResponse.json(requeridoAtualizado)
  } catch (error) {
    console.error("Erro ao atualizar requerido:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

/**
 * 🔹 DELETE: Remove um Requerido específico
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  // 🔹 Verifica permissão para excluir metadados
  const temPermissao = await verificarPermissao(
    session.user.email,
    "Excluir",
    "Responsavel"
  )
  if (!temPermissao) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  const { id } = await params

  try {
    await prisma.requerido.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ message: "Requerido deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar requerido:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

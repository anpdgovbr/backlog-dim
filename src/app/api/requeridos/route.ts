import { authOptions } from "@/config/next-auth.config"
import { verificarPermissao } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * 🔹 GET: Retorna todos os requeridos cadastrados
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  // 🔹 Verifica permissão para visualizar os requeridos
  const temPermissao = await verificarPermissao(session.user.email, "Exibir", "Processo")
  if (!temPermissao) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  try {
    const requeridos = await prisma.requerido.findMany()
    return NextResponse.json(requeridos)
  } catch (error) {
    console.error("Erro ao buscar requeridos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

/**
 * 🔹 POST: Cria um novo Requerido
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  // 🔹 Verifica permissão para cadastrar requeridos
  const temPermissao = await verificarPermissao(
    session.user.email,
    "Cadastrar",
    "Responsavel"
  )
  if (!temPermissao) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  try {
    const data = await req.json()
    const novoRequerido = await prisma.requerido.create({ data })
    return NextResponse.json(novoRequerido, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar um novo requerido:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

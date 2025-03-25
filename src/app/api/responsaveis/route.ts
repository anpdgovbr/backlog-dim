import { authOptions } from "@/config/next-auth.config"
import { verificarPermissao } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  const temPermissao = await verificarPermissao(
    session.user.email,
    "Exibir",
    "Responsavel"
  )
  if (!temPermissao) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  try {
    const dados = await prisma.responsavel.findMany()
    return NextResponse.json(dados)
  } catch (error) {
    console.error("Erro ao buscar responsaveis:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  // 🔹 Verifica permissão para cadastrar metadados
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
    const novoDado = await prisma.responsavel.create({ data })
    return NextResponse.json(novoDado, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar responsavel:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

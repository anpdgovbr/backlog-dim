import { authOptions } from "@/config/next-auth.config"
import { verificarPermissao } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * 🔹 GET: Retorna requeridos com paginação e ordenação
 */
export async function GET(req: Request) {
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
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const pageSize = Number(searchParams.get("pageSize")) || 10
    const orderBy = searchParams.get("orderBy") || "nome"
    const ascending = searchParams.get("ascending") === "true"

    const skip = (page - 1) * pageSize
    const take = pageSize

    // 🔹 Contagem total de registros
    const total = await prisma.requerido.count()

    // 🔹 Busca paginada com ordenação
    const requeridos = await prisma.requerido.findMany({
      skip,
      take,
      orderBy: { [orderBy]: ascending ? "asc" : "desc" },
      include: {
        cnae: { select: { id: true, code: true, nome: true } },
        setor: { select: { id: true, nome: true } },
      },
    })

    return NextResponse.json({ data: requeridos, total })
  } catch (error) {
    console.error("Erro ao buscar requeridos:", error)

    let errorMessage = "Erro interno do servidor"
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
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

import authOptions from "@/config/next-auth.config"
import { buscarPermissoesConcedidas, pode } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  const permissoes = await buscarPermissoesConcedidas(session.user.email)
  if (!pode(permissoes, "Cadastrar_Processo")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  try {
    const data = await req.json()

    const processo = await prisma.processo.create({
      data,
      include: {
        formaEntrada: true,
        responsavel: true,
        situacao: true,
        encaminhamento: true,
      },
    })

    console.log("Processo criado:", processo)
    return NextResponse.json(processo, { status: 201 })
  } catch (err) {
    console.error("Erro geral no POST:", err)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  const permissoes = await buscarPermissoesConcedidas(session.user.email)
  if (!pode(permissoes, "Exibir_Processo")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const pageSize = Number(searchParams.get("pageSize")) || 10
    const orderBy = searchParams.get("orderBy") || "dataCriacao"
    const ascending = searchParams.get("ascending") === "true"

    const skip = (page - 1) * pageSize
    const take = pageSize

    const [total, processos] = await Promise.all([
      prisma.processo.count({
        where: { active: true },
      }),
      prisma.processo.findMany({
        where: { active: true },
        skip,
        take,
        orderBy: { [orderBy]: ascending ? "asc" : "desc" },
        include: {
          formaEntrada: { select: { id: true, nome: true } },
          responsavel: { select: { id: true, nome: true } },
          situacao: { select: { id: true, nome: true } },
          encaminhamento: { select: { id: true, nome: true } },
        },
      }),
    ])

    return NextResponse.json({ data: processos, total })
  } catch (err) {
    console.error("Erro na API /api/processos:", err)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}

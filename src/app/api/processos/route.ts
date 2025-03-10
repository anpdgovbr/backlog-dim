import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// 🔹 Criar um novo processo
export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log("Recebendo dados:", data)

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
    return NextResponse.json(processo, { status: 201 }) // HTTP 201 Created
  } catch (err) {
    console.error("Erro geral no POST:", err)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}

// 🔹 Listar todos os processos com paginação e ordenação
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const pageSize = Number(searchParams.get("pageSize")) || 10
    const orderBy = searchParams.get("orderBy") || "dataCriacao"
    const ascending = searchParams.get("ascending") === "true"

    const skip = (page - 1) * pageSize
    const take = pageSize

    // 🔹 Contagem total de registros
    const total = await prisma.processo.count()

    // 🔹 Buscar dados paginados corretamente
    const processos = await prisma.processo.findMany({
      skip,
      take,
      orderBy: { [orderBy]: ascending ? "asc" : "desc" },
      include: {
        formaEntrada: { select: { id: true, nome: true } },
        responsavel: { select: { id: true, nome: true } },
        situacao: { select: { id: true, nome: true } },
        encaminhamento: { select: { id: true, nome: true } },
      },
    })

    return NextResponse.json({ data: processos, total })
  } catch (err) {
    console.error("Erro na API /api/processos:", err)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}

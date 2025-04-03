// app/api/auditoria/route.ts
import { prisma } from "@/lib/prisma"
import { withApiSlim } from "@/lib/withApiSlim"
import { AcaoAuditoria, Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { tabela, acao, registroId, userId, email, contexto, antes, depois } =
      await req.json()

    if (!tabela || !acao) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes: tabela e acao" },
        { status: 400 }
      )
    }

    if (!Object.values(AcaoAuditoria).includes(acao)) {
      return NextResponse.json({ error: `Ação '${acao}' inválida` }, { status: 400 })
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null

    const userAgent = req.headers.get("user-agent") || null

    await prisma.auditLog.create({
      data: {
        tabela,
        acao,
        registroId,
        userId,
        email,
        contexto,
        antes,
        depois,
        ip,
        userAgent,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao registrar auditoria:", error)
    return NextResponse.json(
      { error: "Erro interno ao registrar auditoria" },
      { status: 500 }
    )
  }
}

const handleGET = withApiSlim(async ({ req }) => {
  const { searchParams } = new URL(req.url)

  // 🧾 Paginação e ordenação
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")
  const orderBy = searchParams.get("orderBy") || "criadoEm"
  const ascending = searchParams.get("ascending") === "true"

  // 🔍 Filtros
  const acaoParam = searchParams.get("acao")
  const acao =
    acaoParam && Object.values(AcaoAuditoria).includes(acaoParam as AcaoAuditoria)
      ? (acaoParam as AcaoAuditoria)
      : undefined

  const tabela = searchParams.get("tabela") || undefined
  const email = searchParams.get("email") || undefined
  const dataInicial = searchParams.get("dataInicial")
  const dataFinal = searchParams.get("dataFinal")
  const search = searchParams.get("search")?.toLowerCase() || ""

  const where: Prisma.AuditLogWhereInput = {
    ...(acao && { acao }),
    ...(tabela && { tabela: { contains: tabela, mode: "insensitive" } }),
    ...(email && { email: { contains: email, mode: "insensitive" } }),
    ...(dataInicial || dataFinal
      ? {
          criadoEm: {
            ...(dataInicial && { gte: new Date(dataInicial) }),
            ...(dataFinal && { lte: new Date(dataFinal) }),
          },
        }
      : {}),
    ...(search && {
      OR: [
        { tabela: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { acao: { equals: search as AcaoAuditoria } },
      ],
    }),
  }

  const [total, dados] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { [orderBy]: ascending ? "asc" : "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return NextResponse.json({ total, dados })
}, undefined)

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleGET(req, { params: await context.params })
}

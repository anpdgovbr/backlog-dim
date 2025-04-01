// app/api/auditoria/route.ts
import { prisma } from "@/lib/prisma"
import { withApiSlim } from "@/lib/withApiSlim"
import { AcaoAuditoria } from "@prisma/client"
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

export const GET = withApiSlim(async ({ req }) => {
  const { searchParams } = new URL(req.url)

  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")
  const acaoParam = searchParams.get("acao")
  const acao =
    acaoParam && Object.values(AcaoAuditoria).includes(acaoParam as AcaoAuditoria)
      ? (acaoParam as AcaoAuditoria)
      : undefined
  const tabela = searchParams.get("tabela")
  const email = searchParams.get("email")
  const dataInicial = searchParams.get("dataInicial")
  const dataFinal = searchParams.get("dataFinal")

  const where = {
    ...(acao && { acao }),
    ...(tabela && { tabela }),
    ...(email && { email }),
    ...(dataInicial || dataFinal
      ? {
          criadoEm: {
            ...(dataInicial && { gte: new Date(dataInicial) }),
            ...(dataFinal && { lte: new Date(dataFinal) }),
          },
        }
      : {}),
  }

  const [total, dados] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { criadoEm: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return NextResponse.json({ total, dados })
}, undefined)

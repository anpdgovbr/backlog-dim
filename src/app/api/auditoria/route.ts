// app/api/auditoria/route.ts
import { prisma } from "@/lib/prisma"
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

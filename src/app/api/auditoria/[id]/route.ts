import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"
import { NextResponse } from "next/server"

export const GET = withApiForId(async ({ params }) => {
  const { id } = params as { id: string } // 🔧 tipagem explícita para evitar erro TS

  const log = await prisma.auditLog.findUnique({
    where: { id: Number(id) },
  })

  if (!log) {
    return NextResponse.json({ error: "Log não encontrado" }, { status: 404 })
  }

  return NextResponse.json(log)
}, undefined)

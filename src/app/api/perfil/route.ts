import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "E-mail é obrigatório" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { perfil: true },
  })

  if (!user || !user.perfil) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 })
  }

  // 🔹 Verifica se o perfil foi desativado (soft delete)
  if (!user.perfil.active) {
    return NextResponse.json({ error: "Perfil desativado" }, { status: 403 })
  }

  return NextResponse.json({ id: user.perfil.id, nome: user.perfil.nome })
}

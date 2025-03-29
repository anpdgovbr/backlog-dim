import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, context: { params: Promise<{ email: string }> }) {
  const { email } = await context.params

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Erro ao buscar usuário por e-mail:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

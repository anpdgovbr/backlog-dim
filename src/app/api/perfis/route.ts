import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const perfis = await prisma.perfil.findMany({
      where: { active: true }, // 🔹 Filtra apenas perfis ativos
    })

    return NextResponse.json(perfis)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar perfis", detalhe: (error as Error).message },
      { status: 500 }
    )
  }
}

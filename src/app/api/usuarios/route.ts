import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const usuarios = await prisma.user.findMany()
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}

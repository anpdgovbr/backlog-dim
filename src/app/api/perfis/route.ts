import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const perfis = await prisma.perfil.findMany()
  return NextResponse.json(perfis)
}

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET() {
  const perfis = await prisma.perfil.findMany()
  return NextResponse.json(perfis)
}

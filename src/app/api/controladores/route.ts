// src/app/api/controladores/route.ts
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const baseUrl = process.env.CONTROLADORES_API_URL || "http://localhost:3001"
  const url = `${baseUrl}/controladores?${searchParams.toString()}`

  const resposta = await fetch(url)
  const dados = await resposta.json()

  return NextResponse.json(dados)
}

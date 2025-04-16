// src/app/api/controladores/route.ts
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = `http://hml-dim.anpd.gov.br:3001/controladores?${searchParams.toString()}`

  const resposta = await fetch(url)
  const dados = await resposta.json()

  return NextResponse.json(dados)
}

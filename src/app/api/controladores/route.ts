// src/app/api/controladores/route.ts
import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApi } from "@/lib/withApi"

const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"
const endpoint = `${baseUrl}/controladores`

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = `${endpoint}?${searchParams.toString()}`

  const resposta = await fetch(url)
  const dados = await resposta.json()

  return NextResponse.json(dados)
}

export const POST = withApi(
  async ({ req }) => {
    const body = await req.json()

    const resposta = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const dados = await resposta.json()

    return {
      response: Response.json(dados, { status: resposta.status }),
      audit: {
        depois: dados,
      },
    }
  },
  {
    tabela: "requerido",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Responsavel",
  }
)

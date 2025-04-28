// src/app/api/cnaes/route.ts
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlim } from "@/lib/withApiSlim"
import { AcaoAuditoria } from "@prisma/client"
import { NextResponse } from "next/server"

const baseUrl = process.env.CONTROLADORES_API_URL || "http://localhost:3001"
const endpoint = `${baseUrl}/cnaes`

export const GET = withApiSlim(async (ctx) => {
  const { req } = ctx
  const { searchParams } = new URL(req.url)
  const url = `${endpoint}?${searchParams.toString()}`

  const resposta = await fetch(url)
  const dados = await resposta.json()

  return NextResponse.json(dados)
}, "Exibir_Metadados")

export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.cNAE.create({
        data: {
          ...data,
          active: true,
          exclusionDate: null,
        },
      })

      return {
        response: Response.json(novoDado, { status: 201 }),
        audit: {
          depois: novoDado,
        },
      }
    } catch (error) {
      console.error("Erro ao criar CNAE:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "CNAE",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Metadados",
  }
)

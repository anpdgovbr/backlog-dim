import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { AcaoAuditoria } from "@prisma/client"
import { NextResponse } from "next/server"

const baseUrl = process.env.CONTROLADORES_API_URL || "http://localhost:3001"
const endpoint = `${baseUrl}/setores`

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = `${endpoint}?${searchParams.toString()}`

  const resposta = await fetch(url)
  const dados = await resposta.json()

  return NextResponse.json(dados)
}

// refazer com o endpoint correto
export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.setor.create({
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
      console.error("Erro ao criar setor:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "setor",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Metadados",
  }
)

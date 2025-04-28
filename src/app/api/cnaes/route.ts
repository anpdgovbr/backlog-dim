// src/app/api/cnaes/route.ts
import { withApi } from "@/lib/withApi"
import { withApiSlim } from "@/lib/withApiSlim"
import { AcaoAuditoria } from "@prisma/client"
import { NextResponse } from "next/server"

const baseUrl = process.env.CONTROLADORES_API_URL || "http://localhost:3001"
const endpoint = `${baseUrl}/cnaes`

const handlerGET = withApiSlim<{ id: string }>(
  async ({ req: _req, email: _email, userId: _userId, params }) => {
    const { id } = params

    const resposta = await fetch(`${endpoint}/${id}`)

    if (!resposta.ok) {
      return Response.json(
        { error: "Recurso não encontrado" },
        { status: resposta.status }
      )
    }

    const dados = await resposta.json()

    return NextResponse.json(dados)
  },
  "Exibir_Metadados" // <- Sua permissão associada
)

// Aqui é a exportação correta exigida pelo Next.js 15.3+
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerGET(req, context)
}

export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const resposta = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!resposta.ok) {
        const errorData = await resposta.json()
        console.error("Erro ao criar CNAE na API externa:", errorData)
        return Response.json(
          { error: "Erro ao criar CNAE", detalhes: errorData },
          { status: resposta.status }
        )
      }

      const novoDado = await resposta.json()

      return {
        response: Response.json(novoDado, { status: 201 }),
        audit: {
          depois: novoDado,
        },
      }
    } catch (error) {
      console.error("Erro interno ao criar CNAE:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "CNAE",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Metadados",
  }
)

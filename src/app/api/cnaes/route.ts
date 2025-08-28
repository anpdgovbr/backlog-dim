// src/app/api/cnaes/route.ts
import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApi } from "@/lib/withApi"

const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"
const endpoint = `${baseUrl}/cnaes`

/**
 * Manipulador para requisições GET na rota de CNAEs.
 *
 * @remarks
 * Este endpoint atua como proxy para a API externa de CNAEs, repassando a query string recebida
 * e retornando o JSON obtido da API de metadados.
 *
 * @param req - Objeto Request contendo a URL e parâmetros de consulta.
 * @returns NextResponse com os dados dos CNAEs obtidos da API externa.
 *
 * @example
 * GET /api/cnaes?query=123
 */
export async function GET(req: Request) {
  /**
   * Proxy para listar CNAEs na API externa.
   * Repasse de query string e retorno do JSON obtido.
   * @example
   * GET /api/cnaes?query=123
   */
  const { searchParams } = new URL(req.url)
  const url = `${endpoint}?${searchParams.toString()}`

  const resposta = await fetch(url)
  const dados = await resposta.json()

  return NextResponse.json(dados)
}

/**
 * Manipulador para requisições POST na rota de CNAEs.
 *
 * @remarks
 * Este endpoint cria um novo registro de CNAE na API externa de metadados.
 * Em caso de erro na API externa, retorna o código HTTP e detalhes do erro.
 * Realiza auditoria da ação conforme convenção do projeto.
 *
 * @param req - Objeto Request contendo o corpo da requisição com os dados do CNAE.
 * @returns Response JSON com o novo registro criado ou erro detalhado.
 *
 * @example
 * POST /api/cnaes
 * {
 *   "codigo": "1234-5/01",
 *   "descricao": "Atividades de exemplo"
 * }
 */
export const POST = withApi(
  /**
   * Cria um registro de CNAE na API externa.
   * Em caso de erro na API externa, retorna o código e detalhes.
   */
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

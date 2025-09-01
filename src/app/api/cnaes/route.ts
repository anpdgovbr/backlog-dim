// src/app/api/cnaes/route.ts
import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApi } from "@/lib/withApi"

const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"
const endpoint = `${baseUrl}/cnaes`

/**
 * Proxy para listar CNAEs na API externa.
 *
 * @param req - Requisição HTTP (query string é repassada).
 * @returns JSON retornado pela API externa.
 * @example GET /api/cnaes?query=123
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
 * Cria um CNAE via API externa.
 *
 * @see {@link withApi}
 * @returns JSON com o registro criado e auditoria.
 * @example POST /api/cnaes { "codigo": "1234-5/00", "descricao": "..." }
 * @remarks Auditoria ({@link AcaoAuditoria.CREATE}) e permissão {acao: "Cadastrar", recurso: "Metadados"}.
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
    permissao: { acao: "Cadastrar", recurso: "Metadados" },
  }
)

// src/app/api/controladores/route.ts
import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApi } from "@/lib/withApi"

const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"
const endpoint = `${baseUrl}/controladores`

/**
 * Proxy para listar controladores na API externa.
 *
 * @param req - Requisição HTTP (query string é repassada).
 * @returns JSON retornado pela API externa.
 * @example GET /api/controladores?nome=Empresa
 */
export async function GET(req: Request) {
  /**
   * Proxy para a API externa de controladores.
   *
   * Encaminha a query string recebida para o endpoint externo definido em
   * `CONTROLADORES_API_URL` e retorna o JSON recebido.
   *
   * Exemplo:
   * GET /api/controladores?nome=Empresa
   */
  const { searchParams } = new URL(req.url)
  const url = `${endpoint}?${searchParams.toString()}`

  const resposta = await fetch(url)
  const dados = await resposta.json()

  return NextResponse.json(dados)
}

/**
 * Cria um controlador via API externa.
 *
 * @see {@link withApi}
 * @returns JSON com a resposta da API externa e auditoria de criação.
 * @example POST /api/controladores { "nome": "Empresa X" }
 * @remarks Auditoria ({@link AcaoAuditoria.CREATE}) e permissão {acao: "Cadastrar", recurso: "Responsavel"}.
 */
export const POST = withApi(
  /**
   * Cria um controlador via API externa.
   *
   * Recebe o corpo (JSON) e repassa para o endpoint externo.
   * Auditoria é preenchida com a resposta retornada.
   */
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
    permissao: { acao: "Cadastrar", recurso: "Responsavel" },
  }
)

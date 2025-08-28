// src/app/api/controladores/route.ts
import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApi } from "@/lib/withApi"

const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"
const endpoint = `${baseUrl}/controladores`

/**
 * Manipulador para requisições GET na rota de controladores.
 *
 * @remarks
 * Este endpoint atua como proxy para a API externa de controladores, repassando a query string recebida
 * e retornando o JSON obtido da API de metadados.
 *
 * @param req - Objeto Request contendo a URL e parâmetros de consulta.
 * @returns NextResponse com os dados dos controladores obtidos da API externa.
 *
 * @example
 * GET /api/controladores?nome=Empresa
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
 * Manipulador para requisições POST na rota de controladores.
 *
 * @remarks
 * Este endpoint cria um novo registro de controlador na API externa de metadados.
 * Em caso de erro na API externa, retorna o código HTTP e detalhes do erro.
 * Realiza auditoria da ação conforme convenção do projeto.
 *
 * @param req - Objeto Request contendo o corpo da requisição com os dados do controlador.
 * @returns Response JSON com o novo registro criado ou erro detalhado.
 *
 * @example
 * POST /api/controladores
 * {
 *   "nome": "Empresa Exemplo",
 *   "cnpj": "12345678000199"
 * }
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
    permissao: "Cadastrar_Responsavel",
  }
)

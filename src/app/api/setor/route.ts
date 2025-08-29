import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApi } from "@/lib/withApi"

/**
 * URL base do serviço de controladores usado para solicitações de metadados.
 *
 * O valor é lido da variável de ambiente CONTROLLADORES_API_URL. Quando não
 * fornecido, utiliza o ambiente de homologação fornecido como fallback.
 *
 * @constant
 * @type {string}
 */
const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"

/**
 * Endpoint completo para o recurso de setores.
 *
 * Construído a partir de baseUrl adicionando o caminho `/setores`. Usado para
 * operações GET/POST contra o serviço externo de setores.
 *
 * @constant
 * @type {string}
 */
const endpoint = `${baseUrl}/setores`

/**
 * Manipulador GET para setores.
 *
 * Busca os setores da API externa, repassando os parâmetros de busca recebidos na requisição.
 *
 * @param req - Request HTTP contendo os parâmetros de busca.
 * @returns NextResponse JSON com a lista de setores.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = `${endpoint}?${searchParams.toString()}`

  const resposta = await fetch(url)
  const dados = await resposta.json()

  return NextResponse.json(dados)
}

/**
 * Manipulador POST para criação de setor.
 *
 * Envia os dados recebidos para a API externa de setores, criando um novo setor.
 * Retorna o setor criado e dados para auditoria.
 *
 * @param req - Request HTTP contendo os dados do setor.
 * @returns Response JSON com o setor criado e dados para auditoria.
 */
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
        console.error("Erro ao criar Setor na API externa:", errorData)
        return Response.json(
          { error: "Erro ao criar Setor", detalhes: errorData },
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
      console.error("Erro interno ao criar Setor:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "setor",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Metadados",
  }
)

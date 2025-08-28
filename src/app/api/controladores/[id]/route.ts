/**
 * @file Rota de API para operações sobre Controladores por ID.
 *
 * Esta rota implementa os endpoints GET, PATCH e DELETE para buscar, atualizar e excluir
 * registros de controladores, utilizando a API externa definida em CONTROLADORES_API_URL.
 * Inclui auditoria das ações realizadas conforme convenção do projeto.
 */

import { AcaoAuditoria } from "@anpdgovbr/shared-types"
import { withApiForId } from "@/lib/withApi"

const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"

/**
 * Handler para requisições GET na rota de Controlador por ID.
 *
 * @remarks
 * Busca informações de um controlador específico na API externa.
 * Realiza auditoria da ação.
 *
 * @param req - Objeto Request da requisição HTTP.
 * @param context - Contexto da rota, contendo os parâmetros, incluindo o ID do controlador.
 * @returns Promise<Response> com os dados do controlador ou erro.
 */
const handlerGET = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params
    const res = await fetch(`${baseUrl}/controladores/${id}`)

    if (!res.ok) {
      return Response.json({ error: "Requerido não encontrado" }, { status: res.status })
    }

    const data = await res.json()

    return {
      response: Response.json(data),
      audit: { depois: { id: data?.id } },
    }
  },
  {
    tabela: "requerido",
    acao: AcaoAuditoria.GET,
    permissao: "Exibir_Processo",
  }
)

/**
 * Endpoint GET para buscar controlador por ID.
 *
 * @param req - Objeto Request da requisição HTTP.
 * @param context - Contexto da rota, contendo os parâmetros, incluindo o ID do controlador.
 * @returns Promise<Response> com os dados do controlador ou erro.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

/**
 * Handler para requisições PATCH na rota de Controlador por ID.
 *
 * @remarks
 * Atualiza informações de um controlador específico na API externa.
 * Realiza auditoria da ação, incluindo estado anterior e posterior.
 *
 * @param req - Objeto Request da requisição HTTP.
 * @param context - Contexto da rota, contendo os parâmetros, incluindo o ID do controlador.
 * @returns Promise<Response> com os dados atualizados ou erro.
 */
const handlerPATCH = withApiForId<{ id: string }>(
  async ({ params, req }) => {
    const { id } = params
    const body = await req.json()

    const existenteRes = await fetch(`${baseUrl}/controladores/${id}`)
    const existente = existenteRes.ok ? await existenteRes.json() : null

    const res = await fetch(`${baseUrl}/controladores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return Response.json(
        { error: "Erro ao atualizar requerido" },
        { status: res.status }
      )
    }

    const data = await res.json()

    return {
      response: Response.json(data),
      audit: {
        antes: existente,
        depois: data,
      },
    }
  },
  {
    tabela: "requerido",
    acao: AcaoAuditoria.UPDATE,
    permissao: "Editar_Responsavel",
  }
)

/**
 * Endpoint PATCH para atualizar controlador por ID.
 *
 * @param req - Objeto Request da requisição HTTP.
 * @param context - Contexto da rota, contendo os parâmetros, incluindo o ID do controlador.
 * @returns Promise<Response> com os dados atualizados ou erro.
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPATCH(req, { params: await context.params })
}

/**
 * Handler para requisições DELETE na rota de Controlador por ID.
 *
 * @remarks
 * Exclui um controlador específico na API externa.
 * Realiza auditoria da ação.
 *
 * @param req - Objeto Request da requisição HTTP.
 * @param context - Contexto da rota, contendo os parâmetros, incluindo o ID do controlador.
 * @returns Promise<Response> com o resultado da exclusão ou erro.
 */
const handlerDELETE = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params

    const res = await fetch(`${baseUrl}/controladores/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      return Response.json({ error: "Erro ao excluir requerido" }, { status: res.status })
    }

    const resultado = await res.json()

    return {
      response: Response.json(resultado),
      audit: { depois: { id } },
    }
  },
  {
    tabela: "requerido",
    acao: AcaoAuditoria.DELETE,
    permissao: "Desabilitar_Responsavel",
  }
)

/**
 * Endpoint DELETE para excluir controlador por ID.
 *
 * @param req - Objeto Request da requisição HTTP.
 * @param context - Contexto da rota, contendo os parâmetros, incluindo o ID do controlador.
 * @returns Promise<Response> com o resultado da exclusão ou erro.
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerDELETE(req, { params: await context.params })
}

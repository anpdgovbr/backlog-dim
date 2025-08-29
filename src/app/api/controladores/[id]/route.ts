// src/app/api/requeridos/[id]/route.ts
import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApiForId } from "@/lib/withApi"

const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"

// === GET ===
/**
 * Recupera um controlador por `id` via API externa.
 *
 * @see {@link withApiForId}
 * @returns JSON do controlador externo.
 * @example GET /api/controladores/10
 * @remarks Auditoria ({@link AcaoAuditoria.GET}).
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
    permissao: { acao: "Exibir", recurso: "Processo" },
  }
)

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

// === PATCH ===
/**
 * Atualiza um controlador via API externa.
 *
 * @see {@link withApiForId}
 * @returns JSON com dados atualizados e auditoria.
 * @example PATCH /api/controladores/10 { "nome": "Novo" }
 * @remarks Auditoria ({@link AcaoAuditoria.UPDATE}) e permissão {acao: "Editar", recurso: "Responsavel"}.
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
    permissao: { acao: "Editar", recurso: "Responsavel" },
  }
)

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPATCH(req, { params: await context.params })
}

// === DELETE ===
/**
 * Exclui um controlador via API externa.
 *
 * @see {@link withApiForId}
 * @returns JSON com resultado e auditoria.
 * @example DELETE /api/controladores/10
 * @remarks Auditoria ({@link AcaoAuditoria.DELETE}) e permissão {acao: "Desabilitar", recurso: "Responsavel"}.
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
    permissao: { acao: "Desabilitar", recurso: "Responsavel" },
  }
)

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerDELETE(req, { params: await context.params })
}

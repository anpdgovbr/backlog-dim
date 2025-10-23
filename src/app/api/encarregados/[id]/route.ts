import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { getControladoresApiUrl, parseControladoresJson } from "@/lib/controladoresApi"
import { withApiForId } from "@/lib/withApi"

function toAuditObject(value: unknown): object | undefined {
  return value && typeof value === "object" ? (value as object) : undefined
}

const handlerGET = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params
    const response = await fetch(getControladoresApiUrl(`/encarregado/${id}`))
    const payload = await parseControladoresJson<unknown>(response)

    if (!response.ok) {
      return Response.json(payload ?? { error: "Encarregado não encontrado" }, {
        status: response.status,
      })
    }

    const auditBody = toAuditObject(payload) ?? { id }

    return {
      response: payload
        ? Response.json(payload, { status: response.status })
        : new Response(null, { status: response.status }),
      audit: { depois: auditBody },
    }
  },
  {
    tabela: "encarregado",
    acao: AcaoAuditoria.GET,
    permissao: { acao: "Exibir", recurso: "Responsavel" },
  }
)

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

const handlerPUT = withApiForId<{ id: string }>(
  async ({ params, req }) => {
    const { id } = params
    const body = await req.json()

    const existenteResponse = await fetch(getControladoresApiUrl(`/encarregado/${id}`))
    const existente = existenteResponse.ok
      ? await parseControladoresJson<unknown>(existenteResponse)
      : null

    const response = await fetch(getControladoresApiUrl(`/encarregado/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const payload = await parseControladoresJson<unknown>(response)

    if (!response.ok) {
      return Response.json(payload ?? { error: "Erro ao atualizar encarregado" }, {
        status: response.status,
      })
    }

    const auditAntes = toAuditObject(existente)
    const auditDepois = toAuditObject(payload)

    return {
      response: payload
        ? Response.json(payload, { status: response.status })
        : new Response(null, { status: response.status }),
      audit: {
        ...(auditAntes ? { antes: auditAntes } : {}),
        ...(auditDepois ? { depois: auditDepois } : {}),
      },
    }
  },
  {
    tabela: "encarregado",
    acao: AcaoAuditoria.UPDATE,
    permissao: { acao: "Editar", recurso: "Responsavel" },
  }
)

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPUT(req, { params: await context.params })
}

const handlerDELETE = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params

    const response = await fetch(getControladoresApiUrl(`/encarregado/${id}`), {
      method: "DELETE",
    })

    if (response.status === 204) {
      return {
        response: Response.json({ success: true }),
        audit: { depois: { id } },
      }
    }

    const payload = await parseControladoresJson<unknown>(response)

    if (!response.ok) {
      return Response.json(payload ?? { error: "Erro ao excluir encarregado" }, {
        status: response.status,
      })
    }

    const auditDepois = toAuditObject(payload) ?? { id }

    return {
      response: payload
        ? Response.json(payload, { status: response.status })
        : new Response(null, { status: response.status }),
      audit: { depois: auditDepois },
    }
  },
  {
    tabela: "encarregado",
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

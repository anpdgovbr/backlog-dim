import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { getControladoresApiUrl, parseControladoresJson } from "@/lib/controladoresApi"
import { withApi } from "@/lib/withApi"

export async function GET() {
  const response = await fetch(getControladoresApiUrl("/encarregado"))

  if (response.status === 204) {
    return NextResponse.json([])
  }

  const payload = await parseControladoresJson<unknown>(response)

  if (!response.ok) {
    return NextResponse.json(payload ?? { error: "Erro ao buscar encarregados" }, {
      status: response.status,
    })
  }

  return NextResponse.json(payload, { status: response.status })
}

export const POST = withApi(
  async ({ req }) => {
    const body = await req.json()

    const response = await fetch(getControladoresApiUrl("/encarregado"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const payload = await parseControladoresJson<unknown>(response)

    if (!response.ok) {
      return Response.json(payload ?? { error: "Erro ao criar encarregado" }, {
        status: response.status,
      })
    }

    const auditBody = (payload ?? undefined) as object | undefined

    return {
      response: payload
        ? Response.json(payload, { status: response.status })
        : new Response(null, { status: response.status }),
      ...(auditBody ? { audit: { depois: auditBody } } : {}),
    }
  },
  {
    tabela: "encarregado",
    acao: AcaoAuditoria.CREATE,
    permissao: { acao: "Cadastrar", recurso: "Responsavel" },
  }
)

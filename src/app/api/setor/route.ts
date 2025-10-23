import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { getControladoresApiUrl, parseControladoresJson } from "@/lib/controladoresApi"
import { withApi } from "@/lib/withApi"

export async function GET(req: Request) {
  const currentUrl = new URL(req.url)
  const targetUrl = new URL(getControladoresApiUrl("/setor"))

  currentUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value)
  })

  const response = await fetch(targetUrl.toString())

  if (response.status === 204) {
    const fallbackPage = Number(currentUrl.searchParams.get("page") ?? "1")
    const fallbackPageSize = Number(currentUrl.searchParams.get("pageSize") ?? "10")
    return NextResponse.json({
      data: [],
      page: fallbackPage,
      pageSize: fallbackPageSize,
      totalElements: 0,
      totalPages: 0,
    })
  }

  const payload = await parseControladoresJson<unknown>(response)

  if (!response.ok) {
    return NextResponse.json(payload ?? { error: "Erro ao buscar setores" }, {
      status: response.status,
    })
  }

  return NextResponse.json(payload, { status: response.status })
}

export const POST = withApi(
  async ({ req }) => {
    const body = await req.json()

    const response = await fetch(getControladoresApiUrl("/setor"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const payload = await parseControladoresJson<unknown>(response)

    if (!response.ok) {
      return Response.json(payload ?? { error: "Erro ao criar setor" }, {
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
    tabela: "setor",
    acao: AcaoAuditoria.CREATE,
    permissao: { acao: "Cadastrar", recurso: "Metadados" },
  }
)

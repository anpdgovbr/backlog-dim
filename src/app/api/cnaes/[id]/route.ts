import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { getControladoresApiUrl, parseControladoresJson } from "@/lib/controladoresApi"
import { withApiForId } from "@/lib/withApi"

const handlerGET = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params
    const response = await fetch(getControladoresApiUrl(`/cnae/${id}`))
    const payload = await parseControladoresJson<unknown>(response)

    if (!response.ok) {
      return Response.json(payload ?? { error: "CNAE não encontrado" }, {
        status: response.status,
      })
    }

    return {
      response: payload
        ? Response.json(payload, { status: response.status })
        : new Response(null, { status: response.status }),
      audit: { depois: { id: (payload as { id?: string } | null)?.id ?? id } },
    }
  },
  {
    tabela: "cnae",
    acao: AcaoAuditoria.GET,
    permissao: { acao: "Exibir", recurso: "Metadados" },
  }
)

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

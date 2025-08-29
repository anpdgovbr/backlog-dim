import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApiForId } from "@/lib/withApi"

const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"
const endpoint = `${baseUrl}/cnaes`

// === GET ===
/**
 * Recupera um CNAE por `id` via API externa.
 *
 * @see {@link withApiForId}
 * @returns JSON do CNAE.
 * @example GET /api/cnaes/5
 * @remarks Auditoria ({@link AcaoAuditoria.GET}) e permissão {acao: "Exibir", recurso: "Metadados"}.
 */
const handlerGET = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params
    const res = await fetch(`${endpoint}/${id}`)

    if (!res.ok) {
      return Response.json({ error: "CNAE não encontrado" }, { status: res.status })
    }

    const data = await res.json()
    return {
      response: Response.json(data),
      audit: { depois: { id: data?.id } },
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

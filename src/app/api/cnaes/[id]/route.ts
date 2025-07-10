import { withApiForId } from "@/lib/withApi"
import { AcaoAuditoria } from "@prisma/client"

const baseUrl = process.env.CONTROLADORES_API_URL || "https://hml-dim.anpd.gov.br:3001"
const endpoint = `${baseUrl}/cnaes`

// === GET ===
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
    permissao: "Exibir_Metadados",
  }
)

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

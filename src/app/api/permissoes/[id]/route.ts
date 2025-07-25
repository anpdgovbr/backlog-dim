import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"

// Handler isolado
const handlerPATCH = withApiForId<{ id: string }>(
  async ({ params, req }) => {
    const permissaoId = parseInt(params.id, 10)
    if (isNaN(permissaoId)) {
      return Response.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await req.json()
    const { permitido } = body

    if (typeof permitido !== "boolean") {
      return Response.json({ error: "Campo 'permitido' inválido" }, { status: 400 })
    }

    const permissao = await prisma.permissao.findUnique({
      where: { id: permissaoId },
    })

    if (!permissao || !permissao.active) {
      return Response.json(
        { error: "Permissão não encontrada ou desativada" },
        { status: 404 }
      )
    }

    const permissaoAtualizada = await prisma.permissao.update({
      where: { id: permissaoId },
      data: { permitido },
    })

    return {
      response: Response.json(permissaoAtualizada),
      audit: {
        antes: permissao,
        depois: permissaoAtualizada,
      },
    }
  },
  {
    tabela: "permissao",
    acao: AcaoAuditoria.UPDATE,
    permissao: "Alterar_Permissoes",
  }
)

// Export padrão com await em context.params
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPATCH(req, { params: await context.params })
}

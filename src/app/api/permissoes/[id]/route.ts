import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"

/**
 * Handler PATCH para atualização de permissão.
 *
 * @remarks
 * Recebe o ID da permissão via params, valida o corpo da requisição (campo 'permitido'),
 * busca a permissão no banco, verifica se está ativa e atualiza o campo 'permitido'.
 * Retorna o registro atualizado e dados para auditoria.
 *
 * @param params - Parâmetros da rota, incluindo o ID da permissão.
 * @param req - Objeto Request da requisição HTTP.
 * @returns Objeto contendo a resposta HTTP e dados de auditoria.
 */
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

/**
 * Função PATCH exportada para rota /api/permissoes/[id].
 *
 * @remarks
 * Aguarda o parâmetro 'id' do contexto, delega para o handlerPATCH e retorna a resposta.
 *
 * @param req - Objeto Request da requisição HTTP.
 * @param context - Contexto da rota, contendo params (promessa com o ID).
 * @returns Promise<Response> com o resultado da operação.
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPATCH(req, { params: await context.params })
}

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { invalidatePermissionsCache } from "@/lib/permissoes"
import { withApiForId } from "@/lib/withApi"
import { readJson, validateOrBadRequest } from "@/lib/validation"
import { permissaoPatchSchema } from "@/schemas/server/Permissao.zod"

/**
 * Manipulador para atualização parcial (PATCH) de uma Permissão por ID.
 *
 * Este handler é criado via `withApiForId` para executar validações de autorização
 * e auditoria automaticamente. A função interna realiza:
 * - leitura e validação do body usando `permissaoPatchSchema`,
 * - verificação da existência e status (`active`) da permissão,
 * - atualização do campo `permitido` na tabela `permissao`,
 * - invalidação do cache de permissões e preparação de dados para auditoria.
 *
 * @template TParams - Tipo dos parâmetros de rota (ex.: { id: string }).
 * @returns Promise que resolve para um objeto com:
 *  - response: Response JSON contendo a permissão atualizada,
 *  - audit: objeto com os estados `antes` e `depois` para registro em auditoria.
 *
 * @throws Retorna Responses com status apropriado em caso de:
 *  - ID inválido (400),
 *  - payload inválido (conforme validateOrBadRequest),
 *  - permissão não encontrada ou desativada (404).
 *
 * @see withApiForId
 * @see permissaoPatchSchema
 */
const handlerPATCH = withApiForId<{ id: string }>(
  async ({ params, req }) => {
    const permissaoId = parseInt(params.id, 10)
    if (isNaN(permissaoId)) {
      return Response.json({ error: "ID inválido" }, { status: 400 })
    }

    const raw = await readJson(req)
    const valid = validateOrBadRequest(
      permissaoPatchSchema,
      raw,
      `PATCH /api/permissoes/${permissaoId}`
    )
    if (!valid.ok) return valid.response
    const { permitido } = valid.data

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

    // Invalida o cache de permissões após alteração
    invalidatePermissionsCache()

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
    permissao: { acao: "Alterar", recurso: "Permissoes" },
  }
)

/**
 * Entrypoint exportado para o método HTTP PATCH da rota `/api/permissoes/[id]`.
 *
 * Aguarda `context.params` (compatível com App Router) e delega a execução ao
 * `handlerPATCH`.
 *
 * @param req - Requisição HTTP recebida pelo Next.js.
 * @param context.params - Promise que resolve para os parâmetros da rota ({ id: string }).
 * @returns Response produzida por `handlerPATCH`.
 *
 * @remarks Mantido como wrapper assíncrono para suportar `context.params` como Promise
 * no ambiente do App Router do Next.js.
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPATCH(req, { params: await context.params })
}

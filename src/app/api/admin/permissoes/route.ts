import { AcaoAuditoria, type PermissaoPayload } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

/**
 * Manipulador para requisições PATCH na rota de permissões administrativas.
 *
 * Este manipulador atualiza ou cria um registro de permissão (`permissao`) no banco de dados.
 * - Valida o payload recebido, exigindo os campos: `perfilId`, `acao`, `recurso` e `permitido`.
 * - Impede atualização de permissões desabilitadas, exigindo reativação ou exclusão manual.
 * - Utiliza o método `upsert` do Prisma para atualizar ou criar a permissão.
 * - Retorna a permissão atualizada/criada e informações de auditoria.
 * - Em caso de erro, retorna o status HTTP apropriado e mensagem de erro.
 *
 * @param req Requisição HTTP contendo o payload da permissão.
 * @returns Resposta JSON com permissão atualizada/criada e dados de auditoria, ou erro.
 */
export const PATCH = withApi(
  async ({ req }) => {
    const { perfilId, acao, recurso, permitido }: PermissaoPayload = await req.json()

    if (!perfilId || !acao || !recurso || permitido === undefined) {
      return Response.json({ error: "Dados inválidos" }, { status: 400 })
    }

    try {
      const permissaoExistente = await prisma.permissao.findUnique({
        where: {
          perfilId_acao_recurso: {
            perfilId,
            acao,
            recurso,
          },
        },
      })

      if (permissaoExistente && !permissaoExistente.active) {
        return Response.json(
          { error: "Permissão está desabilitada. Reative ou exclua manualmente." },
          { status: 409 }
        )
      }

      const novaPermissao = await prisma.permissao.upsert({
        where: {
          perfilId_acao_recurso: {
            perfilId,
            acao,
            recurso,
          },
        },
        update: { permitido },
        create: { perfilId, acao, recurso, permitido },
      })

      return {
        response: Response.json(novaPermissao),
        audit: {
          antes: permissaoExistente ?? undefined,
          depois: novaPermissao,
        },
      }
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "permissao",
    acao: AcaoAuditoria.UPDATE,
    permissao: "Alterar_Permissoes",
  }
)

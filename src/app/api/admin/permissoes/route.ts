import { AcaoAuditoria, type PermissaoPayload } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

/**
 * Cria ou atualiza uma permissão (via painel admin).
 *
 * @see {@link withApi}
 * @returns JSON com a permissão criada/atualizada.
 * @example
 * PATCH /api/admin/permissoes
 * { "perfilId": 1, "acao": "Editar", "recurso": "Usuario", "permitido": true }
 * @remarks Auditoria ({@link AcaoAuditoria.UPDATE}) e permissão {acao: "Alterar", recurso: "Permissoes"}.
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
    permissao: { acao: "Alterar", recurso: "Permissoes" },
  }
)

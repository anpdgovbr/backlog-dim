import { AcaoAuditoria } from "@anpdgovbr/shared-types"
import type { PermissaoPayload } from "@anpdgovbr/shared-types"

import { getPermissoesPorPerfil } from "@/helpers/permissoes-utils"
import { verificarPermissao, invalidatePermissionsCache } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

/**
 * Recupera permissões.
 *
 * @see {@link withApiSlimNoParams}
 * @returns JSON com a lista de permissões (por perfil ou do usuário autenticado).
 * @example GET /api/permissoes?perfilId=3
 * @remarks Sem auditoria; consulta simples e permissões derivadas do perfil.
 */
/**
 * Migrado para `withApi` (antes `withApiSlimNoParams`).
 */
export const GET = withApi(async ({ req, email }) => {
  const { searchParams } = new URL(req.url)
  const perfilId = searchParams.get("perfilId")

  if (perfilId) {
    // Restringe consulta de permissões por perfil a usuários autorizados
    const podeExibir = await verificarPermissao(email, "Exibir", "Permissoes")
    const podeAlterar = await verificarPermissao(email, "Alterar", "Permissoes")
    if (!podeExibir && !podeAlterar) {
      return Response.json({ error: "Acesso negado" }, { status: 403 })
    }

    const perfil = await prisma.perfil.findUnique({
      where: { id: Number(perfilId), active: true },
      select: { nome: true },
    })

    if (!perfil) {
      return Response.json(
        { error: "Perfil não encontrado ou desativado" },
        { status: 404 }
      )
    }

    const permissoes = await getPermissoesPorPerfil(perfil.nome)
    return Response.json(permissoes)
  }

  const usuario = await prisma.user.findUnique({
    where: { email, active: true },
    include: { perfil: { where: { active: true } } },
  })

  if (!usuario || !usuario.perfil) {
    return Response.json({ error: "Perfil não definido ou desativado" }, { status: 403 })
  }

  const permissoes = await getPermissoesPorPerfil(usuario.perfil.nome)
  return Response.json(permissoes)
})

/**
 * Cria ou atualiza uma permissão para um perfil.
 *
 * @see {@link withApi}
 * @returns JSON com a permissão criada/atualizada.
 * @example
 * POST /api/permissoes
 * { "perfilId": 1, "acao": "Exibir", "recurso": "Usuario", "permitido": true }
 * @remarks Auditoria ({@link AcaoAuditoria.CREATE}) e permissão {acao: "Alterar", recurso: "Permissoes"}.
 */
export const POST = withApi<PermissaoPayload>(
  async ({ req }) => {
    const { perfilId, acao, recurso, permitido }: PermissaoPayload = await req.json()

    if (!perfilId || !acao || !recurso || permitido === undefined) {
      return Response.json({ error: "Dados inválidos" }, { status: 400 })
    }

    const permissaoExistente = await prisma.permissao.findUnique({
      where: {
        perfilId_acao_recurso: { perfilId, acao, recurso },
      },
    })

    if (permissaoExistente && !permissaoExistente.active) {
      return Response.json(
        { error: "Permissão está desabilitada. Reative ou exclua manualmente." },
        { status: 409 }
      )
    }

    const novaPermissao = await prisma.permissao.upsert({
      where: { perfilId_acao_recurso: { perfilId, acao, recurso } },
      update: { permitido },
      create: { perfilId, acao, recurso, permitido },
    })

    // Invalida o cache de permissões para refletir alterações imediatamente
    invalidatePermissionsCache()

    return {
      response: Response.json(novaPermissao),
      audit: {
        antes: permissaoExistente ?? undefined,
        depois: novaPermissao,
      },
    }
  },
  {
    tabela: "permissao",
    acao: AcaoAuditoria.CREATE,
    permissao: { acao: "Alterar", recurso: "Permissoes" },
  }
)

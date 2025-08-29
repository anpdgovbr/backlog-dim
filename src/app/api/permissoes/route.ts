import { AcaoAuditoria } from "@anpdgovbr/shared-types"
import type { PermissaoPayload } from "@anpdgovbr/shared-types"

import { getPermissoesPorPerfil } from "@/helpers/permissoes-utils"
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Recupera permissões. Se `perfilId` for fornecido na query string,
 * retorna permissões daquele perfil; caso contrário, retorna permissões do
 * usuário autenticado (via email da sessão).
 * @example
 * GET /api/permissoes?perfilId=3
 */
export const GET = withApiSlimNoParams(async ({ req, email }) => {
  const { searchParams } = new URL(req.url)
  const perfilId = searchParams.get("perfilId")

  if (perfilId) {
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

// ✅ MÉTODO POST → Criar Nova Permissão com auditoria
/**
 * Cria ou atualiza uma permissão para um perfil.
 * Corpo esperado: { perfilId, acao, recurso, permitido }
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
    permissao: "Alterar_Permissoes",
  }
)

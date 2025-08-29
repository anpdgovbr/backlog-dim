/**
 * API de Permissões.
 *
 * Este arquivo define os handlers para a rota `/api/permissoes`, permitindo
 * recuperar permissões por perfil ou usuário autenticado, e criar/atualizar permissões.
 *
 * - GET: Retorna permissões do perfil informado ou do usuário autenticado.
 * - POST: Cria ou atualiza permissões para um perfil específico.
 *
 * @packageDocumentation
 */

import { AcaoAuditoria } from "@anpdgovbr/shared-types"
import type { PermissaoPayload } from "@anpdgovbr/shared-types"

import { getPermissoesPorPerfil } from "@/helpers/permissoes-utils"
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Handler para requisições GET na rota de permissões.
 *
 * Recupera permissões do perfil informado via query string (`perfilId`)
 * ou, se não informado, do usuário autenticado (identificado pelo e-mail da sessão).
 *
 * @param req - Request HTTP recebida.
 * @param email - E-mail do usuário autenticado.
 * @returns Response JSON com as permissões do perfil ou do usuário.
 *
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

/**
 * Handler para requisições POST na rota de permissões.
 *
 * Cria ou atualiza uma permissão para um perfil específico.
 * Espera no corpo da requisição: `{ perfilId, acao, recurso, permitido }`.
 * Realiza auditoria da operação.
 *
 * @param req - Request HTTP recebida.
 * @returns Response JSON com a permissão criada/atualizada e dados de auditoria.
 *
 * @example
 * POST /api/permissoes
 * Body: { "perfilId": 1, "acao": "Editar", "recurso": "Processo", "permitido": true }
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

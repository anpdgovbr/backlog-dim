import type { Prisma } from "@prisma/client"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"

/**
 * Corpo da requisição PATCH para atualizar associações do usuário.
 *
 * - perfilId: quando presente, conecta o usuário ao perfil com o ID informado.
 * - responsavelId: quando presente e numérico, conecta o usuário ao responsável;
 *   quando explicitamente null, desconecta o responsável do usuário.
 */
interface PatchRequestBody {
  perfilId?: number
  responsavelId?: number | null
}

/**
 * Atualiza dados do usuário por `id` (e.g., `responsavelId`, nome, email).
 *
 * @see {@link withApiForId}
 * @returns JSON com o usuário atualizado e auditoria.
 * @example PATCH /api/usuarios/123 { "responsavelId": 1 }
 * @remarks Auditoria ({@link AcaoAuditoria.UPDATE}) e permissão {acao: "Alterar", recurso: "Usuario"}.
 */
const handlerPATCH = withApiForId<{ id: string }>(
  async ({ req, params }) => {
    const { id } = params
    const { perfilId, responsavelId }: PatchRequestBody = await req.json()

    if (perfilId === undefined && responsavelId === undefined) {
      return Response.json(
        { error: "É necessário fornecer 'perfilId' ou 'responsavelId'" },
        { status: 400 }
      )
    }

    const usuarioAntes = await prisma.user.findUnique({ where: { id } })
    if (!usuarioAntes) {
      return Response.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const data: Prisma.UserUpdateInput = {}

    if (perfilId !== undefined) {
      data.perfil = { connect: { id: perfilId } }
    }

    if (responsavelId === null) {
      data.responsavel = { disconnect: true }
    } else if (responsavelId !== undefined) {
      data.responsavel = { connect: { id: responsavelId } }
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id },
      data,
    })

    return {
      response: Response.json({ success: true, usuario: usuarioAtualizado }),
      audit: {
        antes: usuarioAntes,
        depois: usuarioAtualizado,
      },
    }
  },
  {
    tabela: "user",
    acao: AcaoAuditoria.UPDATE,
    permissao: { acao: "Alterar", recurso: "Usuario" }, // @todo: adicionar essa permissão no banco de dados
  }
)

/**
 * Adaptador de rota para o verbo PATCH em /api/usuarios/{id}.
 *
 * Encaminha a Request e os parâmetros (contendo `id`) para o handler principal
 * `handlerPATCH` (que já aplica validação, atualização no banco e auditoria).
 *
 * @param req - Objeto Request recebido pelo App Router.
 * @param context - Contexto do App Router contendo `params` como Promise<{ id: string }>.
 * @returns Promise<Response> - Resposta produzida pelo handler (JSON), com o resultado da operação.
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPATCH(req, { params: await context.params })
}

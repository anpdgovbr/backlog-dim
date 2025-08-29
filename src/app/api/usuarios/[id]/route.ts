import type { Prisma } from "@prisma/client"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"

/**
 * Corpo esperado para requisições PATCH que atualizam um usuário.
 *
 * - perfilId: Identificador do perfil a ser conectado ao usuário. Quando presente,
 *   será usado para conectar o perfil via relação do Prisma.
 * - responsavelId:
 *   - número: conecta o usuário responsável com o id informado;
 *   - null: desconecta o campo `responsavel`;
 *   - undefined: não altera o campo `responsavel`.
 */
interface PatchRequestBody {
  perfilId?: number
  responsavelId?: number | null
}

/**
 * Handler principal para operações PATCH sobre /api/usuarios/[id].
 *
 * Comportamento:
 * - Valida que ao menos `perfilId` ou `responsavelId` estejam presentes no corpo.
 * - Busca o usuário atual (antes) e, se existir, aplica as alterações via Prisma.
 * - Prepara objeto de auditoria com `antes` e `depois` contendo o estado do usuário
 *   anterior e posterior à atualização.
 *
 * @returns Objeto com `response` (instância de Response) e `audit` utilizado pelo wrapper `withApiForId`.
 * @throws Não lança explicitamente — erros internos são propagados para o wrapper que lida com resposta/auditoria.
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
    permissao: "Alterar_Usuario", // @todo: adicionar essa permissão no banco de dados
  }
)

/**
 * Função exportada usada pelo App Router do Next.js para tratar requisições PATCH.
 *
 * Encapsula `handlerPATCH`, aguardando os params da rota (fornecidos como Promise)
 * e repassando-os ao handler. Retorna diretamente a Response produzida pelo handler.
 *
 * @param req Requisição HTTP recebida pelo endpoint.
 * @param context Objeto com `params` (Promise<{ id: string }>) provendo o id do usuário.
 * @returns Response construida pelo handler (`handlerPATCH`).
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPATCH(req, { params: await context.params })
}

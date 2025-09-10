// app/api/permissoes/toggle/route.ts
import { withApi } from "@anpdgovbr/rbac-next"
import { prisma } from "@/lib/prisma"
import { getIdentity, rbacProvider, auditLog } from "@/rbac/server"
import type { AcaoPermissao, RecursoPermissao } from "@prisma/client"

/**
 * Endpoint POST /api/permissoes/toggle
 *
 * Alterna (cria/atualiza) uma permissão para um perfil.
 *
 * Espera um corpo JSON com:
 * {
 *   profileIdOrName: number | string, // id numérico do perfil ou nome do perfil
 *   acao: string,                     // nome da ação (ex.: "Alterar")
 *   recurso: string,                  // nome do recurso (ex.: "Permissoes")
 *   permitido: boolean                // verdadeiro para permitir, falso para negar
 * }
 *
 * Comportamento:
 * - Resolve o perfil indicado (por id ou por nome). Retorna 404 se não encontrado.
 * - Realiza upsert na tabela `permissao` (cria ou atualiza o campo `permitido`).
 * - Registra entrada de auditoria via `auditLog` com antes/depois.
 *
 * Respostas:
 * - 200: { ok: true } — permissão atualizada com sucesso.
 * - 400: { error: "..." } — body inválido ou campos obrigatórios ausentes.
 * - 404: { error: "Perfil não encontrado" } — perfil não localizado.
 *
 * Autorização:
 * - Requer a permissão RBAC { acao: "Alterar", recurso: "Permissoes" } fornecida pelo `rbacProvider`.
 *
 * Observações:
 * - Não altera outros campos além de `permitido`.
 * - O endpoint faz parsing seguro do body e valida presença mínima dos campos.
 */
export const POST = withApi(
  async ({ req, email, userId }: { req: Request; email: string; userId?: string }) => {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return Response.json({ error: "Body inválido" }, { status: 400 })
    }
    const { profileIdOrName, acao, recurso, permitido } = body as {
      profileIdOrName: string | number
      acao: string
      recurso: string
      permitido: boolean
    }
    if (!profileIdOrName || !acao || !recurso || typeof permitido !== "boolean") {
      return Response.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    // Resolver perfil
    let perfil: { id: number; nome: string } | null
    if (/^\d+$/.test(String(profileIdOrName))) {
      perfil = await prisma.perfil.findUnique({
        where: { id: Number(profileIdOrName) },
        select: { id: true, nome: true },
      })
    } else {
      perfil = await prisma.perfil.findUnique({
        where: { nome: String(profileIdOrName) },
        select: { id: true, nome: true },
      })
    }
    if (!perfil) return Response.json({ error: "Perfil não encontrado" }, { status: 404 })

    // Upsert permissão
    const data = {
      perfilId: perfil.id,
      acao: acao as AcaoPermissao,
      recurso: recurso as RecursoPermissao,
      permitido,
    }
    const before = await prisma.permissao.findUnique({
      where: {
        perfilId_acao_recurso: {
          perfilId: perfil.id,
          acao: acao as AcaoPermissao,
          recurso: recurso as RecursoPermissao,
        },
      },
    })
    const saved = await prisma.permissao.upsert({
      where: {
        perfilId_acao_recurso: {
          perfilId: perfil.id,
          acao: acao as AcaoPermissao,
          recurso: recurso as RecursoPermissao,
        },
      },
      update: { permitido },
      create: data,
      select: { id: true, permitido: true },
    })

    await auditLog({
      tabela: "Permissao",
      acao: "PATCH",
      userId,
      email,
      antes: before ?? undefined,
      depois: saved,
      contexto: req.url,
    })
    return Response.json({ ok: true })
  },
  {
    provider: rbacProvider,
    getIdentity,
    permissao: { acao: "Alterar", recurso: "Permissoes" },
  }
)

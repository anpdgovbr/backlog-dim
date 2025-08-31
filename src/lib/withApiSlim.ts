/**
 * @fileoverview
 * Wrappers "slim" para rotas de API que exigem apenas autenticação e autorização (RBAC)
 * com pares `{ acao, recurso }`, sem necessidade de sessão completa.
 *
 * @remarks
 * Usa `PermissionsMap` e o helper `pode` de `@/lib/permissions` para checagem de acesso.
 *
 * @deprecated Planeja-se unificar com `withApi` em uma única API que suporte
 * execução "slim" via opções, evitando duplicação de lógica.
 */
// lib/withApiSlim.ts
import { getServerSession } from "next-auth/next"
import type { NextRequest } from "next/server"

import type { AcaoPermissao, RecursoPermissao } from "@anpdgovbr/shared-types"

import { authOptions } from "@/config/next-auth.config"
import { buscarPermissoesConcedidas } from "@/lib/permissoes"
import { pode } from "@/lib/permissions"

/**
 * Contexto fornecido para handlers "slim".
 *
 * @typeParam TParams - Tipo do objeto de parâmetros.
 * @property req - Requisição original (`Request`/`NextRequest`).
 * @property email - Email do usuário autenticado.
 * @property userId - Identificador do usuário (quando presente).
 * @property params - Parâmetros resolvidos da rota.
 */
/**
 * Contexto fornecido para handlers "slim".
 * @deprecated Preferir a API unificada de `withApi` quando disponível.
 */
export type SlimHandlerContext<TParams extends object = object> = {
  req: Request | NextRequest
  email: string
  userId?: string
  params: TParams
}

/**
 * Handler enxuto para rotas que não precisam da sessão completa.
 *
 * @typeParam TParams - Tipo do objeto de parâmetros.
 * @param ctx - {@link SlimHandlerContext} com `req`, `email`, `userId` e `params`.
 */
/**
 * Handler enxuto para rotas que não precisam da sessão completa.
 * @deprecated Preferir a API unificada de `withApi` quando disponível.
 */
export type SlimHandler<TParams extends object = object> = (
  ctx: SlimHandlerContext<TParams>
) => Promise<Response>

/**
 * Centraliza a execução de rotas "slim": autenticação, autorização (RBAC) e execução do handler.
 *
 * @typeParam TParams - Tipo do objeto de parâmetros.
 * @param req - Requisição original.
 * @param handler - Handler a ser executado caso autorizado.
 * @param permissao - Par `{ acao, recurso }` requerido, quando aplicável.
 * @param params - Parâmetros resolvidos da rota (quando existirem).
 * @returns `Response` com erro apropriado (401/403) ou a resposta do `handler`.
 */
/**
 * Executa autenticação e autorização básicas e chama o handler fornecido.
 * @deprecated Função interna transitória; use `withApi` quando a unificação ocorrer.
 */
async function handleApiRequestSlim<TParams extends object = object>(
  req: Request | NextRequest,
  handler: SlimHandler<TParams>,
  permissao?: { acao: AcaoPermissao; recurso: RecursoPermissao },
  params?: TParams
): Promise<Response> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  const email = session.user.email
  const userId = session.user.id

  if (permissao) {
    const permissoes = await buscarPermissoesConcedidas(email)
    const { acao, recurso } = permissao
    if (!pode(permissoes, acao, recurso)) {
      return Response.json({ error: "Acesso negado" }, { status: 403 })
    }
  }

  return handler({ req, email, userId, params: (params ?? {}) as TParams })
}

/*
 * Wrapper para rotas slim com params.
 * O handler deve receber o segundo argumento como um objeto com os params.
 * O primeiro argumento é sempre o req.
 */
/**
 * Wrapper para rotas Next que recebem `params` (por exemplo, rotas dinâmicas).
 *
 * @typeParam TParams - Tipo do objeto de parâmetros dinâmicos.
 * @param handler - Handler a ser executado com o contexto slim.
 * @param permissao - Par `{ acao, recurso }` requerido, quando aplicável.
 * @example
 * ```ts
 * export const GET = withApiSlim(async ({ params }) => {
 *   return Response.json({ ok: true, id: params.id })
 * }, { acao: 'Exibir', recurso: 'Usuario' })
 * ```
 */
/**
 * Wrapper para rotas Next que recebem `params` (por exemplo, rotas dinâmicas).
 * @deprecated Prefira `withApi` quando a API unificada estiver disponível.
 */
export function withApiSlim<TParams extends object = Record<string, unknown>>(
  handler: SlimHandler<TParams>,
  permissao?: { acao: AcaoPermissao; recurso: RecursoPermissao }
) {
  return async function (
    req: Request | NextRequest,
    context: { params: TParams | Promise<TParams> }
  ): Promise<Response> {
    const resolvedParams = await context.params
    return handleApiRequestSlim(req, handler, permissao, resolvedParams)
  }
}

/*
 * Wrapper para rotas slim SEM params.
 * O handler não deve receber o segundo argumento.
 * O primeiro argumento é sempre o req.
 */
/**
 * Wrapper para rotas que não recebem `params`.
 *
 * @param handler - Handler a ser executado com o contexto slim (sem params).
 * @param permissao - Par `{ acao, recurso }` requerido, quando aplicável.
 * @example
 * ```ts
 * export const GET = withApiSlimNoParams(async ({ email }) => {
 *   return Response.json({ hello: email })
 * }, { acao: 'Exibir', recurso: 'Usuario' })
 * ```
 */
/**
 * Wrapper para rotas sem `params`.
 * @deprecated Prefira `withApi` quando a API unificada estiver disponível.
 */
export function withApiSlimNoParams(
  handler: SlimHandler<Record<string, never>>,
  permissao?: { acao: AcaoPermissao; recurso: RecursoPermissao }
) {
  return async function (req: Request | NextRequest): Promise<Response> {
    return handleApiRequestSlim(req, handler, permissao, {})
  }
}

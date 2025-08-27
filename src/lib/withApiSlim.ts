// lib/withApiSlim.ts
import type { Session } from "next-auth"
import { getServerSession } from "next-auth/next"
import type { NextRequest } from "next/server"

import type { PermissaoConcedida } from "@anpdgovbr/shared-types"

import { authOptions } from "@/config/next-auth.config"
import { buscarPermissoesConcedidas, pode } from "@/lib/permissoes"

/**
 * Contexto fornecido para handlers "slim".
 */
export type SlimHandlerContext<TParams extends object = object> = {
  req: Request | NextRequest
  email: string
  userId?: string
  params: TParams
}

/**
 * Tipo de handler enxuto para rotas que não precisam da sessão completa.
 * Recebe um contexto com `req`, `email`, `userId` e `params`.
 */
export type SlimHandler<TParams extends object = object> = (
  ctx: SlimHandlerContext<TParams>
) => Promise<Response>

/**
 * Centraliza a execução da API Slim.
 */
/**
 * Centraliza a execução de rotas "slim": verifica autenticação, busca
 * permissões (quando necessário) e executa o handler.
 *
 * Retorna `Response.json({ error })` com os códigos HTTP apropriados quando o
 * usuário não está autenticado ou não possui permissão.
 */
async function handleApiRequestSlim<TParams extends object = object>(
  req: Request | NextRequest,
  handler: SlimHandler<TParams>,
  permissao?: PermissaoConcedida,
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
    if (!pode(permissoes, permissao)) {
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
 * Wrapper para rotas Next que recebem `params` (por exemplo rotas dinâmicas).
 *
 * @example
 * export const GET = withApiSlim(async ({ req, email, params }) => {
 *   // params.id etc
 *   return new Response(JSON.stringify({ ok: true }))
 * })
 */
export function withApiSlim<TParams extends object = Record<string, unknown>>(
  handler: SlimHandler<TParams>,
  permissao?: PermissaoConcedida
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
 * Wrapper para rotas que não recebem params.
 *
 * @example
 * export const GET = withApiSlimNoParams(async ({ req, email }) => {
 *   return new Response(JSON.stringify({ hello: email }))
 * })
 */
export function withApiSlimNoParams(
  handler: SlimHandler<Record<string, never>>,
  permissao?: PermissaoConcedida
) {
  return async function (req: Request | NextRequest): Promise<Response> {
    return handleApiRequestSlim(req, handler, permissao, {})
  }
}

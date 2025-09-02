/**
 * @fileoverview
 * Wrappers utilitários para rotas de API que centralizam autenticação, autorização (RBAC)
 * baseada em pares `{ acao, recurso }` e registro de auditoria.
 *
 * @remarks
 * A autorização utiliza um `PermissionsMap` (ver `@/lib/permissions`) e o helper `pode`.
 * Quando `options.permissao` é informado, a rota só é executada se o par
 * `{ acao, recurso }` estiver permitido para o usuário autenticado.
 *
 * Futuro: unificação com `withApiSlim`. `withApi` deve suportar cenários "slim"
 * (sem sessão completa) por meio de opções, permitindo deprecar `withApiSlim`.
 */
// lib/withApi.ts
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import type { NextRequest } from "next/server"

import type {
  AcaoAuditoria,
  AcaoPermissao,
  RecursoPermissao,
} from "@anpdgovbr/shared-types"

import { authOptions } from "@/config/next-auth.config"
import { registrarAuditoria } from "@/helpers/auditoria-server"
import { pode, type Action, type Resource } from "@anpdgovbr/rbac-core"
import { buscarPermissoesConcedidas } from "@/lib/permissoes"

/**
 * Contexto passado para handlers configurados com `withApi`.
 *
 * @typeParam TParams - Tipo do objeto de parâmetros (por exemplo, de rotas dinâmicas).
 * @typeParam TExtra - Dados extras opcionais a serem mesclados ao contexto.
 * @property req - Requisição original (`Request`/`NextRequest`).
 * @property session - Sessão do NextAuth (quando disponível).
 * @property email - Email do usuário autenticado.
 * @property userId - Identificador do usuário autenticado (quando disponível).
 * @property params - Parâmetros resolvidos da rota.
 */
export type HandlerContext<TParams extends object = object, TExtra = object> = {
  req: Request | NextRequest
  session: Awaited<ReturnType<typeof getServerSession>>
  email: string
  userId?: string
  params: TParams
} & TExtra

/**
 * Função handler para rotas que usam `withApi`.
 *
 * @typeParam TParams - Tipo do objeto de parâmetros.
 * @typeParam TExtra - Dados extras opcionalmente adicionados ao contexto.
 * @param ctx - {@link HandlerContext} com dados de requisição, sessão e permissões.
 * @returns `Response` ou `{ response, audit? }` para integração com auditoria.
 */
export type Handler<TParams extends object = object, TExtra = object> = (
  ctx: HandlerContext<TParams, TExtra>
) => Promise<
  | Response
  | {
      response: Response
      audit?: {
        antes?: object
        depois?: object
      }
    }
>

/**
 * Opções para `withApi`/`withApiForId`.
 *
 * @typeParam TParams - Tipo do objeto de parâmetros.
 * @property tabela - Nome da tabela/entidade de auditoria ou função baseada em `params`.
 * @property acao - Ação de auditoria (enum {@link AcaoAuditoria}).
 * @property permissao - Par `{ acao, recurso }` exigido para a rota (RBAC).
 * @remarks
 * Quando `permissao` é informada, a autorização verifica `pode(perms, acao, recurso)`
 * usando um `PermissionsMap` derivado do perfil do usuário.
 */
export interface WithApiOptions<TParams extends object = object> {
  tabela?: string | ((params: TParams) => string)
  acao?: (typeof AcaoAuditoria)[keyof typeof AcaoAuditoria]
  permissao?: { acao: AcaoPermissao; recurso: RecursoPermissao }
}

// Função central de execução
async function handleApiRequest<TParams extends object = object, TExtra = object>(
  req: Request | NextRequest,
  handler: Handler<TParams, TExtra>,
  options?: WithApiOptions<TParams>,
  params: TParams = {} as TParams
): Promise<Response> {
  const session = (await getServerSession(authOptions)) as Session | null

  if (!session?.user?.email) {
    return Response.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  const email = session.user.email
  const userId = session.user.id

  if (options?.permissao) {
    const permissoes = await buscarPermissoesConcedidas(email)
    const { acao, recurso } = options.permissao
    if (!pode(permissoes, acao as unknown as Action, recurso as unknown as Resource)) {
      return Response.json({ error: "Acesso negado" }, { status: 403 })
    }
  }

  const result = await handler({
    req,
    session,
    email,
    userId,
    params,
  } as HandlerContext<TParams, TExtra>)

  let response: Response
  let audit: { antes?: object; depois?: object } = {}

  if (result instanceof Response) {
    response = result
  } else {
    response = result.response
    audit = result.audit ?? {}
  }

  if (options?.tabela && options?.acao) {
    const nomeTabela =
      typeof options.tabela === "function" ? options.tabela(params) : options.tabela

    await registrarAuditoria({
      tabela: nomeTabela,
      acao: options.acao,
      userId,
      email,
      contexto: req.url,
      req,
      ...audit,
    })
  }

  return response
}

/**
 * Wrapper para rotas API que trata autenticação, autorização (RBAC) e auditoria.
 *
 * @typeParam TParams - Tipo do objeto de parâmetros.
 * @typeParam TExtra - Dados extras opcionais no contexto do handler.
 * @param handler - Função a ser executada quando autorizado.
 * @param options - {@link WithApiOptions} incluindo `permissao?: { acao, recurso }`.
 * @example
 * ```ts
 * export const GET = withApi(async ({ email }) => {
 *   return Response.json({ message: `Hello ${email}` })
 * }, { permissao: { acao: 'Exibir', recurso: 'Processo' } })
 * ```
 * @see withApiForId
 */
export function withApi<TParams extends object = object, TExtra = object>(
  handler: Handler<TParams, TExtra>,
  options?: WithApiOptions<TParams>
) {
  return async function (req: Request | NextRequest): Promise<Response> {
    return handleApiRequest<TParams, TExtra>(req, handler, options)
  }
}

/**
 * Wrapper para rotas que recebem `params` (por exemplo, `[id]`).
 *
 * @typeParam TParams - Tipo do objeto de parâmetros dinâmicos.
 * @typeParam TExtra - Dados extras opcionais no contexto do handler.
 * @param handler - Handler da rota.
 * @param options - {@link WithApiOptions} incluindo `permissao` em `{acao,recurso}`.
 * @example
 * ```ts
 * export const PATCH = withApiForId(async ({ params, req }) => {
 *   const id = params.id
 *   // ...
 *   return new Response(null, { status: 204 })
 * }, { permissao: { acao: 'Editar', recurso: 'Usuario' } })
 * ```
 * @remarks
 * Considerar no futuro a fusão com `withApi` via assinatura única.
 */
export function withApiForId<TParams extends object = object, TExtra = object>(
  handler: Handler<TParams, TExtra>,
  options?: WithApiOptions<TParams>
) {
  return async function (
    req: Request | NextRequest,
    context: { params: TParams | Promise<TParams> }
  ): Promise<Response> {
    const resolvedParams = await context.params
    return handleApiRequest(req, handler, options, resolvedParams)
  }
}

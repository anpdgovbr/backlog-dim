// lib/withApi.ts
import { authOptions } from "@/config/next-auth.config"
import { registrarAuditoria } from "@/lib/helpers/auditoria-server"
import { buscarPermissoesConcedidas, pode } from "@/lib/permissoes"
import type { PermissaoConcedida } from "@anpd/shared-types"
import type { AcaoAuditoria } from "@prisma/client"
import { getServerSession } from "next-auth"
import type { NextRequest } from "next/server"

type HandlerContext<TParams extends object = object, TExtra = object> = {
  req: Request | NextRequest
  session: Awaited<ReturnType<typeof getServerSession>>
  email: string
  userId?: string
  params: TParams
} & TExtra

type Handler<TParams extends object = object, TExtra = object> = (
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

type WithApiOptions<TParams extends object = object> = {
  tabela?: string | ((params: TParams) => string)
  acao?: AcaoAuditoria
  permissao?: PermissaoConcedida
}

// Função central de execução
async function handleApiRequest<TParams extends object = object, TExtra = object>(
  req: Request | NextRequest,
  handler: Handler<TParams, TExtra>,
  options?: WithApiOptions<TParams>,
  params: TParams = {} as TParams
): Promise<Response> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  const email = session.user.email
  const userId = session.user.id

  if (options?.permissao) {
    const permissoes = await buscarPermissoesConcedidas(email)
    if (!pode(permissoes, options.permissao)) {
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

// Wrapper para rotas padrão
export function withApi<TParams extends object = object, TExtra = object>(
  handler: Handler<TParams, TExtra>,
  options?: WithApiOptions<TParams>
) {
  return async function (req: Request | NextRequest): Promise<Response> {
    return handleApiRequest<TParams, TExtra>(req, handler, options)
  }
}

// Wrapper para rotas com params
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

import type { NextRequest } from "next/server"

/**
 * Cria um módulo de mock para `@/lib/withApi` a ser usado com `vi.mock`.
 * Exemplo:
 * vi.mock("@/lib/withApi", () => withApiMockModule())
 */
export function withApiMockModule() {
  function withApi<TParams extends object = object, TExtra = object>(
    handler: (ctx: {
      req: Request | NextRequest
      params: TParams
      email: string
      userId?: string
      session: object
    }) => Promise<Response | { response: Response }>
  ) {
    return async (req: Request | NextRequest): Promise<Response> => {
      const result = await handler({
        req,
        params: {} as unknown as TParams,
        email: "tester@example.com",
        userId: "u-1",
        session: {},
      })
      return result instanceof Response ? result : result.response
    }
  }

  function withApiForId<TParams extends object = object, TExtra = object>(
    handler: (ctx: {
      req: Request | NextRequest
      params: TParams
      email: string
      userId?: string
      session: object
    }) => Promise<Response | { response: Response }>
  ) {
    return async (
      req: Request | NextRequest,
      context: { params: TParams | Promise<TParams> }
    ): Promise<Response> => {
      const params = await context.params
      const result = await handler({
        req,
        params,
        email: "tester@example.com",
        userId: "u-1",
        session: {},
      })
      return result instanceof Response ? result : result.response
    }
  }

  return { withApi, withApiForId }
}

/**
 * Cria um módulo de mock para `@anpdgovbr/rbac-next` (only withApi).
 * Exemplo:
 * vi.mock("@anpdgovbr/rbac-next", () => withApiRbacNextMockModule())
 */
export function withApiRbacNextMockModule() {
  function withApi<TParams extends object = object, TExtra = object>(
    handler: (ctx: {
      req: Request
      params: TParams
    }) => Promise<Response | { response: Response }>
  ) {
    return async (req: Request): Promise<Response> => {
      const result = await handler({ req, params: {} as unknown as TParams })
      return result instanceof Response ? result : result.response
    }
  }
  return { withApi }
}

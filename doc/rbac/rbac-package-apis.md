# APIs Públicas dos Pacotes RBAC

Este documento especifica as interfaces e funções esperadas de cada pacote.

## `@org/rbac-core`

```ts
// Tipos base
export type Action = string
export type Resource = string

export type PermissionsMap = Partial<
  Record<Action, Partial<Record<Resource, boolean>>>
>

export function toPermissionsMap(list?: Array<{ acao: Action; recurso: Resource; permitido: boolean } | null>): PermissionsMap
export function pode(perms: PermissionsMap, acao: Action, recurso: Resource): boolean
export function hasAny(perms: PermissionsMap, pairs: Array<readonly [Action, Resource]>): boolean
```

## `@org/rbac-provider`

```ts
import type { PermissionsMap } from '@org/rbac-core'

export interface PermissionsProvider {
  getPermissionsByIdentity(identity: string): Promise<PermissionsMap>
  invalidate(identity?: string): void
}

export interface Identity {
  id: string
  email?: string
}

export interface IdentityResolver<Req = any> {
  resolve(req: Req): Promise<Identity>
}

// Decorator de cache TTL
export function withTTLCache(provider: PermissionsProvider, ttlMs: number): PermissionsProvider
```

## `@org/rbac-prisma`

```ts
import { PrismaClient } from '@prisma/client'
import type { PermissionsProvider } from '@org/rbac-provider'

export type PrismaRbacOptions = {
  prisma: PrismaClient
  // Nomes de tabelas/campos podem variar; permitir mapear.
  tables?: {
    perfil?: string
    permissao?: string
    perfilHeranca?: string
  }
}

export function createPrismaPermissionsProvider(opts: PrismaRbacOptions): PermissionsProvider

// Util de herança (opcional exportado)
export async function getPerfisHerdadosNomes(prisma: PrismaClient, perfilNome: string): Promise<string[]>
```

## `@org/rbac-next`

```ts
import type { PermissionsProvider, IdentityResolver } from '@org/rbac-provider'
import type { Action, Resource } from '@org/rbac-core'

export type WithApiOptions<TParams extends object = object> = {
  tabela?: string | ((params: TParams) => string)
  acao?: string // ou enum definido pelo app
  permissao?: { acao: Action; recurso: Resource }
  getIdentity?: IdentityResolver<Request>
  provider: PermissionsProvider
  audit?: (args: { tabela?: string; acao?: string; userId?: string; email?: string; antes?: object; depois?: object; contexto?: string; req: Request }) => Promise<void> | void
}

export type HandlerContext<TParams extends object = object> = {
  req: Request
  email: string
  userId?: string
  params: TParams
}

export type Handler<TParams extends object = object> = (ctx: HandlerContext<TParams>) => Promise<Response | { response: Response; audit?: { antes?: object; depois?: object } }>

export function withApi<TParams extends object = object>(handler: Handler<TParams>, options: WithApiOptions<TParams>): (req: Request) => Promise<Response>
export function withApiForId<TParams extends object = object>(handler: Handler<TParams>, options: WithApiOptions<TParams>): (req: Request, ctx: { params: TParams | Promise<TParams> }) => Promise<Response>
```

## `@org/rbac-react`

```ts
import type { Action, Resource, PermissionsMap } from '@org/rbac-core'

export type PermissionsClientOptions = {
  endpoint?: string // default: '/api/permissoes'
  fetcher?: (url: string) => Promise<any>
  initial?: PermissionsMap // hydration opcional
}

export function PermissionsProvider({ children, value }: { children: React.ReactNode; value: PermissionsMap }): JSX.Element
export function usePermissions(opts?: PermissionsClientOptions): { permissoes: PermissionsMap; loading: boolean; error?: any }
export function usePode(): { pode: (acao: Action, recurso: Resource) => boolean; loading: boolean }
export function withPermissao<T>(Component: React.ComponentType<T>, acao: Action, recurso: Resource, opts?: { redirect?: boolean }): React.ComponentType<T>
```

## Auditoria (callback)

- A auditoria não faz parte do core. O pacote `@org/rbac-next` apenas chama uma função `audit` se fornecida.
- Projetos podem plugar seus registradores (ex.: Prisma, Log, Datadog, etc.).


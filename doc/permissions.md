# Permissões e Perfis (RBAC)

Este documento descreve como o RBAC está integrado no projeto usando os pacotes `@anpdgovbr/rbac-*`, como proteger rotas, consumir permissões no cliente e (opcionalmente) operar a UI administrativa.

## Conceitos

- Perfil: agrupa permissões e é associado ao `User` (`User.perfilId`).
- Permissão: par `{ acao, recurso }` com flag `permitido` atrelado a um perfil.
- RBAC: as rotas exigem permissões específicas para executar ações.

## Pacotes RBAC

- `@anpdgovbr/rbac-core`: tipos e utilitários (`PermissionsMap`, `toPermissionsMap`, `pode`, `hasAny`).
- `@anpdgovbr/rbac-provider`: contrato do provider e `withTTLCache` (cache em memória por identidade).
- `@anpdgovbr/rbac-prisma`: provider baseado em Prisma + helpers (`getPerfisHerdadosNomes`, `getPermissoesPorPerfil`).
- `@anpdgovbr/rbac-next`: wrappers `withApi`/`withApiForId` para proteger rotas (Next.js App Router).
- `@anpdgovbr/rbac-react`: `PermissionsProvider`, `usePermissions`, `usePode`, `withPermissao` (UX no cliente).
- `@anpdgovbr/rbac-admin` (opt‑in): UI administrativa mínima (Perfis/Permissões; Usuários opcional).

Observação: Prisma é opcional. Qualquer fonte pode prover um `PermissionsProvider` que implemente o contrato de `@anpdgovbr/rbac-provider`.

## Modelo de Dados (Prisma)

- `Perfil { id, nome, active }`
- `Permissao { id, perfilId, acao, recurso, permitido }`
- `PerfilHeranca { parentId, childId }` (opcional para herança entre perfis; direção: filho herda dos pais)
- `User { id, email, perfilId }`

Recomendado usar enums Prisma (`AcaoPermissao`, `RecursoPermissao`) para evitar typos em `Permissao`.

## Configuração no Servidor

Arquivo de bootstrap RBAC no servidor: `src/rbac/server.ts`.

- Provider com cache TTL (ex.: 60s):

```ts
import { withTTLCache } from "@anpdgovbr/rbac-provider"
import { createPrismaPermissionsProvider } from "@anpdgovbr/rbac-prisma"
import { prisma } from "@/lib/prisma"

export const rbacProvider = withTTLCache(
  createPrismaPermissionsProvider({ prisma }),
  60_000
)
```

- Resolvedor de identidade (NextAuth no exemplo):

```ts
import type { IdentityResolver } from "@anpdgovbr/rbac-provider"

export const getIdentity: IdentityResolver<Request> = {
  async resolve(req) {
    // Obter sessão e retornar { id, email }
  },
}
```

- Auditoria (opcional): função `auditLog(args)` para uso nos wrappers.

## Proteção de Rotas (Next.js)

Use `withApi`/`withApiForId` de `@anpdgovbr/rbac-next` com `permissao: { acao, recurso }`.

```ts
import { withApi } from "@anpdgovbr/rbac-next"
import { rbacProvider, getIdentity, auditLog } from "@/rbac/server"

export const POST = withApi(
  async ({ req, email, userId }) => {
    // handler
    return Response.json({ ok: true })
  },
  {
    permissao: { acao: "Alterar", recurso: "Permissoes" },
    provider: rbacProvider,
    getIdentity,
    audit: ({ tabela = "Permissao", ...ctx }) => auditLog({ tabela, ...ctx }),
  }
)
```

## Endpoints disponíveis (admin/integração)

- `GET /api/perfis` — lista perfis ativos (requer `{ Exibir, Permissoes }`).
- `POST /api/perfis` — cria perfil (requer `{ Cadastrar, Permissoes }`).
- `GET /api/permissoes` —
  - sem query: permissões do usuário autenticado (expandido em lista).
  - `?perfil=<id|nome>`: permissões efetivas do perfil (com herança, se houver).
  - requer `{ Exibir, Permissoes }`.
- `POST /api/permissoes` — upsert explícito (requer `{ Cadastrar, Permissoes }`).
- `POST /api/permissoes/toggle` — alterna `permitido` (requer `{ Alterar, Permissoes }`).
- Herança de perfis (quando habilitado): `GET/POST/DELETE /api/perfis/heranca`.

Boas práticas de cache: após alterações administrativas (criar/toggle permissões, herança), invalide o cache com `rbacProvider.invalidate()` para refletir a mudança imediatamente.

## Consumo no Cliente (React)

- Via contexto (quando permissões vêm do servidor) ou via endpoint:

```tsx
import {
  PermissionsProvider,
  usePermissions,
  usePode,
  withPermissao,
} from "@anpdgovbr/rbac-react"

// Hidratar permissões do servidor
;<PermissionsProvider value={serverPermissions}>{children}</PermissionsProvider>

// Hook com fetch automático (fallback para endpoint)
const { permissoes, loading, error } = usePermissions({ endpoint: "/api/permissoes" })

// Verificação declarativa
const { pode } = usePode()
if (pode("Exibir", "Dashboard")) {
  /* ... */
}

// HOC para proteger componente/página
export default withPermissao(MyPage, "Exibir", "Relatorios")
```

## UI Administrativa (opt‑in)

É possível habilitar a UI mínima em `/rbac-admin` usando `@anpdgovbr/rbac-admin`.

- A UI espera endpoints de perfis e permissões (listagem/toggle).
- Endpoints de usuários (listar/atribuir perfil) são opcionais e podem ser adicionados depois.
- DTOs de integração estão em `@anpdgovbr/shared-types`.

Exemplo (ver `src/app/rbac-admin/page.tsx`):

```tsx
import RbacAdminShell from "@anpdgovbr/rbac-admin"

export default function Page() {
  return (
    <RbacAdminShell
      config={{
        endpoints: {
          profiles: "/api/perfis",
          permissions: (id) => `/api/permissoes?perfil=${id}`,
          toggle: "/api/permissoes/toggle",
          // users?: "/api/users" (opcional)
          // assignUserProfile?: "/api/users/assign-profile" (opcional)
        },
      }}
    />
  )
}
```

## Consulta/Aggregação de Permissões

- Servidor: `getPermissoesPorPerfil(prisma, perfilNome)` (de `@anpdgovbr/rbac-prisma`) — inclui herança via `PerfilHeranca`, quando configurada.
- Provider: `createPrismaPermissionsProvider` resolve permissões do usuário (email/id) e retorna `PermissionsMap`.
- Cliente: `toPermissionsMap` converte listas (ex.: do endpoint) para `PermissionsMap`.

Regra de união na herança: concessões (`permitido: true`) prevalecem sobre negações (`false`).

## Observações e Boas Práticas

- Prefira enums Prisma (`AcaoPermissao`, `RecursoPermissao`) para evitar typos.
- Invalide cache (`rbacProvider.invalidate()`) após mudanças administrativas.
- `withPermissao` é apenas UX; a segurança real está no servidor (wrappers `withApi`).
- Prisma é opcional: qualquer fonte pode prover um `PermissionsProvider` equivalente.

## ABAC (quando aplicável)

Para casos de “editar o próprio registro”, combine RBAC com verificação de atributos no handler (ex.: checar `responsavel.userId === userId`). Um exemplo existe em `PUT /api/processos/[id]`.

## Estado Atual (2025‑09‑01)

- Wrappers `withApi`/`withApiForId` em uso com `permissao: { acao, recurso }`.
- Provider `@anpdgovbr/rbac-prisma` com cache TTL ativo.
- Endpoints e UI de permissões ativos; herança opcional via `PerfilHeranca`.

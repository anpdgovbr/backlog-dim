# Arquitetura de Permissionamento (RBAC) — Proposta de Extração

## Objetivos

- Unificar o modelo de permissões por par `{acao, recurso}` (RBAC simples).
- Tornar reutilizável em múltiplos sistemas (Next.js, Express, etc.).
- Evitar divergência entre UI e servidor (fonte única de verdade).
- Permitir adapters (ex.: Prisma, NextAuth) sem acoplamento ao core.

## Visão Geral

Arquitetura em pacotes separados (monorepo) com responsabilidades claras:

- `@org/rbac-core`: tipos genéricos, `PermissionsMap`, `pode`, `hasAny`, conversores.
- `@org/rbac-provider`: contratos `PermissionsProvider`, `IdentityResolver`, util de cache TTL opcional.
- `@org/rbac-prisma`: adapter Prisma (consulta, herança de perfis, união por grant verdadeiro).
- `@org/rbac-next`: adapter Next (wrappers `withApi`, `withApiForId`, auditoria plugável).
- `@org/rbac-react`: hooks/HOC (`usePermissions`, `usePode`, `withPermissao`) desacoplados, por configuração.

Opcional/Futuro:

- `@org/rbac-express`: middlewares Express/Fastify com o mesmo contrato.
- `@org/rbac-memory`: provider em memória para testes ou ambientes sem DB.

## Por que Monorepo (não multi-repo)?

- Desenvolvimento mais rápido: mudanças coordenadas em APIs entre pacotes.
- Versionamento coeso com publicação por pacote (independente) via workspaces.
- Reduz overhead de CI/CD e sincronização de issues/PRs.

Se necessário, qualquer pacote pode ser destacado para repositório próprio posteriormente.

## Princípios

- Core sem dependências de framework ou banco.
- Adapters finos: cada integração fornece apenas o que o core exige.
- Configuração por injeção (DI leve): identity, provider, cache.
- Segurança no servidor; cliente apenas para UX (não confiar).

## Pacotes e Responsabilidades

### `@org/rbac-core`
- Tipos: `PermissionsMap`, `Action`, `Resource` (strings genéricas ou unions).
- Funções: `pode(map, acao, recurso)`, `hasAny(map, pairs)`, conversores de lista DTO → map.
- Zero dependências.

### `@org/rbac-provider`
- Interface `PermissionsProvider`:
  - `getPermissionsByIdentity(identity: string): Promise<PermissionsMap>`
  - `invalidate(identity?: string): void`
- Interface `IdentityResolver`:
  - `resolve(req): Promise<{ id: string; email?: string }>`
- Utilitário opcional de TTL cache (decorator do provider).

### `@org/rbac-prisma`
- Implementa `PermissionsProvider` com Prisma.
- Resolve herança de perfis (DAG), faz união de permissões por grant verdadeiro.
- Não define schema, apenas documenta expectativas de tabelas/campos e enums.

### `@org/rbac-next`
- `withApi(handler, { permissao?, tabela?, acao?, getIdentity?, provider, audit? })`.
- `withApiForId` com suporte a `params`.
- `audit` é plugável (callback) para não acoplar a um formato específico.

### `@org/rbac-react`
- `usePermissions({ fetcher, endpoint })`.
- `usePode()` consumindo `PermissionsContext` (provider configurável) ou endpoint.
- `withPermissao(Component, acao, recurso, { redirect? })`.

## Fluxos

1) Servidor (autorização forte):
   - `getIdentity(req)` → `id/email`.
   - `provider.getPermissionsByIdentity(email)` → `PermissionsMap`.
   - Checagem: `pode(map, acao, recurso)`.
   - Opcional auditoria via callback.

2) Cliente (UX):
   - Busca permissões (endpoint ou hydration) → `PermissionsMap`.
   - Habilita/oculta controles com `usePode`/HOC.

## Caching e Invalidação

- Decorator TTL no provider (ex.: 60s) com método `invalidate(identity?)`.
- Rotas administrativas que alteram permissões chamam `invalidate()` global.
- Evitar cache no cliente além de SWR expirar/revalidar.

## Tipos e Enums

- Para reuso amplo, `Action` e `Resource` devem ser `string` literais.
- Em projetos que já possuem enums (Prisma), tipar adapters com unions derivadas.

## Integrações

- NextAuth: fornecer `getIdentity` padrão como adapter, mas manter opcional.
- Prisma: adapter isolado; queries otimizadas com índices.
- Auditoria: callback `onAudit({ tabela, acao, userId, antes, depois, contexto })`.


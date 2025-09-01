# Guia de Migração — Extraindo Permissionamento (RBAC)

Este guia descreve como migrar o permissionamento atual para a arquitetura de pacotes RBAC.

## Estado atual (resumo)

- Core: `src/lib/permissions.ts` (PermissionsMap, pode/hasAny, conversores).
- Provider/Cache: `src/lib/permissoes.ts` (buscarPermissoesConcedidas, invalidatePermissionsCache).
- Herança: `src/helpers/permissoes-utils.ts` (getPerfisHerdadosNomes, getPermissoesPorPerfil).
- Next wrapper: `src/lib/withApi.ts` (autenticação, autorização, auditoria).
- Cliente: `src/hooks/usePermissoes.ts`, `src/hooks/usePode.ts`, `src/hoc/withPermissao.tsx`.
- Banco: Prisma com `Perfil`, `Permissao`, `PerfilHeranca` e enums.

## Estratégia

1) Monorepo com workspaces, publicação por pacote (independente).
2) Extrair core primeiro, mantendo APIs atuais para minimizar refatorações.
3) Criar adapters (Prisma/Next) compatíveis com o que o projeto usa hoje.
4) Substituir imports internos pelo novo layout de pacotes.
5) Validar autorização em endpoints críticos; depois cobrir toda a app.

## Passos Detalhados

1. Preparar monorepo
   - Adicionar `workspaces` ao `package.json` raiz (npm/pnpm/yarn).
   - Criar diretório `packages/` com subpastas para cada pacote.

2. Extrair `@org/rbac-core`
   - Mover conteúdo de `src/lib/permissions.ts` para `packages/rbac-core/src/index.ts`.
   - Generalizar tipos: `AcaoPermissao` → `Action`, `RecursoPermissao` → `Resource` (string literal type).
   - Publicar funções `pode`, `hasAny`, `toPermissionsMap`.

3. Criar `@org/rbac-provider`
   - Definir interfaces `PermissionsProvider`, `IdentityResolver`, decorator `withTTLCache`.
   - Sem dependências de framework/banco.

4. Adapter `@org/rbac-prisma`
   - Mover `getPerfisHerdadosNomes` e lógica de união de permissões de `src/helpers/permissoes-utils.ts`.
   - Implementar `createPrismaPermissionsProvider({ prisma })` usando a mesma consulta e união atuais.
   - Documentar expectativas de schema (nomes podem ser configuráveis).

5. Adapter `@org/rbac-next`
   - Mover `withApi.ts` e refatorar para receber `provider` e `getIdentity` injetáveis.
   - Substituir dependência direta de NextAuth por um `IdentityResolver` default (opcional) e permitir override.
   - Expor `withApi` e `withApiForId`.

6. Cliente `@org/rbac-react`
   - Mover `usePermissoes`, `usePode` e `withPermissao`, aceitando config `endpoint`/`fetcher`.
   - Adicionar `PermissionsProvider` para hydration server-side (opcional).

7. Integração no projeto atual
   - Substituir imports:
     - `@/lib/permissions` → `@org/rbac-core`
     - `@/helpers/permissoes-utils` → `@org/rbac-prisma`
     - `@/lib/permissoes` → usar `PermissionsProvider` + `withTTLCache`
     - `@/lib/withApi` → `@org/rbac-next`
     - Hooks/HOC → `@org/rbac-react`
   - Criar instâncias e composição no servidor:
     ```ts
     import { createPrismaPermissionsProvider } from '@org/rbac-prisma'
     import { withTTLCache } from '@org/rbac-provider'
     import { prisma } from '@/lib/prisma'

     const provider = withTTLCache(createPrismaPermissionsProvider({ prisma }), 60_000)
     ```
   - Passar `provider` a `withApi` em todas as rotas.

8. Invalidação de cache
   - Onde hoje chamamos `invalidatePermissionsCache()`, chamar `provider.invalidate()`.

9. Testes/Validação
   - Exercitar rotas com e sem permissão; comparar com comportamento atual.
   - Garantir que UI (hooks) refletiu corretamente as permissões.

## Mapeamento Arquivo-a-Pacote (este projeto)

- `src/lib/permissions.ts` → `@org/rbac-core`
- `src/helpers/permissoes-utils.ts` → `@org/rbac-prisma` (herança + consulta)
- `src/lib/permissoes.ts` → `@org/rbac-provider` (cache) + uso do provider Prisma
- `src/lib/withApi.ts` → `@org/rbac-next` (injeção de provider + identity)
- `src/hooks/usePermissoes.ts`, `src/hooks/usePode.ts`, `src/hoc/withPermissao.tsx` → `@org/rbac-react`

## Workspaces (exemplo)

`package.json` raiz:

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

Estrutura:

```
packages/
  rbac-core/
  rbac-provider/
  rbac-prisma/
  rbac-next/
  rbac-react/
```

## Publicação e Versionamento

- SemVer por pacote. Releases independentes com changelog.
- Mantém compatibilidade de APIs conforme especificação em `docs/rbac-package-apis.md`.
- Planejar automação (semantic-release) quando o CI estiver preparado.

## Rollout Incremental

1) Extrair `rbac-core` e apontar imports.
2) Introduzir `rbac-provider` + `rbac-prisma` e substituir `buscarPermissoesConcedidas` no servidor por provider.
3) Refatorar `withApi` (passar provider/getIdentity); migrar rotas gradualmente.
4) Migrar hooks para `rbac-react` e apontar consumidores.
5) Remover código legado e limpar aliases.

## Notas de Compatibilidade

- Enums do Prisma podem continuar existindo no app; os adapters aceitam string unions.
- Auditoria continua plugável; se já existe implementação, apenas plugar no `@org/rbac-next`.


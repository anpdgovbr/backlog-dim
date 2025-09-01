# Roadmap e Riscos

## Roadmap

- Fase 1: Extração do Core
  - Criar `@org/rbac-core` com APIs equivalentes às atuais.
  - Substituir imports internos e validar build.

- Fase 2: Provider + Prisma
  - Criar `@org/rbac-provider` (contratos, cache TTL) e `@org/rbac-prisma`.
  - Introduzir provider no servidor e migrar chamadas.

- Fase 3: Next Adapter
  - Extrair `withApi` para `@org/rbac-next` com injeção de provider/identity.
  - Migrar rotas sensíveis primeiro; depois o restante.

- Fase 4: React Client
  - Extrair hooks/HOC para `@org/rbac-react`.
  - Oferecer hydration opcional via `PermissionsProvider`.

- Fase 5: Polimento
  - Documentação final, exemplos, revisão de DX.
  - Preparar publicação (CI) e versionamento.

## Riscos e Mitigações

- Quebra de import paths: mitigado por migração em fases + aliases temporários.
- Divergência de enums (Prisma): usar strings; adapters convertem.
- Invalidação de cache: substituir chamadas centralmente por `provider.invalidate()`.
- Acoplamento a NextAuth: identity via resolver injetável; manter adapter NextAuth apenas como default.

## Métricas de Sucesso

- Zero regressões em autorização nas rotas auditadas.
- Redução de duplicação e centralização das checagens.
- Facilidade de integração em outro projeto (ensaio com app simples).


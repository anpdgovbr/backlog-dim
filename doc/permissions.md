# Permissões e Perfis (RBAC)

Este documento descreve como o sistema define e aplica permissões.

## Conceitos

- Perfil: agrupa permissões e é associado ao `User` (`User.perfilId`).
- Permissão: par `{ acao, recurso }` com flag `permitido` atrelado a um perfil.
- RBAC: as rotas exigem permissões específicas para executar ações.

## Modelo de Dados (Prisma)

- `Perfil { id, nome, active }`
- `Permissao { id, perfilId, acao, recurso, permitido, active }`
- `User { id, email, perfilId }`

## Consulta de Permissões

Há uma única fonte de verdade para as permissões efetivas de um usuário:

- Backend e frontend usam a mesma lógica de agregação, baseada no nome do perfil.
- A função `getPermissoesPorPerfil(perfilNome)` resolve permissões a partir do nome do perfil (inclui herança, quando configurada), e retorna uma lista `[{ acao, recurso, permitido }]`.
- A função `buscarPermissoesConcedidas(email)` (em `src/lib/permissoes.ts`) chama `getPermissoesPorPerfil` e converte o resultado para `PermissionsMap` via `toPermissionsMap`.

Com isso, UI e servidor avaliam exatamente o mesmo conjunto de permissões.

## Enforcement em Rotas

- Use `withApi`/`withApiSlim` com a opção `permissao: { acao, recurso }` para proteger a rota. Ex.: `{ acao: "Alterar", recurso: "Permissoes" }`.
- As rotas que alteram dados relevantes registram auditoria (AcaoAuditoria) via `withApi`.

## Uso no Cliente

- `usePermissoes` consome `/api/permissoes` e converte para `PermissionsMap`.
- `withPermissao` e `usePode` usam `pode(perms, acao, recurso)` para habilitar/ocultar ações na UI.

## Boas Práticas e Próximos Passos

- Tipos fortes no banco: migrar `acao` e `recurso` para enums Prisma ou FKs (evita typos).
- Herança: preferir herança modelada em banco ou remover herança dinâmica; como alternativa simples, "clonar perfil" para evitar lógica implícita.
- Cache: considerar cache leve (30–60s) das permissões por usuário no servidor.

## Próximos Passos Detalhados (Roadmap)

1) Integridade no Banco (enums ou FKs)
- Objetivo: eliminar typos e garantir integridade referencial para `acao` e `recurso`.
- Opção A — Enums Prisma:
  - Definir `enum AcaoPermissao` e `enum RecursoPermissao` no `schema.prisma`.
  - Alterar `model Permissao` para usar esses enums.
  - Migrar dados: script para mapear strings existentes para os enums (validar quedas).
  - Ajustar tipos TS: garantir que `@anpdgovbr/shared-types` espelhe os enums.
  - Vantagens: simples, estável; Desvantagem: lista é versionada via migration.
- Opção B — Tabelas normalizadas (`Acao`, `Recurso`):
  - Criar tabelas com chaves naturais (nome) + IDs; `Permissao` referencia por FK.
  - Seeds para popular ações/recursos e migração de dados do estado atual.
  - Vantagens: gestão dinâmica via DB; Desvantagem: consultas com joins e manutenção extra.
- Passos práticos (A ou B):
  - Criar migration, escrever script de backfill e validação.
  - Rodar em ambiente de staging e validar UI/rotas.
  - Publicar com janela de manutenção curta.

2) Unificar wrappers de API
- Objetivo: remover duplicidade entre `withApi` e `withApiSlim`.
- Implementar um único `withApi` com opções: `{ permissao?, auditoria?, slim?: boolean }`.
- Marcar `withApiSlim*` como deprecated (já marcado) e migrar chamadas gradualmente.
- Checklist:
  - Implementar assinatura única.
  - Migrar rotas mais usadas primeiro; manter compatibilidade por um ciclo de release.
  - Remover `withApiSlim*` após migração completa.

3) Estratégia para Herança de Perfis
- Opção simplificada (recomendada): remover herança dinâmica em runtime.
  - Congelar `HIERARQUIA_PERFIS`; criar ação de "Clonar perfil" na UI/seed.
  - Atualizar `getPermissoesPorPerfil` para retornar apenas permissões explícitas.
  - Benefícios: previsibilidade e menor complexidade.
- Opção modelada em DB:
  - Adicionar `Perfil.parentId` (ou tabela `PerfilHeranca`).
  - Atualizar `getPermissoesPorPerfil` para computar a união via consulta.
  - Remover `HIERARQUIA_PERFIS` do código.
- Em ambos os casos: garantir que backend e frontend continuem usando a mesma função central.

4) Cache de Permissões
- Adicionar cache em memória (TTL 30–60s) para `buscarPermissoesConcedidas`/função central:
  - Chave: `userId` ou `email`.
  - Invalidação: ao criar/atualizar permissão (`POST/PATCH /api/permissoes`), invalidar cache do perfil afetado.
- Alternativa: embutir permissões no JWT (com atenção a invalidar/atualizar token após mudanças).
- Observação: medir impacto via logs/telemetria.

5) Políticas por Domínio (além do RBAC)
- Para regras contextuais (ex.: "editar somente se for dono"), criar helpers `canEditX(contexto)` por recurso.
- Padrão sugerido:
  - Primeiro checar RBAC (`pode`), depois aplicar política específica de negócio.
  - Cobrir com testes unitários (entrada/saída determinística).

6) Testes e Observabilidade
- Unit: `permissions.ts` (`pode`, `hasAny`, conversões) e políticas de domínio.
- Integração: wrappers `withApi` retornando 401/403/200 conforme cenários.
- E2E: fluxo de admin de permissões (toggle -> efeito em UI e backend).
- Observabilidade: logs de negações (403), métricas por recurso/ação.

7) Descontinuações Planejadas
- `withApiSlim*`: já anotado como `@deprecated`; remover após unificação.
- Formato plano `FlatKey`/`toFlatKeyMap`: marcado como `@deprecated`; remover após garantir que não há consumidores.
- `HIERARQUIA_PERFIS`: remover quando herança estiver no DB ou for eliminada.
- `withPermissao` (HOC): manter para UX; a médio prazo, considerar provider de “capabilities” hidratadas do servidor.

8) Plano de Release/Backout
- Sequência sugerida: testes -> staging -> produção com feature flag para novos paths.
- Scripts de migração com dry-run e logs detalhados.
- Plano de rollback: manter migrations reversíveis e retain backups.

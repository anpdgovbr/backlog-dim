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
  - Comandos úteis:
    - `npx prisma migrate dev --name perfil-heranca` (cria tabela `PerfilHeranca`).
    - `npm run db:seed` (popula herança e permissões padrão).

## Seed de Usuários de Teste

- Preferencial: definir `SEED_USERS_JSON` no `.env` com um array de usuários:

  `SEED_USERS_JSON=[{"email":"admin@example.com","nome":"Admin","perfil":"Administrador"}]`

- Alternativa (variáveis individuais): se `SEED_USERS_JSON` não estiver definido, o seed utiliza as variáveis abaixo quando presentes:
  - `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_NOME`
  - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_NOME`
  - `SEED_SUPERVISOR_EMAIL` / `SEED_SUPERVISOR_NOME`
  - `SEED_ATENDENTE_EMAIL` / `SEED_ATENDENTE_NOME`
  - `SEED_LEITOR_EMAIL` / `SEED_LEITOR_NOME`

Cada usuário é criado/atualizado via upsert com o perfil correspondente.

2) Unificar wrappers de API
- Estado atual:
  - `withApi` e `withApiForId` mantidos como wrappers padrão.
  - `withApiSlim*` marcados como `@deprecated` e rotas migradas para `withApi`.
- Próximos passos:
  - Opcional: adicionar opções no `withApi` para controlar sessão/auditoria finamente.
  - Remover `withApiSlim*` após um ciclo de release sem usos.

3) Estratégia para Herança de Perfis
- Implementado no DB via tabela `PerfilHeranca` (DAG):
  - Seed configura: SuperAdmin > Administrador > Supervisor > Atendente > Leitor.
  - `getPerfisHerdadosNomes(perfil)` resolve a cadeia de pais ativos (evita ciclos).
  - `getPermissoesPorPerfil` agrega permissões dos perfis herdados.
- Regras de união: concessões (true) prevalecem; negações (false) não removem uma concessão herdada.
- Próximos passos:
  - Adicionar UI para gerenciar herança (arrastar/soltar ou lista de pais).
  - Invalidação de cache de permissões ao alterar heranças.
  - Endpoints de herança:
    - `GET /api/perfis/heranca`: lista (requer `{Exibir, Permissoes}`).
    - `POST /api/perfis/heranca` `{ parentId, childId }`: cria (requer `{Alterar, Permissoes}`) e invalida cache.
    - `DELETE /api/perfis/heranca?parentId=&childId=`: remove (requer `{Alterar, Permissoes}`) e invalida cache.
  - UI mínima: `/admin/perfis/heranca` com formulário simples para criar/remover relações.

4) Cache de Permissões
- Implementado: cache em memória (TTL 60s) em `src/lib/permissoes.ts` (chave por `email`).
  - Funções:
    - `buscarPermissoesConcedidas(email)`: lê/grava cache.
    - `invalidatePermissionsCache()`: limpa todos os itens (estratégia segura e simples).
  - Invalidação conectada em:
    - `POST /api/permissoes` e `PATCH /api/permissoes/[id]` e `PATCH /api/admin/permissoes`: limpam cache após alterações.
- Alternativas futuras:
  - Invalidação mais granular (por `perfilId`).
  - Embutir permissões no JWT (exige estratégia de refresh quando houver mudanças).
  - Medir impacto via logs/telemetria.

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


# Segurança — ABAC em Processo (Editar Próprio) - Verificar para inserir junto nessa Task

Aplicar controle de atributo (ABAC) para permitir edição apenas do próprio processo quando aplicável.

Referência: plano-mapa-aninhado.md (seção 4)

## Objetivos
- Diferenciar edição geral vs. edição do próprio registro.
- Garantir que `EditarProprio_Processo` só permita atualização quando o processo pertencer ao usuário (via `responsavel.userId`).

## Tarefas
- [x] `src/app/api/processos/[id]/route.ts` (PUT):
  - [x] Se não houver `{acao: "EditarGeral", recurso: "Processo"}`:
    - [x] Validar `{acao: "EditarProprio", recurso: "Processo"}` e `responsavel.userId === session.user.id`.
    - [x] Caso contrário, responder 403.
  - Implementado no handler PUT com verificação RBAC+ABAC inline; a opção `permissao` do wrapper foi retirada e a decisão é tomada no handler.

## Critérios de Aceite
- Usuários com `EditarProprio` conseguem editar apenas os processos atribuídos a si.
- Usuários sem `EditarGeral` não conseguem editar processos de outros.

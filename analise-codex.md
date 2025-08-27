# Análise Técnica — backlog-dim (ANPD/DIM)

Este parecer consolida uma revisão criteriosa do projeto, cobrindo funcionalidades, arquitetura, padrões, pontos fortes, fragilidades, riscos e oportunidades de melhoria. A análise foi feita diretamente no repositório, com leitura dos módulos centrais: `src/app` (páginas e APIs), `src/lib` (infra de API, Prisma, permissões), `prisma/` (schema e seeds), camadas de UI, hooks e configuração (Next, ESLint, TS, middleware).

## Sumário Executivo

- Finalidade: Sistema interno de gestão de processos administrativos da DIM, com autenticação institucional (Azure AD), RBAC (Perfis/Permissões), auditoria e CRUDs de metadados e processos.
- Arquitetura sólida em Next.js App Router + Prisma/PostgreSQL; UI moderna com MUI e visual Gov.br; wrappers de API padronizados com auditoria embutida.
- Pontos fortes: padronização das rotas via wrappers `withApi`/`withApiSlim`, auditoria consistente, seed de RBAC completo, DataGrid com paginação/ordenação no servidor, theming MUI consistente, soft delete generalizado.
- Riscos/débitos: endpoint de auditoria (POST) sem proteção de autenticação/permissão; validação servidor-side ausente na maioria das rotas; sobreposição de configurações ESLint; campos legados no schema Prisma; middleware protege apenas subconjunto de APIs; duplicação de utilitários; algumas permissões usadas para fins não semânticos.
- Prioridades: proteger `POST /api/auditoria`; revisar políticas de proteção/permite nas APIs; introduzir validações server-side (Zod/Yup) e normalizar schema; consolidar configuração de lint; revisar middleware vs wrappers; endurecer allowedOrigins em produção; ajustes de DX/observabilidade.

## Funcionalidades Principais

- Autenticação: NextAuth com Azure AD (JWT), páginas de login/logout dedicadas.
- RBAC: Perfis e Permissões (seed abrangente), checagem de autorização no servidor via `withApi`/`withApiSlim` e no cliente via HOC `withPermissao` + hook `usePermissoes`.
- Processos: CRUD com geração sequencial de número por mês/ano; filtros, paginação e ordenação; status interno derivado por regra de alteração; relacionamentos com metadados (forma de entrada, situação, etc.).
- Metadados: Endpoints genéricos por entidade (`/api/meta/[entidade]`) com soft delete e auditoria.
- Responsáveis e Usuários: vinculação de usuários a responsáveis; gestão de perfis/permite no admin.
- Auditoria: logging detalhado (tabela, ação, antes/depois, IP, userAgent, contexto) via servidor e client provider.
- Dashboard: cartões de métricas, atalhos de gestão, proteção por permissão.
- Saúde/diagnóstico: `GET /api/health` básico.

## Arquitetura e Padrões

- Frontend/Backend unificados em Next.js 15 (App Router) com React 19; TypeScript estrito; MUI v7 com tema institucional (Gov.br/ANPD) e overrides para DataGrid.
- Camada de dados: Prisma 6.x com PostgreSQL; soft delete padronizado com `active` + `exclusionDate` em entidades.
- API: rotas em `src/app/api/**`, padronizadas com wrappers:
  - `withApi` e `withApiForId`: autenticam, verificam permissão e registram auditoria automaticamente.
  - `withApiSlim`/`withApiSlimNoParams`: versão enxuta para endpoints simples com/sem params.
- Segurança de acesso: middleware (`src/middleware.ts`) redireciona login e protege `/dashboard` e `/api/processos`; demais APIs confiam nos wrappers de autorização.
- UI/UX: componentes modulares (CRUDs, formulários com RHF + Yup, DataGrid server-side), NotificationProvider, CookieManager, theme centralizado.
- Seeds: `prisma/seed.ts` preenche metadados, statuses, perfis e permissões — facilitando bootstrap local e previsibilidade de RBAC.

## Pontos Fortes

- Padronização de APIs: wrappers centralizam autenticação, autorização e auditoria, reduzindo repetição e erros.
- Auditoria robusta: logs com metadados úteis (IP, userAgent, contexto) e difs antes/depois.
- RBAC completo: modelagem clara (Perfil/Permissão), seed abrangente e integração no cliente.
- Soft delete consistente: `active`/`exclusionDate` difundidos em entidades críticas.
- UX moderna: MUI com tema institucional, DataGrid com paginação/ordenação server-side, componentes coesos.
- Documentação auxiliar: diretório `docs/` com guias de refatoração, CSS cleanup e integrações.
- Scripts de DX: geração de rotas de dev, helpers de infra (docker-infra-pg), seed parametrizável.

## Fragilidades e Riscos (detalhados)

1) Segurança — POST de Auditoria sem proteção
- Local: `src/app/api/auditoria/route.ts` (export async function POST)
- Problema: a rota POST não usa `withApi`/`withApiSlim`, nem verificação de sessão; o middleware não protege `/api/auditoria` (matcher protege apenas `/dashboard` e `/api/processos`).
- Risco: qualquer agente (incluindo anônimo) pode enviar logs falsos (log poisoning/spam), poluindo auditoria e mascarando eventos reais.
- Impacto: alto (integridade e confiabilidade dos logs).

2) Cobertura de proteção no middleware é parcial
- Local: `src/middleware.ts`
- Problema: só considera `/dashboard` e `/api/processos` como rotas protegidas; como convenção, a proteção recai sobre os wrappers nas demais APIs, mas endpoints avulsos (ex.: `health` ou handlers que algum dia não usem wrappers) podem escapar.
- Risco: inconsistências futuras; superfície de ataque se novos endpoints esquecerem o wrapper.
- Impacto: médio.

3) Validação servidor-side insuficiente
- Local: Diversas rotas; validação forte está no cliente (`src/schemas/ProcessoSchema.ts` com Yup), porém os handlers confiam no payload e convertem datas “na unha”.
- Risco: dados inválidos/inesperados, coerção indevida, erros de runtime, campos extras.
- Impacto: médio/alto conforme endpoint.

4) Duplicidade e sobreposição de ESLint configs
- Local: `eslint.config.mjs`, `.eslintrc.cjs`, `.eslintrc.json` coexistem; Next está com `ignoreDuringBuilds: true`.
- Risco: regras conflitantes, confusão no pipeline e gaps de qualidade; o build ignora lint.
- Impacto: médio (qualidade/consistência).

5) Campos legados e nomenclatura no schema Prisma
- Local: `prisma/schema.prisma` (Processo contém `envioPedido`/`prazo` e também `dataEnvioPedido`/`prazoPedido`/`dataVencimento`).
- Risco: confusão de domínio e manutenção; queries futuras podem usar campos incorretos; migrações desnecessárias.
- Impacto: médio.

6) Permissão semântica questionável no Admin
- Local: `src/app/admin/layout.tsx` e páginas admin usam `withPermissao('Desabilitar','Relatorios')` para gate geral do admin.
- Risco: desvio semântico (gate do admin atrelado a permissão de “Desabilitar Relatórios”), dificultando manutenção e auditoria de acessos.
- Impacto: baixo/médio.

7) Duplicação de helpers `pode`
- Local: `src/lib/permissoes.ts` e `src/hooks/usePermissoes.ts` exportam funções `pode` semelhantes.
- Risco: drift entre implementações e confusão de import.
- Impacto: baixo.

8) Configuração experimental e allowedOrigins
- Local: `next.config.ts` — `experimental.serverActions.allowedOrigins` inclui domínios HTTP e IP com porta.
- Risco: superfície de ataque/uso indevido se promovido a produção sem revisão; ruído de configurações em ambientes diferentes.
- Impacto: baixo/médio.

9) Dependências e limpeza
- Possíveis dependências não utilizadas (ex.: `node-fetch` em app Next 15), `tsx` listado como dependency (poderia ser devDependency); múltiplos arquivos ESLint.
- Impacto: baixo (performance/organização).

## Oportunidades e Melhores Práticas Recomendadas

Segurança e Autorização
- Proteger `POST /api/auditoria` com `withApiSlimNoParams` ou `withApi` + permissão específica (ex.: `Registrar_Auditoria`) OU restringir por segredo/assinatura interna se a intenção for logging de sistema (não-user-driven).
- Restringir também `GET /api/auditoria` a um escopo admin apropriado (ex.: `Exibir_Auditoria`), evitando exposição ampla dos logs mesmo a autenticados comuns.
- Revisar `middleware.ts` para default-deny em `/api/**` com whitelist explícita para públicas (ex.: `/api/health`, `/api/auth`) OU documentar que toda rota nova deve usar wrapper (com CI/lint rule para evitar handlers sem wrapper).
- Adicionar rate limiting (por IP/usuário) em endpoints críticos (login, auditoria, listagens grandes) e proteção básica contra abuso.

Validação e Resiliência
- Introduzir validação de payloads no servidor com Zod (ou Yup) e schemas compartilhados onde possível (ex.: `ProcessoInputSchema`), evitando coerções manuais e garantindo mensagens consistentes.
- Padronizar respostas de erro (shape JSON, códigos) e logging estruturado de exceções; considerar um helper `jsonError(status, code, message)`.
- Adicionar verificação de conexão do banco em `GET /api/health` estendida (ex.: `/api/health/db`).

Modelagem e Domínio
- Consolidar campos de prazo/envio no `Processo` (remover legados `envioPedido`/`prazo` se não usados; manter apenas `dataEnvioPedido`/`prazoPedido`/`dataVencimento`).
- Avaliar índices adicionais em colunas de filtro/ordenação frequentes (ex.: `numero`, `responsavel.userId`, `dataCriacao`, `statusInterno`) para ganhar performance em escala.

RBAC e Semântica
- Criar permissões específicas para seções admin (ex.: `Acessar_Admin`) e para auditoria (ex.: `Exibir_Auditoria`, `Registrar_Auditoria`) e usá-las nos gates, em vez de “Desabilitar_Relatorios”.
- Unificar utilitários de permissão (`pode`) em um único módulo consumível tanto no cliente quanto no servidor.

Qualidade e DX
- Consolidar ESLint em um único config (preferencialmente `eslint.config.mjs` flat) e remover `.eslintrc.*`; habilitar lint em CI (remover `ignoreDuringBuilds` no build e mover lint p/ job específico da pipeline).
- Mover `tsx` para devDependencies e remover pacotes não utilizados; rodar `depcheck` para limpeza periódica.
- Adicionar testes mínimos (unitários para helpers e integração para principais APIs). Mesmo que o projeto não tenha padrão de testes, é viável criar uma pasta `tests/api` para validar wrappers e autorizações.
- Documentar uma convenção: “toda rota em `/api/**` deve obrigatoriamente usar `withApi*`”, com verificação de lint customizada se possível.

Observabilidade
- Expandir métricas e logs (contagem de erros por rota, tempo de resposta) e, se possível, integrar um APM ou pelo menos sumarizar em logs estruturados.

Configuração de Produção
- Revisar `experimental.serverActions.allowedOrigins` para condicionar por ambiente (via env vars) e restringir ao domínio oficial; remover IP e HTTP em produção.

Acessibilidade/UX
- Garantir ai11y no DataGrid e componentes (labels e aria-attrs já em uso, manter consistência), e validar contraste/padrões Gov.br.

## Achados Específicos (com referências)

- `src/app/api/auditoria/route.ts`:
  - POST: sem wrapper nem checagem de sessão; adicionar `withApiSlimNoParams` e permissão dedicada; o middleware atual não cobre esta rota.
  - GET: utiliza `withApiSlim` sem permissão configurada (permissão `undefined`), permitindo qualquer autenticado consultar logs; restringir a perfil admin.

- `src/middleware.ts`:
  - Garante bloqueio básico de `/dashboard` e `/api/processos`, mas não cobre `/api/**` como regra geral; pode-se adotar matcher para `/api/:path*` exceto `auth`/`health`.
  - Duplicidade: checa `!token && isProtectedRoute` e novamente `pathname.startsWith("/api/processos") && !token` — a segunda é redundante.

- `prisma/schema.prisma`:
  - Campos possivelmente obsoletos em `Processo` (manter consistência com o domínio e o front). Avaliar remoção com migração e ajustes no seed.

- `src/app/admin/layout.tsx` e páginas admin:
  - Gate com `withPermissao("Desabilitar", "Relatorios")` — trocar por permissão clara de acesso admin.

- ESLint configs múltiplas (`eslint.config.mjs`, `.eslintrc.cjs`, `.eslintrc.json`):
  - Consolidar uma única fonte de verdade; reduzir ruído.

- Duplicação de `pode` em `src/lib/permissoes.ts` e `src/hooks/usePermissoes.ts`:
  - Unificar para evitar drift.

- `next.config.ts` (allowedOrigins):
  - Restringir em produção; parametrizar por env.

## Conclusão

O projeto apresenta uma base sólida, bem estruturada e moderna para um sistema administrativo: wrappers de API elegantes com auditoria integrada, modelagem consistente com soft delete, integração de RBAC completo, UI coesa com MUI e práticas de DX úteis. As fragilidades identificadas são tratáveis com intervenções cirúrgicas e trazem ganhos imediatos de segurança, qualidade e manutenção. Priorize a proteção do endpoint de auditoria, a validação no servidor e a consolidação de configurações (lint/semântica de permissões). Em seguida, avance em observabilidade, testes e ajustes de domínio (schema) para sustentar evolução com segurança.

## Próximos Passos Prioritários (ação prática)

1) Segurança de Auditoria
- Envolver `POST /api/auditoria` com `withApiSlimNoParams` e exigir permissão admin (ex.: `Registrar_Auditoria`), ou validar assinatura/segredo interno.
- Restringir `GET /api/auditoria` a `Exibir_Auditoria`.

2) Política de Proteção das APIs
- Ajustar `middleware` para proteger `/api/**` com whitelist clara, ou padronizar via wrappers + lint rule que proíbe handlers sem `withApi*`.

3) Validação Server-side
- Adicionar Zod/Yup nos handlers (ex.: Processo create/update), com parsing de datas e enums centralizados.

4) Qualidade/Config
- Consolidar ESLint; habilitar lint no CI; limpar deps (mover `tsx` p/ devDependencies e remover `node-fetch` se não usado).

5) Domínio
- Normalizar campos no `Processo` e revisar índices.

6) Observabilidade/Testes
- Endpoint de health com checagem de DB e testes de autorização em APIs críticas.


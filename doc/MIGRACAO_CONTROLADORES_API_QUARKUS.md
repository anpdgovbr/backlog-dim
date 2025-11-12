# Migração da API de Controladores (NestJS → Quarkus)

## Contexto

- **Branch atual**: `91-trocar-api-de-controladores`.
- **Estado vigente**: o `backlog-dim` consome a API `cadastro-controladores-api` (NestJS) via proxies Next (`src/app/api/**`), com contratos tipados pelo pacote `@anpdgovbr/shared-types`.
- **Objetivo**: trocar a dependência do serviço NestJS pela nova API Quarkus (`controladores-api-quarkus`), mantendo o front funcional e preparando a evolução futura (API reativa, novos campos).

## Comparativo rápido: contratos atuais × Quarkus

| Recurso               | NestJS (atual)                                                                                                    | Quarkus (novo)                                                                                                                           | Diferenças relevantes                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Base URL              | `https://dim.dev.anpd.gov.br`                                                                                     | `http://<host>:8082`                                                                                                                     | Novo serviço expõe todos os endpoints sob `/api/*`.                             |
| Listar controladores  | `GET /controladores`                                                                                              | `GET /api/controlador`                                                                                                                   | Novo contrato retorna `PageResponseDTO` (`totalElements`, `page`, `pageSize`).  |
| CRUD controlador      | `POST /controladores`,<br>`PATCH /controladores/:id`,<br>`DELETE /controladores/:id`,<br>`GET /controladores/:id` | `POST/PUT/DELETE/GET /api/controlador`,<br>`/api/controlador/{id}`                                                                       | `PUT` substitui `PATCH`; `DELETE` responde `204`; IDs agora são UUID.           |
| Campos de controlador | `nome`, `email`, `telefone`, `cnpj/cpf`, `setorId`, `cnaeId` (tipos do `shared-types`)                            | `nomeEmpresarial`, `nomeFantasia`, arrays `emails`/`telefones`, `tipo`, `setorId`, `cnaeId`, `esfera`, `poder`, `politicaPrivacidadeUrl` | Formularios precisam mapear; novo contrato exige pelo menos um e-mail/telefone. |
| CNAE                  | `GET/POST /cnaes`, `GET /cnaes/:id`                                                                               | `GET/POST/PUT/DELETE /api/cnae`                                                                                                          | Campos `codigo`/`nome`; paginação no padrão `PageResponseDTO`.                  |
| Setor                 | `GET/POST /setores`                                                                                               | `GET/POST/PUT/DELETE /api/setor`                                                                                                         | Endpoint muda para singular; DTO inclui `active`, `exclusionDate`.              |
| Encarregado           | não consumido hoje                                                                                                | `GET/POST/PUT/DELETE /api/encarregado`                                                                                                   | Novos campos `emails[]`, `telefones[]`, `externo`.                              |
| Autenticação          | sem bearer                                                                                                        | `bearerAuth` (JWT)                                                                                                                       | Confirmar estratégia com backend.                                               |

### Diferenças de payload e tipagem

- **Identificadores**: Nest usa `number`; Quarkus usa `UUID` (string).
- **Contato**: campos simples → arrays (`emails`, `telefones`). Definir estratégia (suportar múltiplos ou mapear primeiro item).
- **Campos obrigatórios**: Quarkus marca `nomeEmpresarial`, `tipo`, `cpf`, `site`, `emails`, `telefones`, `politicaPrivacidadeUrl`, `setorEmpresarial`, `setorId`, `cnaeId`. Formulários atuais não capturam tudo → ajustar UI/validações ou negociar flexibilidade.
- **Paginação**: novo padrão `{ data, page, pageSize, totalElements, totalPages }`. Hooks (`useControladores`, `useCnae`) esperam `{ data, total }`.
- **DELETE**: retorna `204` sem corpo → proxies/hook devem tratar respostas vazias.

## Impacto no `backlog-dim`

1. **Variáveis de ambiente**
   - Atualizar `CONTROLADORES_API_URL` para considerar o prefixo `/api` (ou concatenar no proxy).
   - Confirmar e documentar o fluxo de autenticação (JWT) caso o backend exija bearer token.

2. **Proxies Next (`src/app/api`)**
   - Atualizar endpoints (`controladores`, `cnaes`, `setor`) para os novos caminhos/métodos.
   - Substituir `PATCH` → `PUT` e adequar `DELETE` (204).
   - Tratar UUIDs como string e adaptar erros/retornos (novo contrato usa mensagens diferentes).

3. **Hooks e tipos**
   - `useControladores`: aceitar `id: string`, normalizar paginação (`totalElements`), revisar filtros (`orderBy` com campos do Quarkus).
   - `useCnae`: trocar `code` por `codigo`, ajustar totais.
   - Introduzir tipos locais para DTOs Quarkus (enquanto `@anpdgovbr/shared-types` não for atualizado).

4. **Formulários e componentes**
   - `RequeridoForm`: mapear `nome` → `nomeEmpresarial`, `email` → `emails[0]`, `telefone` → `telefones[0]`, acrescentar campos exigidos (esfera, poder, setorEmpresarial).
   - Ajustar Autocomplete (CNAE/Setor) para novos campos (`nome`, `codigo`).
   - Revisar grids/listas que exibem ID numérico → agora UUID.

5. **Testes & auditoria**
   - Atualizar mocks e utilitários usados em testes (`/api/controladores`, `/api/cnaes`, `/api/setor`).
   - Garantir que auditoria (`audit.antes/depois`) continue ok com payloads reformulados.

6. **Observabilidade**
   - Validar logs quando `CONTROLADORES_API_DEV_RESET_ON_START=false` (novo backend preserva seed).
   - Atualizar dashboards/alertas que consultam endpoints antigos.

## Plano de execução

1. **Preparação**
   - Confirmar com backend: autenticação bearer, comportamento de validação (campos obrigatórios).
   - Ajustar `.env.example` do `backlog-dim` com host Quarkus e flag para prefixo `/api`.

2. **Tipos e mapeamentos**
   - Criar `src/types/controladores-quarkus.ts` com DTOs/Enums do OpenAPI.
   - Implementar mappers (form ↔ API) para facilitar adaptação incremental.

3. **Atualizar proxies Next**
   - `src/app/api/controladores/**`: caminhos `/api/controlador`, `PUT`, `DELETE` 204, bearer opcional.
   - `src/app/api/cnaes/**`, `src/app/api/setor/route.ts`: ajustar rotas, tratar resposta `PageResponseDTO`.

4. **Atualizar hooks/componentes**
   - `useControladores`, `useCnae`, `useApi` (se necessário) → interpretar `PageResponseDTO`.
   - Ajustar formulários (campos extras) e componentes de listagem (IDs como string).

5. **Testes e validação manual**
   - Adaptar mocks e testes existentes.

- Executar fluxo completo contra `quarkusDev` (listar ➜ criar ➜ atualizar ➜ excluir).

6. **Documentação & rollout**
   - Atualizar README/doc de deploy com novo serviço.
   - Planejar cutover (janela + rollback), monitorar logs/métricas pós-switch.

## Questões em aberto

- Token bearer será obtido via Keycloak (fluxo já usado pelo NextAuth) ou haverá um client técnico?
- Como mapear múltiplos e-mails/telefones no front? (UI aceitará lista ou usaremos somente o primeiro item?)
- Haverá suporte temporário a `PATCH`/IDs numéricos durante a transição?
- O pacote `@anpdgovbr/shared-types` será atualizado com os DTOs Quarkus?

## Próximos passos imediatos

1. Validar com o backend a estratégia de autenticação e a lista de campos obrigatórios.
2. Criar tipos Quarkus/mappers no branch `91-trocar-api-de-controladores`.
3. Ajustar proxies para aceitar `baseUrl/api` (preferencialmente com feature flag) e testar com `quarkusDev`.

---

## Detalhamento técnico por entrega

### 1. Camada de configuração/env

- [ ] Acrescentar no `.env.example` do `backlog-dim`:
  - `CONTROLADORES_API_HOST_QUARKUS=http://localhost:8082`
  - `CONTROLADORES_API_PREFIX=/api`
  - `CONTROLADORES_API_USE_QUARKUS=false` (feature flag inicial)
- [ ] No runtime, construir a URL como:
  ```ts
  const base =
    process.env.CONTROLADORES_API_USE_QUARKUS === "true"
      ? (process.env.CONTROLADORES_API_HOST_QUARKUS ?? "http://localhost:8082")
      : (process.env.CONTROLADORES_API_URL ?? "https://dim.dev.anpd.gov.br")
  const prefix =
    process.env.CONTROLADORES_API_USE_QUARKUS === "true"
      ? (process.env.CONTROLADORES_API_PREFIX ?? "/api")
      : ""
  const endpoint = `${base}${prefix}`
  ```
- [ ] Documentar no README como alternar entre Nest e Quarkus (desenvolvimento vs produção).

### 2. Tipos e mapeamentos

- [ ] Criar `src/types/controladores-quarkus.ts` com:
  - Interfaces `ControladorQuarkusDTO`, `EmailQuarkusDTO`, `TelefoneQuarkusDTO`, `PageResponseDTO<T>`.
  - Enums `TipoPessoaEnum`, `SetorEmpresarial`, `Esfera`, `Poder` (copiados do OpenAPI).
- [ ] Implementar utilitários de conversão:
  - `mapControladorFormToQuarkus(form: ControladorFormData): ControladorQuarkusDTO`
  - `mapQuarkusControladorToUI(dto: ControladorQuarkusDTO): ControladorDto` (enquanto o resto do app usa tipos antigos).
  - Similar para CNAE (`mapCnaeToQuarkus`) e Setor.
- [ ] Atualizar schemas/validações que usam `@anpdgovbr/shared-types` para aceitar UUID string (talvez criar schemas zod locais).

### 3. Proxies Next (`src/app/api/**`)

- **Controladores**:
  - [ ] GET: usar `${endpoint}/controlador`, repassar paginação novo formato e converter resposta para `{ data, total }`.
  - [ ] POST/PUT: enviar payload mapeado pelo utilitário; tratar validação 422 (retornar array de erros do Quarkus).
  - [ ] DELETE: aceitar `204` e retornar JSON `{ success: true }` para UI.
  - [ ] GET by ID: converter `UUID` para string; mapear resposta Quarkus → tipo atual até UI ser ajustada.
- **CNAE**:
  - [ ] Ajustar caminhos para `${endpoint}/cnae`.
  - [ ] PUT e DELETE adicionados (UI hoje não usa? registrar pendência).
  - [ ] Converter `PageResponseDTO` e campos `codigo`, `nome`.
- **Setor**:
  - [ ] Caminho `${endpoint}/setor`.
  - [ ] Garantir compatibilidade com soft delete (novo campo `active`).

### 4. Hooks e stores

- [ ] `useApi` genérico: aceitar resposta com `page/pageSize/totalElements`.
- [ ] `useControladores`:
  - Atualizar tipos (`ControladorQuarkusDTO`).
  - Converter filtros (ex.: `orderBy=nomeEmpresarial`).
  - Expor helper `transformToForm(dto)` para formularios.
- [ ] `useCnae` e `useSetor`: analogamente.
- [ ] Considerar criar camada `services/controladores.ts` para centralizar fetch + mapping.

### 5. UI/Formulários

- [ ] Revisar `RequeridoForm`:
  - Campos obrigatórios extras (esfera/poder/setorEmpresarial).
  - Suporte a múltiplos e-mails/telefones: primeiro momento → permitir um item e mapear para array `[valor]`.
  - Adequar mensagens de erro conforme respostas Quarkus (422 com `field`, `message`).
- [ ] Grids/listas: exibir `nomeEmpresarial` em vez de `nome`.
- [ ] AutoComplete: atualizar labels para `${codigo} - ${nome}` (CNAE) e `nome` (Setor).

### 6. Testes

- [ ] Atualizar mocks em `src/app/api/__tests__` (se existirem) e fixtures para usar UUID.
- [ ] Adicionar testes e2e para `controladores` (listar/criar/editar/excluir).
- [ ] Validar wrappers `withApi/withApiForId`: garantir que audit continua populando `audit.depois` com campos relevantes (talvez apenas `id`).

### 7. Observabilidade & Auditoria

- [ ] Validar logs do Quarkus com `CONTROLADORES_API_DEV_RESET_ON_START=false` (seed persistente).
- [ ] Garantir que auditoria registre `UUID` e payloads relevantes.
- [ ] Atualizar dashboards de erro (ex.: Sentry) caso mensagens/paths mudem.

---

## Plano de validação

1. **Local** (dev isolado):
   - Rodar `controladores-api-quarkus` em 8082 com `.env` apontando para base de testes.
   - No `backlog-dim`, habilitar flag `CONTROLADORES_API_USE_QUARKUS=true`.
   - Executar manualmente fluxo completo (listar ➜ criar ➜ editar ➜ excluir) para controladores, CNAE, setor.

2. **Integração** (ambiente compartilhado):
   - Aplicar migrations necessárias no banco (verificar se Quarkus exige schema diferente).
   - Habilitar flag para uma instância canário do front (ex.: `backlog-dim-dev-quarkus`).
   - Coletar feedback dos usuários do ambiente dev compartilhado.

3. **Pré-produção**:
   - Rodar smoke tests automatizados sobre endpoints.
   - Garantir que dashboards/alertas estão monitorando novos caminhos.

4. **Produção**:
   - Planejar janela de deploy (preferencialmente fora do horário de pico).
   - Manter flag de fallback para voltar ao NestJS se necessário.
   - Monitorar métricas (latência, erros 4xx/5xx) nas primeiras horas.

---

## Cronograma sugerido

| Semana | Entregas principais                                               |
| ------ | ----------------------------------------------------------------- |
| S1     | Tipos & mappers, ajuste proxies (GET) com flag desativada         |
| S2     | Formularios/UI + POST/PUT/DELETE + hooks atualizados              |
| S3     | Testes, auditoria, documentação, habilitação em dev compartilhado |
| S4     | Pré-prod + go/no-go para produção                                 |

> Ajustar conforme disponibilidade da equipe e dependências backend (auth, campos obrigatórios).

---

## Repositórios envolvidos

- `controladores-api-quarkus` – backend (já atualizado com flag `CONTROLADORES_API_DEV_RESET_ON_START`).
- `backlog-dim` – frontend + proxies Next (branch `91-trocar-api-de-controladores`).
- `@anpdgovbr/shared-types` – avaliar atualização para novos DTOs (abrir issue se necessário).

---

## Pendências de decisão (para registrar no board)

- [ ] Confirmar formato final dos DTOs (campos opcionais/obrigatórios).
- [ ] Definir estratégia de autenticação (token técnico vs usuário logado).
- [ ] Decidir se UI suportará múltiplos e-mails/telefones nesta fase.
- [ ] Alinhar política de versionamento da API (ex.: `v1` para Quarkus).
- [ ] Planejar desativação definitiva do serviço Nest após go-live (data e comunicação).

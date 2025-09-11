# 📦 Pull Request – Backlog DIM

> Preencha todas as seções relevantes. PRs incompletas podem ser marcadas como _draft_ pelos revisores.

## 📌 Contexto

- **Tipo de mudança** (marque todos que se aplicam):
  - [ ] feat (nova funcionalidade)
  - [ ] fix (correção de bug)
  - [ ] refactor (refatoração sem alteração de comportamento)
  - [ ] perf (melhoria de performance)
  - [ ] docs (documentação)
  - [ ] chore (infra/ajustes gerais)
  - [ ] test (testes)
  - [ ] build (configurações de build/CI)
  - [ ] style (formatação/estilo, sem impacto funcional)
  - [ ] breaking change (quebra compatibilidade)

- **Área afetada**:
  - [ ] Frontend (Next.js/React/MUI)
  - [ ] API (App Router /api)
  - [ ] Banco/Prisma (schema/migrations/seeds)
  - [ ] Infra (scripts Docker/CI/CD)
  - [ ] Documentação (/docs, README)

## 🧾 Descrição

_Explique o que foi feito e por quê._

## 🧪 Como testar

_Passos objetivos para validar manualmente._

1. `npm ci`
2. Configurar `.env.local` conforme `.env.local.example`
3. (Opcional) `npm run infra:up && npm run infra:db:init`
4. `npm run dev`
5. Validar:
   - [ ] Fluxo X
   - [ ] Importação CSV
   - [ ] Regras de permissão
   - [ ] Integração com microsserviços (ex.: /api/cnaes)

## ✅ Checklist do Autor

- Qualidade:
  - [ ] `npm run type-check` ok
  - [ ] `npm run lint` ok
  - [ ] `npm run build` ok
- Domínio/Enums & Adapters:
  - [ ] Usei enums/tipos do `@anpdgovbr/shared-types` (fonte de verdade)
  - [ ] Fiz conversão para enums do Prisma somente na borda (adapters em `src/lib/adapters`)
- APIs (paginação/ordenação):
  - [ ] Para endpoints com `page/pageSize/orderBy`, apliquei clamp/whitelist conforme padrão (ver AGENTS.md)
- Banco de dados:
  - [ ] Não houve mudanças de schema **OU**
  - [ ] Incluí **migration Prisma** e atualizei seeds quando necessário
- Segurança & LGPD:
  - [ ] Sem segredos/credenciais em commits
  - [ ] Dados pessoais (se usados em exemplos) estão **mascarados**
  - [ ] Sem logs sensíveis adicionados
- Acessibilidade & i18n:
  - [ ] Semântica básica, labels/aria aplicados quando necessário
  - [ ] Textos passíveis de tradução (quando aplicável)
- UI/UX (MUI/GovBR):
  - [ ] Componentes seguem MUI 7 e DS GovBR
  - [ ] Uso de **props** e HOCs conforme padrão do projeto
- Documentação:
  - [ ] Atualizei README/docs quando necessário
  - [ ] Prints/GIFs incluídos (se UI mudou)

## 🔍 Evidências (screenshots/GIFs)

_Anexe imagens curtas, comparativos antes/depois se for UI._

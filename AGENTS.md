# Instruções para Agentes de Código (OpenAI Codex) — Backlog DIM

**IMPORTANTE: Responda sempre em português brasileiro.**

## Objetivo

Ajude a implementar features, correções e refatorações seguindo as convenções deste repositório. Forneça mudanças pequenas e verificáveis; prefira não alterar comportamento global sem testes/CI.

## Estrutura do Projeto e Organização

**Tecnologias principais:**

- Next.js 15 (App Router) + TypeScript + Prisma + MUI (Material-UI) + Turbopack em desenvolvimento
- Node.js >= 20, npm >= 10

**Estrutura de pastas:**

- `src/app/` — Páginas App Router, layouts e rotas de API (ex: `api/auth/...`)
- `src/config/` — Configurações de autenticação e aplicação (ex: `next-auth.config.ts`)
- `src/components/` — Componentes reutilizáveis de UI
- `src/lib/` — Utilitários e helpers (ex: `api.ts`, `fetcher.ts`)
- `src/hooks/` — Hooks customizados (ex: `useProcessos`, `useUsuarioIdLogado`)
- `src/context/` — Provedores de contexto (Audit, Notification, Session)
- `src/rbac/` — Helpers e integração de RBAC
- `prisma/` — Schema Prisma, seeds e helpers de migração
- `public/` — Assets estáticos
- `.env*` — Configurações locais (copie de `.env.example`; nunca faça commit de secrets)

## Comandos de Build, Teste e Desenvolvimento

**Comandos principais:**

- `npm run dev` — Inicia servidor local (Turbopack)
- `npm run build` — Gera cliente Prisma e faz build do Next.js
- `npm start` — Executa build de produção
- `npm test` | `npm run test:watch` | `npm run test:coverage` — Executa Vitest
- `npm run lint` | `npm run format` — ESLint (Next) e Prettier
- `npm run type-check` — Verificações TypeScript do projeto

**Comandos Prisma:**

- `npm run prisma:push` — Aplica mudanças do schema
- `npm run prisma:migrate` — Cria e aplica migrações
- `npm run prisma:studio` — Abre interface do Prisma Studio

**Comandos de infraestrutura (Docker):**

- `npm run infra:setup` — Configura infraestrutura local
- `npm run infra:up` — Inicia containers Docker
- `npm run infra:db:init` — Inicializa banco de dados

## Regras de Estilo e Padrões Específicos

**CRÍTICO - TypeScript e Imports:**

- **NUNCA use `any`** — Prefira `unknown` com type narrowing
- **Imports MUI e MUI Icons:** sempre importações individuais, SEM desestruturação:

  ```typescript
  // ✅ CORRETO
  import Button from "@mui/material/Button"
  import EditIcon from "@mui/icons-material/Edit"

  // ❌ ERRADO
  import { Button } from "@mui/material"
  import { Edit } from "@mui/icons-material"
  ```

**Priorização de componentes UI:**

1. **PRIMEIRO:** Use componentes da lib `@anpdgovbr/shared-ui`
2. **SEGUNDO:** Se não existir na shared-ui, então use MUI com importação individual

**Props de componentes React:**

- Todas as props devem usar `Readonly<>`:

  ```typescript
  type MyComponentProps = Readonly<{
    label: string
    onClick?: () => void
  }>

  export default function MyComponent(props: MyComponentProps) {
    // ...
  }
  ```

**Convenções de nomenclatura:**

- **Componentes/Classes/Types/Enums:** PascalCase
- **Arquivos de componente .tsx:** PascalCase (ex: `RequeridoForm.tsx`)
- **Diretórios/segmentos de rota:** kebab-case (ex: `importar-processos`)
- **Funções/variáveis/métodos:** camelCase
- **Hooks:** prefixo `use` + camelCase (ex: `useProcessos`)
- **Constantes:** UPPER_SNAKE_CASE
- **Indentação:** 2 espaços; Prettier controla aspas e formatação

## Performance e Carregamento Dinâmico

**Componentes não críticos** (modais, dialogs, visualizadores pesados) devem ser carregados dinamicamente:

```typescript
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const MyModal = dynamic(() => import('@/components/modals/MyModal'), {
  ssr: false
})

// Render condicional + Suspense
<Suspense fallback={<div />}>
  {isOpen && <MyModal onClose={close} />}
</Suspense>
```

**Motivo:** Evita aumentar o bundle inicial, melhora TTI e reduz uso de memória.

## Arquitetura e Fluxos Importantes

**Rotas:** `src/app` usa App Router; layouts e segmentação de pastas importam para roteamento.

**APIs:** Endpoints em `src/app/api/*` são functions serverless — seguir padrão existente (retornar Response/NextResponse).

**Hooks e fetching:** Use hooks definidos em `src/hooks` (ex: `useProcessos`, `useUsuarioIdLogado`) em vez de criar fetchers ad-hoc.

**Contextos/Providers:** `src/context` contém provedores (Audit, Notification, Session). Prefira usá-los para estado compartilhado.

**Formulários:** Use `react-hook-form` + validação com `zod` (v4) + resolver `@hookform/resolvers/zod`.

## Diretrizes de Teste

- **Framework:** Vitest
- **Localização:** Co-localize testes como `*.test.ts` / `*.test.tsx` próximo ao código fonte em `src/`
- **Foco:** Lógica de negócio, fluxos de autenticação e tratamento de erros
- **Validação:** Certifique-se que `npm run test` e `npm run type-check` passem antes do PR

## Diretrizes de Commit e Pull Request

- **Conventional Commits:** `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
- **PRs devem incluir:** descrição concisa, issues linkadas, screenshots para mudanças de UI, e passos de teste
- **Mantenha PRs pequenos e focados**; inclua notas de migração para mudanças de schema/env

## Dicas de Segurança e Configuração

**Variáveis de ambiente de autenticação obrigatórias:**

- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`

**Configurações:**

- Use Node >= 20 (`package.json` engines)
- Nunca faça commit de `.env`
- Trate interrupções do Keycloak graciosamente; evite loops de login

## Instruções Específicas para Agentes de Código

**Padrões obrigatórios:**

- **NÃO use `any`** em lugar algum
- Siga padrões existentes; mantenha mudanças com escopo limitado
- Atualize documentação ao tocar autenticação, rotas de API ou variáveis de ambiente
- Evite formatação em massa ou mudanças não relacionadas; prefira diffs mínimos

**Validação antes de mudanças:**

- Sempre execute `npm run lint` e `npm run type-check` antes de propor mudanças
- Se modificar comportamento de API ou banco, inclua alteração no `prisma/schema.prisma` e sugira comandos de migração

**Onde olhar primeiro (arquivos-chave):**

- `src/app/*` (rotas + layouts)
- `src/components/*` (UI e padrões)
- `src/lib/api.ts`, `src/lib/fetcher.ts` (chamadas para backend)
- `next.config.ts`, `package.json`, `eslint.config.mjs` (build, scripts, lint)
- `prisma/schema.prisma` e `prisma/seed.ts` (modelo de dados)

**Boas práticas:**

- Mantenha mudanças pequenas e fáceis de revisar
- Prefira não alterar comportamento global sem testes/CI
- Quando o requisito for ambíguo, proponha 1–2 alternativas pequenas
- Sempre inclua comandos de validação que você executou

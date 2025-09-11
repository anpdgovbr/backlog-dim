# Instruções para GitHub Copilot — Backlog DIM

**IMPORTANTE: Responda sempre em português brasileiro.**

## Objetivo Curto

Ajude a implementar features, correções e refatorações seguindo as convenções deste repositório. Forneça mudanças pequenas e verificáveis; prefira não alterar comportamento global sem testes/CI.

## Pontos Essenciais (Leia Antes de Editar)

**Stack tecnológico:**

- Projeto: Next.js 15 (App Router) + TypeScript + Prisma + MUI (Material-UI) + Turbopack em dev
- Pasta principal: `src/` (páginas App Router em `src/app`, APIs em `src/app/api`)
- Estado padrão: config ESLint moderna em `eslint.config.mjs` (flat config)

## Regras de Estilo e Padrões Específicos

**CRÍTICO - Imports e Types:**

- **NUNCA use `any`** — Sempre tipado, prefira `unknown` com type narrowing
- **Imports MUI e MUI Icons:** sempre importações individuais, SEM desestruturação:

  ```typescript
  // ✅ CORRETO
  import Button from "@mui/material/Button"
  import EditIcon from "@mui/icons-material/Edit"

  // ❌ EVITE
  import { Button } from "@mui/material"
  import { Edit } from "@mui/icons-material"
  ```

**Priorização de componentes UI:**

1. **PRIMEIRO:** Use componentes da lib `@anpdgovbr/shared-ui` (ex: Button, TextField, etc.)
2. **SEGUNDO:** Se não existir na shared-ui, então use MUI com importação individual

**Props de componentes React:**

- Todas as props devem usar `Readonly<>` para evitar mutações acidentais:

  ```typescript
  type MyComponentProps = Readonly<{
    label: string
    onClick?: () => void
  }>

  export default function MyComponent(props: MyComponentProps) {
    // ...
  }
  ```

**Hooks e contextos:**

- Use hooks definidos em `src/hooks` (ex: `useProcessos`, `useUsuarioIdLogado`) em vez de criar fetchers ad-hoc
- Contextos/Providers: `src/context` contém provedores (Audit, Notification, Session). Prefira usá-los para estado compartilhado

## Performance e Carregamento de Componentes Não Críticos

Componentes que não precisam ser renderizados imediatamente no carregamento da página (modais, dialogs, visualizadores pesados, editores WYSIWYG) devem ser carregados dinamicamente com `next/dynamic` e renderizados condicionalmente:

```typescript
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Import dinâmico
const MyModal = dynamic(() => import('@/components/modals/MyModal'), {
  ssr: false
})

// Render condicional + Suspense
<Suspense fallback={<div />}>
  {isOpen && <MyModal onClose={close} />}
</Suspense>
```

**Motivo:** Evita aumentar o bundle inicial, melhora TTI e reduz uso de memória em builds/execução.

## Arquitetura e Fluxos Importantes

**Rotas:** `src/app` usa App Router; layouts e segmentação de pastas importam para roteamento.

**API:** Endpoints em `src/app/api/*` são functions serverless — seguir padrão existente (retornar Response/NextResponse conforme exemplos).

**Prisma:** `prisma/schema.prisma` + `prisma/seed.ts`. Use `npx prisma migrate dev` ou scripts `npm run infra:db:init` quando rodar com docker-infra-pg.

## Workflows de Desenvolvedor (Comandos Rápidos)

- **Instalar dependências:** `npm install`
- **Rodar dev (Turbopack):** `npm run dev` ou `npm run dev:turbo`
- **Build:** `npm run build` (nota: o projeto pode pular lint durante build via `next.config.ts`)
- **Lint:** `npm run lint` (executa eslint com --fix)
- **Type check:** `npm run type-check`

## Padrões de Código e Exemplos Práticos

**Componentes:**

- `src/components/*` seguem padrão export default de componentes React com props tipadas
- Exemplos: CRUD manager em `src/components/CrudManager.tsx`, Avatar em `src/components/avatar`

**Requests para backend:**

- Use `lib/api.ts` e `lib/fetcher.ts` para consistência (SWR é usado para cache de dados)

**Formulários:**

- Use `react-hook-form` e validação com `zod` (v4) com resolver `@hookform/resolvers/zod`
- Siga componentes existentes em `components/form/*`

## Convenções de Nomenclatura (Padrão Recomendado)

- **Componentes/Classes/Types/Enums:** PascalCase
  - Ex.: `UserCard.tsx`, `ProcessManager`, `type UserDto`, `enum Status { Active, Inactive }`
- **Arquivos de componente .tsx:** PascalCase (um componente por arquivo, nome igual ao componente)
  - Ex.: `RequeridoForm.tsx`, `SidebarLayout.tsx`
- **Diretórios/segmentos de rota:** kebab-case (clareza em URLs e compatibilidade)
  - Ex.: `importar-processos`, `relatorios/top-requeridos`
- **Funções/variáveis/métodos:** camelCase
  - Ex.: `fetchUser`, `getServerSideProps`
- **Hooks:** prefixar com `use` + camelCase (`useProcessos`, `useUsuarioIdLogado`)
- **Constantes imutáveis:** UPPER_SNAKE_CASE
  - Ex.: `MAX_RETRIES`, `API_BASE_URL`
- **Enums TypeScript:** enum name PascalCase; members PascalCase (ou UPPER_CASE para flags/constants)

## Integrações e Configurações

**NextAuth/Keycloak:**

- Ver `src/config/next-auth.config.ts` e variáveis em `.env.example`
- Variáveis obrigatórias: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`

**Banco:**

- Usar `docker-infra-pg` com scripts `infra:*` para desenvolver localmente
- Comandos úteis: `npm run infra:setup`, `npm run infra:up`, `npm run infra:db:init`

## Boas Práticas para Aprovação Automática

**Sempre execute antes de propor mudanças:**

- `npm run lint` — Corrige problemas de estilo automaticamente
- `npm run type-check` — Verifica erros de TypeScript

**Se modificar comportamento de API ou banco:**

- Inclua alteração no `prisma/schema.prisma`
- Sugira comandos de migração (`npx prisma migrate dev`)

## Arquivos-Chave (Onde Olhar Primeiro)

- `src/app/*` — Rotas + layouts
- `src/components/*` — UI e padrões
- `src/lib/api.ts`, `src/lib/fetcher.ts` — Chamadas para backend
- `next.config.ts`, `package.json`, `eslint.config.mjs` — Build, scripts, lint
- `prisma/schema.prisma` e `prisma/seed.ts` — Modelo de dados

## Diretrizes de Contribuição e PRs

- **Mantenha mudanças pequenas e fáceis de revisar**
- Quando adicionar ou alterar regras ESLint/Prettier, atualize `doc/ESLINT.md`
- Ao criar novas páginas App Router, gere rotas de desenvolvimento com `npm run build-routes`
- **Evite mudanças em infra e scripts cross-project** sem sinal claro no PR

## Notas Finais

- **Evite mudanças em infra** sem necessidade clara — repositório segue convenções corporativas
- **Quando requisito for ambíguo:** pergunte e proponha 1–2 alternativas pequenas
- **Sempre inclua comandos de validação** que você executou (lint, type-check)
- **Prefira não alterar comportamento global** sem testes/CI adequados

---

**Lembrete crítico:** Responda sempre em pt-BR. Imports MUI e MUI Icons sempre individuais e sem desestruturação. NUNCA use `any`.

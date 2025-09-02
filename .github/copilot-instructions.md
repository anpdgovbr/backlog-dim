# Instruções para agentes de código (Copilot / AI) — Backlog DIM

Objetivo curto: ajude a implementar features, correções e refatorações seguindo as convenções deste repositório. Forneça mudanças pequenas e verificáveis; prefira não alterar comportamento global sem testes/CI.

Pontos essenciais (leia antes de editar):

- Projeto: Next.js 15 (App Router) + TypeScript + Prisma + MUI (Material-UI) + Turbopack em dev.
- Pasta principal: `src/` (páginas App Router em `src/app`, APIs em `src/app/api`).
- Estado padrão: config ESLint moderna em `eslint.config.mjs` (flat config). Há arquivos legados (`.eslintrc.*`) usados para compatibilidade com ferramentas externas.

Regras de estilo e padrões específicos:

- Imports MUI e MUI Icons: sempre importações individuais, sem desestruturação. Exemplo correto:
  - `import Button from '@mui/material/Button'`
  - `import EditIcon from '@mui/icons-material/Edit'`
    Evite: `import { Button } from '@mui/material'` ou `import { Edit } from '@mui/icons-material'`.
- Tipos e hooks: use os hooks definidos em `src/hooks` (ex: `useProcessos`, `useUsuarioIdLogado`) em vez de criar fetchers ad-hoc quando possível.
- Contextos/Providers: `src/context` contém provedores (Audit, Notification, Session). Prefira usá-los para estado compartilhado.

- Props dos componentes: todas as props de componentes React devem usar `Readonly<>` no tipo (ex: `type Props = Readonly<{ id: string; onClose?: () => void }>`). Isso evita mutações acidentais e segue o padrão do código existente.
  - Exemplo curto:
    - `type MyComponentProps = Readonly<{ label: string; onClick?: () => void }>`
    - `export default function MyComponent(props: MyComponentProps) { /* ... */ }`

Arquitetura e fluxos importantes:

- Rotas: `src/app` usa App Router; layouts e segmentação de pastas importam para roteamento.
- API: endpoints em `src/app/api/*` são functions serverless — seguir o padrão existente (retornar Response/NextResponse conforme exemplos em `src/app/api`).
- Prisma: `prisma/schema.prisma` + `prisma/seed.ts`. Use `npx prisma migrate dev` ou os scripts `npm run infra:db:init` quando rodar com docker-infra-pg.

Workflows de desenvolvedor (rápidos):

- Instalar dependências: `npm install`
- Rodar dev (Turbopack): `npm run dev` ou `npm run dev:turbo`
- Dev HTTPS (certificados locais): `npm run dev:turbo:https` (usa `scripts/dev-server.mjs`, que já passa `turbo: true` quando `NODE_ENV !== 'production'`).
- Build: `npm run build` (nota: o projeto atualmente pode pular lint durante build via `next.config.ts`)
- Lint: `npm run lint` (executa eslint com --fix)

Contribuições e PRs:

- Mantenha mudanças pequenas e fáceis de revisar. Quando adicionar ou alterar regras de ESLint/Prettier, atualize `docs/ESLINT.md` também.
- Ao criar novas páginas no App Router, gere rotas de desenvolvimento com `npm run build-routes` (muito usado pelo projeto).

Padrões de código e exemplos práticos:

- Componentes: `src/components/*` seguem padrão export default de componentes React com props tipadas. Exemplos:
  - CRUD manager em `src/components/CrudManager.tsx`
  - Avatar em `src/components/avatar`
- Requests para backend: use `lib/api.ts` e `lib/fetcher.ts` para consistência (SWR é usado para cache de dados).
- Formulários: use `react-hook-form` e validação com `zod` (v4) com o resolver `@hookform/resolvers/zod`, seguindo os componentes existentes (`components/form/*`).

Recomendações de convenções de nomenclatura (padrão recomendado):

- Componentes / Classes / Types / Enums: PascalCase
  - Ex.: `UserCard.tsx`, `ProcessManager`, `type UserDto`, `enum Status { Active, Inactive }`
- Arquivos de componente `.tsx`: PascalCase (um componente por arquivo, nome do arquivo igual ao componente)
  - Ex.: `RequeridoForm.tsx`, `SidebarLayout.tsx`
- Diretórios / segmentos de rota: kebab-case (recomendado para clareza em URLs e compatibilidade de sistemas de arquivos)
  - Ex.: `importar-processos`, `relatorios/top-requeridos`
- Funções, variáveis e métodos: lowerCamelCase
  - Ex.: `fetchUser`, `getServerSideProps`
- Hooks: prefixar com `use` e usar camelCase (`useProcessos`, `useUsuarioIdLogado`). O arquivo pode seguir o padrão do time (ex.: `useProcessos.ts`).
- Constantes imutáveis: UPPER_SNAKE
  - Ex.: `MAX_RETRIES`, `API_BASE_URL`
- Enums TypeScript: enum name em PascalCase; members preferencialmente PascalCase (ou UPPER_CASE para flags/constants)

Enforcement sugerido (opcional)

- Regras ESLint recomendadas para impor convenções:
  - `@typescript-eslint/naming-convention` para tipos/classe/variáveis/funções/enums
  - `eslint-plugin-filenames` para forçar PascalCase em arquivos de componente `.tsx`
- Processo recomendado: adicionar as regras no `.eslintrc` e rodar `npm run lint` + `npm run type-check`, depois aplicar autofix e revisar renomeações de arquivos/paths.

Integrações e segredos:

- Azure AD / NextAuth: ver `src/config/next-auth.config.ts` e variáveis em `.env.example`.
- Banco: usar `docker-infra-pg` com os scripts `infra:*` para desenvolver localmente.

Como aprovar alterações automaticamente (boas práticas para agentes):

- Sempre rode `npm run lint` e `npm run type-check` localmente antes de propor mudanças.
- Se modificar comportamento de API ou banco, inclua alteração no `prisma/schema.prisma` e sugira comandos de migração (`npx prisma migrate dev`).

Onde olhar primeiro (arquivos-chave):

- `src/app/*` (rotas + layouts)
- `src/components/*` (UI e padrões)
- `src/lib/api.ts`, `src/lib/fetcher.ts` (chamada p/ backend)
- `next.config.ts`, `package.json`, `eslint.config.mjs` (build, scripts, lint)
- `prisma/schema.prisma` e `prisma/seed.ts` (modelo de dados)

Notas finais:

- Evite mudanças em infra e scripts cross-project sem sinal claro no PR; esse repositório segue convenções corporativas (docker-infra-pg, scripts de versionamento).
- Pergunte quando o requisito for ambíguo e proponha 1–2 alternativas pequenas. Sempre inclua os comandos de validação que você executou.

Feedback: me diga se quer que eu inclua exemplos de código adicionais, regras de commit, ou padrão de mensagens de PR.

---

Muito importante: responder sempre em pt-BR. Imports MUI e MUIIcons devem ser sempre individuais e sem desestruturaçãoe sem usar any.

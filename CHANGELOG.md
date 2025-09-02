# 📦 Changelog — Resumo Inicial Público

Este changelog resume os principais pontos do histórico do projeto após a limpeza e padronização para início do ciclo público.

## Principais Pontos do Histórico

- Correções críticas de build e modernização (TypeScript, ESLint, NextAuth, MUI)
- Migração para ESLint flat config e automação de qualidade
- Scripts de versionamento otimizados (bump patch/minor/major)
- Documentação técnica criada e atualizada
- Atualização e padronização das dependências principais (React, MUI, Prisma, ESLint, Prettier)
- Novos endpoints e funcionalidades (dashboard, CNAE, Setor, usuários, perfis, permissões)
- Refatoração de componentes e hooks para performance e validação
- Migração completa para MUI v7 e padrões modernos de UI/UX
- Remoção de código, rotas e arquivos obsoletos
- Padronização de licença (CC BY 4.0)

## Estado Atual

O projeto está pronto para evoluir de forma colaborativa, com estrutura enxuta, documentação atualizada e ambiente moderno.

Todas as novas funcionalidades, correções e melhorias serão registradas aqui, marcando o início do desenvolvimento público do Backlog DIM.
**Responsável:** Luciano Édipo

---

## 🔒 Validação Server-side e Client-side — Migração para Zod v4

- Adotado Zod v4 como padrão único de validação (server e client).
- Endpoints críticos com validação server-side e erro 400 padronizado (`src/lib/validation.ts`).
- Formulários de Processo migrados para `zodResolver` (RHF) e novos schemas (`src/schemas/ProcessoForm.zod.ts`).
- Removido Yup do projeto (código, dependências e docs); documentado em `doc/SERVER_VALIDATION.md` e `.github/copilot-instructions.md`.
- Observação de regra de negócio: `PUT /api/processos/[id]` permite limpar campos opcionais com `null`; atualização de `numero` e `dataCriacao` permanece habilitada e poderá ser restrita por perfil no futuro.

---

## 🧱 Refactor RequeridoForm and Introduce RequeridoModalForm

- Refactored `RequeridoForm` to use `react-hook-form` with `forwardRef` to expose `submit()` externally.
- Introduced `RequeridoModalForm` using `GenericFormDialog` for clean modal encapsulation.
- Removed internal submit button; now handled externally via modal `onSubmit`.
- Enhanced validation with `validateEmail`, `validateSite` and proper RHF error reporting.
- Implemented `SetorDropdownSection` and `Autocomplete` for CNAE with async loading.
- Added `displayName` to `forwardRef` components for ESLint compliance.
- Removed all `any` in JSX intrinsic types for GovBR Web Components.

## 🎨 UI/UX Improvements and Compatibility

- Updated `FormDropdown` to use `slotProps` instead of deprecated `SelectProps`, `InputLabelProps`.
- Migrated all `Grid` components to `Grid2` (Unstable_Grid2), later replaced by `Grid` from MUI v7.
- Removed all usage of deprecated MUI props.
- Ensured compliance with MUI 7 migration rules and `DataGrid` slot refactor patterns.

## 🛠 ESLint & Linting Enhancements

- Migrated from `.eslintrc.json` to `eslint.config.ts` using `FlatCompat`.
- Activated rules: `no-unused-vars`, `no-console` (with allow: [`warn`, `error`]), `no-debugger`.
- Enabled `@typescript-eslint/no-explicit-any`, `consistent-type-imports`, `no-require-imports` (ignored for `.cjs`).
- Added `ignores` to handle `.cjs`, `node_modules`, `public`, `.next`, etc.
- Set up `files` override for TypeScript rules only on `*.ts` / `*.tsx`.

## 🧹 Cleanup and Quality of Life

- Removed all unused imports across the codebase.
- Replaced `require()` usages in `.cjs` files with `ignores` in ESLint instead of rewrite.
- Added `Grid2 → Grid` migration path using codemods where applicable.
- Enabled `editor.codeActionsOnSave` for auto-fix and organize imports in VS Code.

## ⬆️ Dependencies Upgraded

- Migrated `@mui/material` from `6.4.7` to `^7.0.2`.
- Migrated `@mui/icons-material` and `@mui/x-data-grid` to latest versions.
- Upgraded `react` and `react-dom` to `^19.1.0`.
- Updated other dependencies (`supabase-js`, `typescript`, `eslint`, `prettier`, etc.) to latest patch/minor versions using `ncu`.

---

**Nota:** Essa versão marca a transição oficial do projeto para o MUI v7, com a eliminação completa de APIs depreciadas. O código agora está preparado para compatibilidade futura e segue práticas modernas de linting, tipagem e componentização.

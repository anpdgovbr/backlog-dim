# 🚀 Melhorias e Atualizações Gerais

**Data:** 13/07/2025
**Versão:** 0.1.121
**Responsável:** Luciano Édipo

---

### ⬆️ Atualizações de Dependências

- `302f3fe` - fix: Atualizar versão do pacote @mui/x-data-grid para 8.8.0 e eslint para 9.31.0
- `3126a50` - fix: Atualizar versão do pacote @anpd/shared-types e @emotion/styled
- `4d80285` - fix: Atualizar dependências e ajustar configurações do TypeScript
- `9b78e85` - fix: Updating the MUI version to prevent deprecation issues.
- `dc1450f` - chore: update dependencies for @mui/x-data-grid, sass, tsx, and eslint packages
- `e13cb88` - ATualizando dependencias
- `16f99bd` - fix: update prisma dependencies to version 6.9.0 and remove unused useEffect in useControladores hook

### ✨ Novas Funcionalidades

- `aff331a` - feat: add public dashboard page with multiple dashboard cards
- `42a6441` - feat: implement GET and POST endpoints for CNAE and Setor with error handling
- `9d57521` - feat: update dashboard layout to use xl container width, add StatsDashboardCard for process statistics
- `f24ebc6` - feat: normalize text for request types and themes in dashboard card, improve layout and tab styling
- `b87fe37` - feat: atualizar cores e melhorar layout do ProcessDashboardCard, ajustando tamanhos e espaçamentos
- `53ace3ff` - feat: adicionar novos indicadores de processos e gráficos no dashboard, removendo rotas obsoletas
- `942b96d` - feat: add new dashboard cards for top required and responsible entities, enhance existing cards, and update theme colors
- `590d6a5` - feat: refactor useApi function to improve URL handling logic for better clarity
- `17a959c` - feat: refactor useApi function to construct final URL using API_BASE_URL for improved flexibility
- `485a323` - feat: refactor GET handler in CNAE route for improved error handling; remove unused Requeridos routes and update allowed entities
- `84b1a2d` - feat: update POST handlers in CNAE and Setor routes to use external API for data creation; improve error handling
- `e60cba1` - feat: Enhance RequeridoDropdownSection with Autocomplete and dynamic fetching
- `7c03d21` - feat: implement CNPJ and CNAE hooks for improved data fetching; enhance ProcessoForm and RequeridoForm with new functionalities
- `a587200` - feat: add DashboardCard component and related subcomponents for improved dashboard UI; implement Metadados and Process dashboard cards
- `c6744e1` - feat: enhance RequeridoForm validation and add telefone validation; update data grid styles and component layouts
- `37e27b0` - feat: implement CnaeDropdownSection component for dynamic CNAE selection in RequeridoForm
- `427ff9e` - feat: update RequeridoForm to handle CPF and CNPJ validation, enhance form structure, and integrate remask for input formatting
- `8f01b25` - feat: add FormDateField component for controlled date input and integrate it into ProcessoForm
- `0b1d707` - feat: enhance data comparison in handlerPUT for date and array fields
- `8f687eb` - feat: enhance date handling in processo forms and schema with safeToISO utility
- `3713699` - feat: update version in package.json and refactor processo input handling in ModalEditarProcesso and Processo types
- `da78467` - feat: update processo form and validation schema for improved data handling
- `fb7d937` - feat: add lodash for deep comparison and update statusInterno logic in processo editing
- `df6eb20` - feat: add processoSchema for process form validation
- `c57207f` - feat: enhance error handling and state management in dashboard cards
- `e9d6bfd` - feat: add pull request template for better contribution guidelines
- `1dc10f8` - feat: update README with new sections and enhance API process handling

### 🐛 Correções e Melhorias

- `9b9e894` - fix: Add user Eduardo Anjos to seed data with upsert
- `b9429da` - fix permission
- `f954688` - fix: Atualizar README.md para refletir mudanças no sistema de gestão de processos
- `a88590d` - fix: update ProcessoForm to use slotProps for tipoRequerimento select
- `e827648` - chore: resolvendo conflitos e ajustando versão
- `d6830c6` - fix: update FormDateField to use slotProps for input label shrinking
- `0ccb332` - 0
- `2090dcd` - refactor: reorganize processoSchema by moving dataEnvioPedido and tipoRequerimento to optional fields
- `b522179` - update supabase
- `754938e` - chore: update package.json to include yup and its types, remove unused import in ProcessoSchema
- `339fc07` - fix: clean up unused code and formatting in various files
- `6cbe953` - testando pre-commit
- `6280a31` - adição do usuario Gustavo Fernandes Lima
- `8c6f6d7` - fix: update base URL handling in GET function for consistency and clarity
- `87390be` - fix: update base URL in multiple routes to use production endpoint for consistency
- `98bb7aa` - fix: add NODE_EXTRA_CA_CERTS to production environment for SSL certificate handling
- `453df8d` - fix: update base URL in CONTROLADORES_API_URL for production environment
- `23aecb7` - refactor: streamline Dashboard25LayoutBase layout and remove unused comments
- `55c0f33` - refactor: improve layout and styling of data grids and modal forms
- `82d4e49` - fix: correct version number format in CHANGELOG.md
- `51f0433` - fix: update version number in CHANGELOG.md to correct format
- `8b4c72b` - Refactor RequeridoForm and introduce RequeridoModalForm component

# 📦 Changelog — Refactor e Migração para MUI v7

**Data:** 23/04/2025  
**Versão:** 0.1.55  
**Responsável:** Luciano Édipo

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

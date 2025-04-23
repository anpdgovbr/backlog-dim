# 📦 Changelog — Refactor e Migração para MUI v7

**Data:** 23/04/2025  
**Versão:** 0.2.0  
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
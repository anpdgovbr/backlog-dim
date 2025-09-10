# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` – App Router pages, API routes (e.g., `api/auth/...`), layouts.
- `src/config/` – Auth and app configuration (e.g., `next-auth.config.ts`).
- `src/lib/`, `src/hooks/`, `src/components/`, `src/context/` – Reusable logic and UI.
- `src/rbac/` – RBAC integration helpers.
- `prisma/` – Prisma schema, seeds, and migration helpers.
- `public/` – Static assets.
- `.env*` – Local configuration (use `.env.example` as template; never commit secrets).

## Build, Test, and Development Commands
- `npm run dev` – Start local dev server with Turbopack.
- `npm run build` – Generate Prisma client and build Next.js.
- `npm start` – Run the production build.
- `npm test` / `npm run test:watch` / `npm run test:coverage` – Run Vitest.
- `npm run lint` / `npm run format` – ESLint (Next) and Prettier.
- `npm run type-check` – TypeScript checks.
- Prisma: `npm run prisma:push`, `npm run prisma:migrate`, `npm run prisma:studio`.

## Coding Style & Naming Conventions
- TypeScript first; avoid `any`. Prefer `unknown` + type narrowing.
- Indentation: 2 spaces; single quotes or double consistently (Prettier enforces).
- Components: `PascalCase`; functions/vars: `camelCase`; files: `kebab-case` unless Next.js requires otherwise (e.g., `page.tsx`).
- Prefer named exports; keep diffs minimal; do not introduce unrelated refactors.
- Lint/format before pushing.

## Testing Guidelines
- Framework: Vitest.
- Name tests `*.test.ts` or `*.test.tsx` and co-locate near code under `src/`.
- Aim for meaningful unit tests around business logic and auth flows.
- Run `npm run test` and ensure `npm run type-check` passes before PR.

## Commit & Pull Request Guidelines
- Use Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`). The history follows this style.
- PRs must include: concise description, linked issues, screenshots for UI changes, and testing steps.
- Keep PRs focused and small; include migration notes if schema or env vars change.

## Security & Configuration Tips
- Required env vars for auth: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`.
- Node >= 20 (see `package.json engines`). Never commit `.env`.
- Handle auth errors gracefully; do not create login loops if Keycloak is unavailable.

## Agent-Specific Instructions
- Do not use `any`. Follow existing patterns and keep changes scoped.
- Update docs when touching auth, API routes, or environment variables.
- Avoid mass formatting or unrelated changes. Prefer `apply_patch`-style minimal diffs.

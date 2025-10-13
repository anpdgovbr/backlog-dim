# Sistema de Versionamento Automático

Este projeto implementa um sistema automatizado para controle de versão e geração de arquivos de versão.

## Como Funciona

### Automático (Recomendado)

- **A cada commit relevante**: O hook `pre-commit` do Husky automaticamente:
  1. **Verifica se deve fazer bump** (pula commits de docs, chore, style, etc.)
  2. **Incrementa a versão patch** no `package.json` (apenas para commits funcionais)
  3. **Gera/atualiza** o `public/version.json`
  4. **Adiciona ambos os arquivos** ao commit

#### Commits que **NÃO** fazem bump automático:

- `docs:`, `chore:`, `style:`, `refactor:`, `test:`, `ci:`
- Branches de desenvolvimento (`feature/`, `fix/`, `hotfix/`, `bugfix/`)
- Quando `package.json` já foi modificado no commit

### Manual

- **Gerar version.json**: `npm run generate:version`
- **Usar npm version**: `npm version patch|minor|major` (também atualiza o version.json via hook)

## Estrutura do version.json

```json
{
  "name": "backlog-dim",
  "version": "0.1.123",
  "buildTime": "2025-07-25T13:04:41.967Z",
  "buildTimestamp": 1753448681968,
  "environment": "development",
  "commit": "4b41b15337899ae7f7dc2b1902e131a8de8b4b10",
  "commitShort": "4b41b15",
  "branch": "main"
}
```

## Uso no Frontend

```typescript
// Acessar informações de versão
const response = await fetch("/version.json")
const versionInfo = await response.json()

console.log(`Versão: ${versionInfo.version}`)
console.log(`Build: ${versionInfo.buildTime}`)
console.log(`Commit: ${versionInfo.commitShort}`)
```

## Scripts Disponíveis

- `npm run generate:version` - Gera o version.json manualmente
- `npm run prebuild` - Executado antes do build (inclui geração de versão)

## Arquivos Relacionados

- `scripts/generate-version.cjs` - Gera o version.json
- `scripts/bump-version.cjs` - Incrementa versão e gera version.json
- `.husky/pre-commit` - Hook que automatiza o processo
- `.husky/post-version` - Hook para quando usar `npm version`

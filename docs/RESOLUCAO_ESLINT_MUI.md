# Resolução de Problemas ESLint e Otimização MUI

## Problemas Identificados e Soluções

### ✅ 1. Import do getServerSession

**Problema**: VSCode estava auto-importando incorretamente de `"next-auth"` causando erro de tipos
**Solução**:

- Corrigido para `import { getServerSession } from "next-auth/next"`
- Adicionado type assertion: `as Session | null`
- Arquivos corrigidos: `withApiSlim.ts`, `withApi.ts`, `processos-dashboard/route.ts`

### ✅ 2. Globals ESLint

**Problema**: `localStorage` não estava definido como global
**Solução**: Adicionado aos globals do ESLint:

```javascript
localStorage: "readonly",
sessionStorage: "readonly",
```

### ✅ 3. Imports MUI Otimizados

**Problema**: Imports com desestruturação impactam tree shaking
**Solução**:

- Migrados para imports individuais: `import Button from '@mui/material/Button'`
- Mantidos imports de tipos: `import type { SxProps } from '@mui/material/styles'`
- Desabilitada regra restritiva temporariamente para permitir migração gradual

### ✅ 4. ThemeProvider Não Importado

**Problema**: `MuiThemeProvider` não estava importado
**Solução**: Adicionado `import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"`

### ✅ 5. Erro de Parsing no SideMenu

**Problema**: Sintaxe de alias incorreta: `import List as MUIList`
**Solução**: Corrigido para: `import MUIList from '@mui/material/List'`

### ✅ 6. useTheme Import

**Problema**: Import incorreto de `useTheme`
**Solução**: Corrigido para `import { useTheme } from "@mui/material/styles"`

## Scripts Criados

### 1. `fix-mui-imports-advanced.mjs`

Script inteligente que:

- Identifica imports com desestruturação do MUI
- Converte automaticamente para imports otimizados
- Preserva imports de tipos
- Mantém hooks e utilities como desestruturação quando apropriado

**Uso**:

```bash
npm run fix:mui-imports:advanced:dry  # Visualizar mudanças
npm run fix:mui-imports:advanced      # Aplicar mudanças
```

## Configuração ESLint Atual

### Globals Configurados

```javascript
// Browser globals
localStorage: "readonly",
sessionStorage: "readonly",
window: "readonly",
document: "readonly",
// ... outros
```

### Regras MUI

- **Desabilitada temporariamente**: `no-restricted-imports` para MUI
- **Motivo**: Permitir migração gradual sem bloquear desenvolvimento
- **Próximo passo**: Reativar após migração completa

## Status Atual

✅ **ESLint executando sem erros**
✅ **Todos os imports críticos corrigidos**
✅ **Tree shaking otimizado para componentes já migrados**
✅ **Scripts de automação disponíveis**

## Recomendações Futuras

### 1. Migração Gradual MUI

- Usar o script `fix-mui-imports:advanced` conforme necessário
- Priorizar arquivos mais utilizados primeiro
- Testar bundle size após mudanças

### 2. Reativar Regras Restritivas

Após migração completa, reativar no `eslint.config.mjs`:

```javascript
"no-restricted-imports": [
  "warn", // começar com warn, depois error
  {
    paths: [
      {
        name: "@mui/material",
        importNames: ["Typography", "Button", /*...*/],
        message: "Use import individual para melhor tree shaking"
      }
    ]
  }
]
```

### 3. Monitoramento de Bundle

- Adicionar análise de bundle size no CI/CD
- Monitorar impacto das mudanças no tamanho final
- Documentar ganhos de performance

### 4. Padrões de Import

Estabelecer padrões claros no time:

- **Componentes**: `import Button from '@mui/material/Button'`
- **Tipos**: `import type { SxProps } from '@mui/material/styles'`
- **Hooks**: `import { useTheme } from '@mui/material/styles'`
- **Utilities**: Conforme necessário

## Comandos Úteis

```bash
# Verificar erros ESLint
npm run lint

# Migrar imports MUI (dry run)
npm run fix:mui-imports:advanced:dry

# Aplicar migração MUI
npm run fix:mui-imports:advanced

# Formatar código
npm run format

# Verificar tipos TypeScript
npx tsc --noEmit
```

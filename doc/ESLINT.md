# Configuração ESLint - Backlog DIM

## ✅ Resumo da Configuração

A configuração do ESLint foi otimizada para garantir qualidade de código e performance. As principais melhorias implementadas:

### 🧹 Limpeza de Configurações Duplicadas

- ❌ **REMOVIDO**: `eslintConfig` do `package.json` (obsoleto)
- ✅ **MANTIDO**: `eslint.config.mjs` (configuração atual do ESLint 9)

### 📦 Regras de Importação MUI

Foi implementada a regra `no-restricted-imports` para otimizar o bundle size, evitando imports de primeiro nível:

```javascript
// ❌ EVITAR (imports de primeiro nível)
import { Button, Typography } from "@mui/material"
import { Add, Delete } from "@mui/icons-material"

// ✅ RECOMENDADO (imports específicos)
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
```

### 🎯 Benefícios

1. **Bundle Size**: Reduz significativamente o tamanho do bundle
2. **Tree Shaking**: Melhora a eficiência do tree shaking
3. **Performance**: Build mais rápido e aplicação mais leve
4. **Consistência**: Padroniza a forma de importar componentes MUI

## 🛠️ Scripts Disponíveis

```bash
# Executar lint com correções automáticas
npm run lint

# Verificar imports MUI sem aplicar mudanças
npm run fix:mui-imports:dry

# Corrigir automaticamente imports MUI
npm run fix:mui-imports

# Formatar código
npm run format
```

## 🚨 Regras Implementadas

### TypeScript

- `@typescript-eslint/no-unused-vars`: Erro para variáveis não utilizadas
- `@typescript-eslint/consistent-type-imports`: Força uso de import type
- `@typescript-eslint/no-explicit-any`: Warning para uso de any

### Código Geral

- `no-console`: Warning (permite warn/error)
- `no-debugger`: Warning

### MUI Específicas

- `no-restricted-imports`: Erro para imports de primeiro nível do MUI

## 📁 Arquivos Ignorados

```javascript
{
  "ignores": [
    "node_modules/",
    ".next/",
    "public/",
    "prisma/",
    "scripts/*.cjs",
    "docs/",
    "*.config.{js,ts,mjs}"
  ]
}
```

## 🔧 Script de Migração Automática

O projeto inclui um script que corrige automaticamente os imports MUI:

### Uso Básico

```bash
# Visualizar mudanças sem aplicar
npm run fix:mui-imports:dry

# Aplicar mudanças
npm run fix:mui-imports
```

### Componentes Mapeados

O script reconhece automaticamente os principais componentes MUI:

- Material components (Button, Typography, Box, etc.)
- Icons (todos os ícones do @mui/icons-material)
- Data Grid components
- E muitos outros...

### Exemplo de Conversão

```typescript
// ANTES
import { Button, Typography, Box } from "@mui/material"
import { Add, Delete, Edit } from "@mui/icons-material"

// DEPOIS (automaticamente convertido)
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
```

## 🏃‍♂️ Migração Gradual

### Opção 1: Migração Automática (Recomendado)

```bash
npm run fix:mui-imports
```

### Opção 2: Migração Manual

1. Execute o lint para ver os erros: `npm run lint`
2. Corrija manualmente os imports seguindo as mensagens
3. Execute novamente até não haver mais erros

### Opção 3: Por Arquivos Específicos

```bash
# Apenas componentes
node scripts/fix-mui-imports.mjs "src/components/**/*.{ts,tsx}"

# Apenas páginas
node scripts/fix-mui-imports.mjs "src/app/**/*.{ts,tsx}"
```

## 🚀 Próximos Passos

1. **Execute a migração**: `npm run fix:mui-imports`
2. **Verifique o resultado**: `npm run lint`
3. **Teste a aplicação**: `npm run dev`
4. **Commit as mudanças**: As regras já estão integradas ao pre-commit hook

## 📊 Impacto Esperado

- **Bundle Size**: Redução de 20-40% no tamanho do bundle MUI
- **Build Time**: Melhoria significativa no tempo de build
- **Runtime**: Carregamento mais rápido da aplicação
- **Manutenibilidade**: Código mais consistente e fácil de manter

## ❓ FAQ

### Por que evitar imports de primeiro nível?

Imports de primeiro nível fazem o bundler incluir toda a biblioteca, mesmo usando apenas alguns componentes.

### E se eu usar um componente não mapeado?

O script tentará criar o import automaticamente seguindo o padrão `@mui/material/ComponentName`.

### Posso ainda usar imports de primeiro nível em casos especiais?

Para casos muito específicos, você pode desabilitar a regra localmente:

```typescript
// eslint-disable-next-line no-restricted-imports
import { SpecialComponent } from "@mui/material"
```

### Como verificar o tamanho do bundle?

Execute `npm run build` e verifique o output do Next.js com as informações de bundle size.

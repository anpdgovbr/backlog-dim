# Deploy Standalone e Arquivos Públicos

## Problema

Quando configuramos `output: "standalone"` no `next.config.ts`, o Next.js gera uma pasta `.next/standalone` otimizada para deploy, mas **não copia automaticamente** os arquivos da pasta `public/`.

Isso causava o problema onde o `version.json` (gerado no prebuild) não estava disponível em runtime, resultando no componente `BuildInfo` não exibir informações de versão.

## Solução Implementada

### 1. Script de Cópia Automática

Criamos o script `scripts/copy-public-to-standalone.cjs` que:

- Copia recursivamente todo conteúdo de `public/` para `.next/standalone/public/`
- É executado automaticamente após o `next build` via script `postbuild`
- Valida que o build standalone existe antes de copiar

### 2. Integração no Build

O `package.json` foi atualizado:

```json
{
  "scripts": {
    "build": "prisma generate && next build && pnpm run postbuild",
    "postbuild": "node scripts/copy-public-to-standalone.cjs"
  }
}
```

Fluxo de build completo:

1. `prebuild` → Gera `version.json`, env vars e rotas de dev
2. `prisma generate` → Gera cliente Prisma
3. `next build` → Cria build otimizado com pasta standalone
4. `postbuild` → **Copia arquivos públicos para standalone**

## Estrutura de Deploy Standalone

Após o build, a estrutura fica:

```
.next/
└── standalone/
    ├── server.js              # Servidor Node otimizado
    ├── package.json           # Deps mínimas
    ├── node_modules/          # Apenas deps necessárias
    ├── .next/                 # Build interno do Next
    └── public/                # ← Copiado pelo nosso script
        ├── version.json       # ← Agora disponível!
        ├── dev-routes.json
        └── ... outros assets
```

## Como Executar em Produção

### Opção 1: Servidor Node Direto

```bash
# Após build
cd .next/standalone
node server.js
```

### Opção 2: PM2

```bash
# Após build
cd .next/standalone
pm2 start server.js --name backlog-dim
```

### Opção 3: Docker

```dockerfile
FROM node:22-alpine AS base

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copia build standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# public/ já foi copiado para standalone pelo script

EXPOSE 3000
CMD ["node", "server.js"]
```

## Arquivos Públicos Importantes

Os seguintes arquivos são essenciais e devem estar em `public/`:

- **`version.json`** — Informações de build (versão, commit, data)
- **`dev-routes.json`** — Mapa de rotas para desenvolvimento
- **`docs/`** — Documentação TypeDoc (se gerada)

## Verificação

Para verificar se os arquivos foram copiados corretamente após build:

```bash
# Windows PowerShell
ls .next/standalone/public/

# Linux/Mac
ls -la .next/standalone/public/
```

Deve listar `version.json` e outros arquivos da pasta `public/`.

## Troubleshooting

### BuildInfo não mostra informações

**Causa**: `version.json` não foi copiado para standalone

**Solução**:

```bash
# Re-execute o postbuild manualmente
pnpm run postbuild

# Ou faça build completo novamente
pnpm run build
```

### Erro "Pasta .next/standalone não encontrada"

**Causa**: Build standalone não foi gerado

**Solução**:

1. Verifique se `output: "standalone"` está em `next.config.ts`
2. Execute `pnpm run build` (sem executar apenas `next build`)
3. Confirme que pasta `.next/standalone/` existe

### Assets estáticos não carregam

**Causa**: Falta copiar `.next/static` em deploy manual

**Solução**: Além de `public/`, você também precisa copiar `.next/static`:

```bash
# Copie para o servidor
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
```

## Referências

- [Next.js Standalone Output](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- Issue relacionada: [Next.js #51921](https://github.com/vercel/next.js/discussions/51921)

---

**Última atualização**: 13/10/2025  
**Versão do Next.js**: 15.x

# Deploy Standalone e Arquivos Públicos

## Problema

Quando configuramos `output: "standalone"` no `next.config.ts`, o Next.js gera uma pasta `.next/standalone` otimizada para deploy, mas **não copia automaticamente**:

1. Os arquivos da pasta `public/` (como `version.json`, `favicon.ico`, etc.)
2. Os arquivos estáticos da pasta `.next/static/` (JavaScript, CSS, etc.)

Isso causava dois problemas críticos:
- O `version.json` não estava disponível, impedindo o `BuildInfo` de exibir informações de versão
- **Todos os arquivos JavaScript retornavam 404**, quebrando completamente a aplicação

## Solução Implementada

### 1. Script de Cópia Automática

Criamos o script `scripts/copy-public-to-standalone.cjs` que:

- Copia recursivamente todo conteúdo de `public/` para `.next/standalone/public/`
- **Copia recursivamente todo conteúdo de `.next/static/` para `.next/standalone/.next/static/`** ← **CRÍTICO!**
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
4. `postbuild` → **Copia arquivos públicos E estáticos para standalone**

## Estrutura de Deploy Standalone

Após o build, a estrutura fica:

```
.next/
└── standalone/
    ├── server.js              # Servidor Node otimizado
    ├── package.json           # Deps mínimas
    ├── node_modules/          # Apenas deps necessárias
    ├── .next/                 # Build interno do Next
    │   └── static/            # ← JavaScript, CSS, etc. (COPIADO!)
    │       ├── chunks/
    │       ├── css/
    │       └── ...
    └── public/                # ← Assets públicos (COPIADO!)
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
## Troubleshooting

### Arquivos JavaScript retornam 404

**Causa**: Pasta `.next/static` não foi copiada para standalone

**Sintomas**:
```
webpack-xxx.js     404
main-app-xxx.js    404
layout-xxx.js      404
page-xxx.js        404
```

**Solução**:

```bash
# Re-execute o postbuild manualmente
npm run postbuild

# Ou faça build completo novamente
npm run build
```

**Verificação**:
```bash
# Deve existir e conter arquivos
ls .next/standalone/.next/static/
```

### BuildInfo não aparece no rodapé

**Causa**: `version.json` não foi copiado para standalone

**Solução**:

```bash
# Re-execute o postbuild manualmente
npm run postbuild

# Ou faça build completo novamente
npm run build
```

**Verificação**:
```bash
# Deve existir
cat .next/standalone/public/version.json
```

### Erro "Pasta .next/standalone não encontrada"

**Causa**: Build standalone não foi gerado

**Solução**:

1. Verifique se `output: "standalone"` está em `next.config.ts`
2. Execute `npm run build` (sem executar apenas `next build`)
3. Confirme que pasta `.next/standalone/` existe

### Assets estáticos não carregam

**Causa**: Falta copiar `.next/static` em deploy manual

**Solução**: Além de `public/`, você também precisa copiar `.next/static`:

```bash
# Copie para o servidor
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
```

## Deploy com PM2

### Configuração do PM2

O projeto inclui um arquivo de exemplo `ecosystem.config.example.cjs` para deploy com PM2.

**Passos para configurar:**

1. Copie o arquivo de exemplo:
   ```bash
   cp ecosystem.config.example.cjs ecosystem.config.cjs
   ```

2. Edite `ecosystem.config.cjs` conforme seu ambiente:
   - Ajuste `NEXTAUTH_URL` para a URL pública da aplicação
   - Configure `CONTROLADORES_API_URL` para a API interna
   - Ajuste `NODE_EXTRA_CA_CERTS` se usar certificados customizados
   - Verifique as configurações de memória e logs

3. Certifique-se que o `.env.production` existe com todas as variáveis necessárias

4. Inicie o processo:
   ```bash
   pm2 start ecosystem.config.cjs --env production
   ```

5. Salve a configuração para reiniciar automaticamente após reboot:
   ```bash
   pm2 save
   pm2 startup
   ```

**Observações importantes:**

- O arquivo `ecosystem.config.cjs` **não está versionado** (está no `.gitignore`) por conter configurações específicas do ambiente
- Use sempre o arquivo de exemplo como base
- A versão da aplicação (do `package.json`) é exibida automaticamente no PM2
- Os logs são salvos em `logs/backlog-error.log` e `logs/backlog-out.log`

### Comandos úteis do PM2

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs backlog-dim

# Reiniciar após deploy
pm2 restart backlog-dim

# Parar aplicação
pm2 stop backlog-dim

# Remover do PM2
pm2 delete backlog-dim
```

## Referências

- [Next.js Standalone Output](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- Issue relacionada: [Next.js #51921](https://github.com/vercel/next.js/discussions/51921)

---

**Última atualização**: 13/10/2025  
**Versão do Next.js**: 15.x

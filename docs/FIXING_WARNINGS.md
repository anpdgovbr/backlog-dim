# Correção de Warnings

Este documento explica como resolver os warnings que aparecem durante o build e desenvolvimento.

## 1. Warning: NODE_TLS_REJECT_UNAUTHORIZED

### Problema

```
Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
```

### Causa

Este warning aparece porque o projeto usa certificados auto-assinados para desenvolvimento HTTPS local.

### Contexto Importante

- **`npm run dev`**: Desenvolvimento padrão em localhost com autenticação funcionando
- **`server.js`**: Arquivo local (no .gitignore) para HTTPS opcional
- **`npm run devs`**: Executa server.js se presente, senão usa configuração padrão

### Soluções

#### Opção A: Usar Scripts Configurados (Recomendado)

```bash
# Para desenvolvimento padrão (localhost, autenticação funciona)
npm run dev

# Para HTTPS opcional (se server.js configurado localmente)
npm run devs

# Para build de produção (com validação TLS)
npm run build
```

#### Opção B: Configurar Manualmente

Adicione ao seu `.env.local`:

```bash
# APENAS para desenvolvimento local
NODE_TLS_REJECT_UNAUTHORIZED=0
```

⚠️ **IMPORTANTE**: Nunca use `NODE_TLS_REJECT_UNAUTHORIZED=0` em produção!

## 2. Warning: Next.js Plugin Not Detected

### Problema

```
The Next.js plugin was not detected in your ESLint configuration
```

### Solução

Este warning foi corrigido com:

1. **Configuração dual**: Mantemos tanto `eslint.config.mjs` quanto `.eslintrc.json`
2. **Next.js config atualizado**: `next.config.ts` inclui configurações ESLint apropriadas
3. **Plugin instalado**: `eslint-config-next` está nas dependências

### Verificar se está funcionando

```bash
# Rodar linting
npm run lint

# Build com verificação de tipos
npm run build
```

## Scripts Disponíveis

| Script          | Descrição              | URL                   | Autenticação | TLS Warnings          |
| --------------- | ---------------------- | --------------------- | ------------ | --------------------- |
| `npm run dev`   | Desenvolvimento padrão | http://localhost:3000 | ✅ Funciona  | ❌ Não                |
| `npm run devs`  | HTTPS (se configurado) | Depende do server.js  | ✅ Funciona  | ✅ Suprimidos         |
| `npm run build` | Build de produção      | N/A                   | N/A          | ❌ Validação completa |

### Nota sobre Autenticação

- Localhost está cadastrado no Azure Entra ID e funciona para todos os desenvolvedores
- `server.js` é um arquivo local (ignorado pelo git) para configurações HTTPS específicas
- A maioria dos desenvolvedores pode usar apenas `npm run dev`

## Configuração do server.js (Opcional)

Se você quiser criar seu próprio `server.js` para HTTPS:

1. **Crie o arquivo** (será ignorado pelo git):

   ```javascript
   import fs from "fs"
   import { createServer } from "https"
   import { parse } from "url"

   import next from "next"

   const app = next({ dev: true, turbo: true })
   const handle = app.getRequestHandler()

   const httpsOptions = {
     key: fs.readFileSync("dev-key.pem"),
     cert: fs.readFileSync("dev-cert.pem"),
   }

   app.prepare().then(() => {
     createServer(httpsOptions, (req, res) => {
       const parsedUrl = parse(req.url, true)
       handle(req, res, parsedUrl)
     }).listen(3000, "localhost", () => {
       console.log("🚀 HTTPS: https://localhost:3000")
     })
   })
   ```

2. **Gere certificados**:

   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout dev-key.pem -out dev-cert.pem -days 365 -nodes -subj "/CN=localhost"
   ```

3. **Execute**:
   ```bash
   npm run devs
   ```

## Certificados SSL

Se você ver erros relacionados a certificados:

```bash
# Gerar novos certificados (se necessário)
openssl req -x509 -newkey rsa:4096 -keyout dev-key.pem -out dev-cert.pem -days 365 -nodes
```

## Verificação Final

Para confirmar que os warnings foram resolvidos:

1. **Build limpo**:
   ```bash
   npm run build
   ```
2. **Linting limpo**:

   ```bash
   npm run lint
   ```

3. **Desenvolvimento sem warnings TLS**:
   ```bash
   npm run devs
   ```

## Configurações de Ambiente

### Desenvolvimento

- TLS warnings suprimidos apenas para `devs` e `dev:https`
- ESLint configurado para Next.js
- TypeScript com verificação completa

### Produção

- TLS validation completa
- ESLint rigoroso
- Otimizações de build ativadas

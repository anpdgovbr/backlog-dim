# Guia de Desenvolvimento

## Ambientes de Desenvolvimento

Este projeto oferece diferentes formas de executar o ambiente de desenvolvimento dependendo do que você precisa testar.

### 🌐 Desenvolvimento Padrão (com autenticação)

```bash
npm run dev
```

- **URL**: http://localhost:3000
- **Autenticação**: ✅ Funciona (localhost registrado no Entra ID)
- **Uso**: Desenvolvimento completo incluindo login/logout
- **TLS Warnings**: Nenhum
- **Requisitos**: Apenas variáveis de ambiente configuradas

### 🔐 Desenvolvimento HTTPS (IP específico - opcional)

```bash
npm run devs
```

- **URL**: https://10.120.10.170:3000
- **Autenticação**: ✅ Funciona (IP específico registrado no Entra ID)
- **Uso**: Testes em ambiente similar à produção
- **TLS Warnings**: Suprimidos automaticamente
- **Requisito**: Certificados SSL (`dev-key.pem`, `dev-cert.pem`)
- **Nota**: `server.js` está no .gitignore (configuração específica)

## Configuração para Outros Desenvolvedores

**Boa notícia**: A configuração padrão já funciona para todos os desenvolvedores!

### ✅ Opção Recomendada: Desenvolvimento Padrão

```bash
npm run dev
```

- Localhost já está registrado no Entra ID
- Autenticação funciona out-of-the-box
- Sem necessidade de certificados SSL
- Sem warnings TLS

### 🔧 Configuração Necessária

1. **Configure variáveis de ambiente** (`.env.local`):

   ```bash
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=http://localhost:3000

   AZURE_AD_CLIENT_ID=your-client-id
   AZURE_AD_CLIENT_SECRET=your-client-secret
   AZURE_AD_TENANT_ID=your-tenant-id
   ```

2. **Execute o projeto**:

   ```bash
   npm install
   npm run dev
   ```

3. **Acesse**: http://localhost:3000

### 🚀 Opção Avançada: HTTPS (Opcional)

Se você quiser testar com HTTPS (similar ao ambiente de produção):

1. **Crie seu próprio `server.js`** (será ignorado pelo git):

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

2. **Gere certificados SSL**:

   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout dev-key.pem -out dev-cert.pem -days 365 -nodes -subj "/CN=localhost"
   ```

3. **Execute**:
   ```bash
   npm run devs
   ```

## Estrutura dos Scripts

```json
{
  "dev": "localhost:3000 (HTTP) - ✅ Recomendado para desenvolvimento",
  "devs": "IP específico (HTTPS) - 🔧 Configuração local opcional",
  "build": "Build de produção"
}
```

## Arquivos Locais (Ignorados pelo Git)

- `server.js` - Configuração HTTPS específica do desenvolvedor
- `dev-key.pem` / `dev-cert.pem` - Certificados SSL locais
- `.env.local` - Variáveis de ambiente locais

## Resolução de Problemas

### ❌ Erro: Cannot find module 'dev-key.pem'

```bash
# Gere os certificados SSL
openssl req -x509 -newkey rsa:4096 -keyout dev-key.pem -out dev-cert.pem -days 365 -nodes
```

### ❌ Autenticação não funciona

- Verifique se as variáveis de ambiente estão configuradas (`.env.local`)
- Confirme que `NEXTAUTH_URL=http://localhost:3000` para `npm run dev`
- Verifique se as credenciais do Azure AD estão corretas

### ⚠️ TLS Warnings (apenas para HTTPS)

```bash
# Use npm run dev (sem warnings)
npm run dev  # ✅ Sem warnings (HTTP)

# Ou para HTTPS com warnings suprimidos
npm run devs  # ✅ Warnings suprimidos (se server.js configurado)
```

### 🔍 Debug

```bash
# Para ver logs detalhados
NODE_ENV=development npm run dev
```

## Configuração de IDE

### VS Code

```json
// .vscode/launch.json
{
  "name": "Debug Next.js",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/.bin/next",
  "args": ["dev"],
  "env": {
    "NODE_TLS_REJECT_UNAUTHORIZED": "0"
  }
}
```

## Variáveis de Ambiente

Crie `.env.local` com:

```bash
# Configuração para desenvolvimento padrão (localhost)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Azure Entra ID (mesmo para todos os desenvolvedores)
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id

# APIs e outras configurações
NEXT_PUBLIC_CONTROLADORES_API_URL=http://localhost:3001
CONTROLADORES_API_URL=http://localhost:3001
```

### Para HTTPS (Opcional)

Se você configurar `server.js` para HTTPS, ajuste:

```bash
NEXTAUTH_URL=https://localhost:3000
# ou
NEXTAUTH_URL=https://SEU_IP:3000
```

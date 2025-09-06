# Autenticação com Keycloak (ANPD)

Este documento descreve a configuração do Keycloak para uso no Backlog DIM e os pontos de integração no código (NextAuth).

## Visão Geral

- Provider: NextAuth `keycloak`
- Sessão: JWT (stateless)
- Claims utilizadas: `sub` (como `user.id`), `email`
- Escopos: `openid profile email offline_access`
- RBAC: mantido em banco via `@anpdgovbr/rbac-*` (não consome roles do token Keycloak nesta fase)

## Variáveis de Ambiente

- `KEYCLOAK_ISSUER`: URL do emissor OIDC do realm (inclui `/realms/<realm>`)
  - Ex.: `http://localhost:8080/realms/ANPD`
- `KEYCLOAK_CLIENT_ID`: ID do cliente (ex.: `backlog-dim`)
- `KEYCLOAK_CLIENT_SECRET`: segredo do cliente
- `NEXTAUTH_URL`: URL pública do app (ex.: `http://localhost:3000`)
- `NEXTAUTH_SECRET`: segredo do NextAuth (gerar com `openssl rand -base64 32`)
- `NEXT_PUBLIC_AUTH_PROVIDER`: id do provider de login no NextAuth (padrão: `keycloak`)
- (Dev) `NODE_TLS_REJECT_UNAUTHORIZED=0` se usar KC com certificado self-signed

## Configuração do Client no Keycloak

1. Realm: usar o realm ANPD (pode importar `doc/realm-anpd.json` como base)
2. Client:
   - Protocolo: OpenID Connect
   - Access Type: `confidential`
   - Standard Flow: habilitado
   - Redirect URIs: `http://localhost:3000/api/auth/callback/keycloak`
   - Web Origins: `http://localhost:3000`
   - Credentials: gere um Client Secret e copie para `.env`
3. Escopos e Claims:
   - Garanta que o usuário possua `email` e que o `userinfo`/`id_token` tragam `email` e `sub`
   - Para refresh de longo prazo, mantenha o escopo `offline_access` habilitado (opcional em prod)

## Integração no Código

- Arquivo: `src/config/next-auth.config.ts`
  - Provedor migrado para `KeycloakProvider`
  - Scopes definidos: `openid email profile offline_access`
  - Callbacks:
    - `jwt`: persiste `access_token` e `refresh_token` em `token`
    - `session`: expõe `user.id` e `user.accessToken`
- Tela de login: `src/app/auth/login/page.tsx`
  - Usa `signIn(process.env.NEXT_PUBLIC_AUTH_PROVIDER || "keycloak")`
- Middleware: `src/middleware.ts`
  - Continua usando `getToken` do NextAuth; nenhuma alteração específica do provider

### Renovação de Token (Refresh)

- Implementamos renovação automática do `access_token` via `refresh_token` no callback `jwt`.
- Endpoint: `${KEYCLOAK_ISSUER}/protocol/openid-connect/token` com `grant_type=refresh_token`.
- Requisitos: `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`, `KEYCLOAK_ISSUER` válidos.
- Expiração: quando faltarem < 60s, o app tenta renovar. Se falhar, marca `token.error = 'RefreshAccessTokenError'` e o próximo ciclo exigirá novo login.
- Escopo `offline_access`: opcional (aumenta longevidade do refresh em alguns cenários), avaliar política de segurança.

## RBAC e Perfis

- O RBAC é resolvido via banco (bibliotecas `@anpdgovbr/rbac-*`) usando a identidade do usuário (`email` e `id`)
- Os roles do Keycloak (realm/client) não são consumidos diretamente pelo app nesta fase
- Caso seja necessário mapear roles do Keycloak no futuro:
  - Adicionar mappers no client/realm para incluir `realm_access.roles` no `id_token`
  - Estender o `jwt` callback para extrair e anexar `roles` no `token`
  - Atualizar o `getIdentity`/provider RBAC para compatibilizar a fonte

## Logout (SLO) — Keycloak

- Fluxo implementado na página `/auth/logout`:
  1. Chama `GET /api/auth/slo` para obter a URL do endpoint de logout do Keycloak.
  2. Executa `signOut({ redirect: false })` para limpar a sessão local (NextAuth).
  3. Redireciona o navegador para o Keycloak, que encerra a sessão SSO e retorna ao app.

- `GET /api/auth/slo` monta a URL com base em:
  - `KEYCLOAK_ISSUER` (ex.: `https://kc.dev/realms/ANPD`)
  - `KEYCLOAK_CLIENT_ID`
  - `NEXTAUTH_URL` (usa `/` como `post_logout_redirect_uri`)
  - Inclui `id_token_hint` quando disponível (persistido no JWT via callback do NextAuth)

- Observação: Para ambientes em que o Keycloak exige `id_token_hint`, o app já o inclui automaticamente quando presente.

## Checklist de Diagnóstico

- 401 no callback: verifique `KEYCLOAK_ISSUER`, `CLIENT_ID`, `CLIENT_SECRET`
- E-mail ausente na sessão: verifique se o usuário tem e-mail e o escopo `email` está habilitado
- Erro TLS com KC dev: use certificado válido ou `NODE_TLS_REJECT_UNAUTHORIZED=0` somente em dev

## Hardening (Dev/Homolog)

- Cookies seguros: o app usa `useSecureCookies=true` automaticamente quando `NEXTAUTH_URL` for HTTPS (ex.: `https://dim.dev.anpd.gov.br`).
- Keycloak Client (Homolog/Dev): exemplo em `doc/KEYCLOAK_CLIENT_BACKLOG_DIM_DEV.json` com `redirectUris`, `webOrigins` e `post.logout.redirect.uris`.
- Variáveis de ambiente por ambiente:
  - Dev local: `NEXTAUTH_URL=http://localhost:3000`
  - Homolog: `NEXTAUTH_URL=https://dim.dev.anpd.gov.br`

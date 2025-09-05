import KeycloakProvider from "next-auth/providers/keycloak"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"
import type { AcaoAuditoria } from "@anpdgovbr/shared-types"

/**
 * Atualiza o access_token do Keycloak usando o refresh_token.
 *
 * Estratégia:
 * - Quando o `jwt` callback detectar um token prestes a expirar, chama este helper.
 * - Envia `grant_type=refresh_token` para o endpoint `/protocol/openid-connect/token`.
 * - Atualiza `accessToken`, `refreshToken`, `idToken` e `expiresAt` no JWT.
 *
 * Observações:
 * - Requer `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET` definidos.
 * - Se a renovação falhar, anexa `token.error = 'RefreshAccessTokenError'` para tratamento posterior.
 */
async function refreshKeycloakAccessToken(
  token: JWT & {
    refreshToken?: string
    accessToken?: string
    idToken?: string
    expiresAt?: number
  }
) {
  const issuer = process.env.KEYCLOAK_ISSUER
  const clientId = process.env.KEYCLOAK_CLIENT_ID
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET

  if (!issuer || !clientId || !clientSecret || !token.refreshToken) {
    return { ...token, error: "RefreshAccessTokenError" as const }
  }

  try {
    const url = `${issuer.replace(/\/$/, "")}/protocol/openid-connect/token`
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: token.refreshToken,
    })

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })

    if (!res.ok) {
      return { ...token, error: "RefreshAccessTokenError" as const }
    }

    const refreshed = (await res.json()) as {
      access_token?: string
      refresh_token?: string
      id_token?: string
      expires_in?: number
      expires_at?: number
    }

    const now = Date.now()
    const expiresAtSeconds =
      refreshed.expires_at ??
      (refreshed.expires_in ? Math.floor(now / 1000) + refreshed.expires_in : undefined)
    const expiresAt = expiresAtSeconds ? expiresAtSeconds * 1000 : now + 55 * 60 * 1000 // fallback 55min

    return {
      ...token,
      accessToken: refreshed.access_token ?? token.accessToken,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      idToken: refreshed.id_token ?? token.idToken,
      expiresAt,
    }
  } catch {
    return { ...token, error: "RefreshAccessTokenError" as const }
  }
}

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          scope: "openid email profile offline_access",
        },
      },
    }),
  ],
  // Desativa logs de debug do NextAuth
  debug: false as const,
  // Confia no host do proxy/dev ao inferir URLs (útil em portas customizadas)
  trustHost: true as const,
  // Cookies seguros automaticamente quando NEXTAUTH_URL usa HTTPS (homolog/prod)
  useSecureCookies: !!process.env.NEXTAUTH_URL?.startsWith("https://"),
  session: {
    strategy: "jwt" as const,
    maxAge: 4 * 60 * 60,
  },
  // Remove logger customizado para evitar ruído em logs
  callbacks: {
    async jwt(params: Record<string, unknown>) {
      const token = params.token as JWT & {
        accessToken?: string
        refreshToken?: string
        idToken?: string
        expiresAt?: number
        error?: string
      }
      const account = params.account as
        | {
            access_token?: string
            refresh_token?: string
            id_token?: string
            expires_in?: number
            expires_at?: number
          }
        | null
        | undefined
      const user = params.user as { id?: string } | null | undefined

      // 1) Primeira vez no callback (login): anexa tokens e expiração
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.idToken = account.id_token

        const now = Date.now()
        const expiresAtSeconds =
          account.expires_at ??
          (account.expires_in ? Math.floor(now / 1000) + account.expires_in : undefined)
        token.expiresAt = expiresAtSeconds
          ? expiresAtSeconds * 1000
          : now + 55 * 60 * 1000
      }
      if (user?.id) token.id = user.id

      // 2) Se o token ainda é válido por >60s, retorna
      const hasValidExpiry =
        typeof token.expiresAt === "number" && Date.now() < token.expiresAt - 60_000
      if (hasValidExpiry) return token

      // 3) Caso contrário, tenta renovar com refresh_token
      return await refreshKeycloakAccessToken(token)
    },

    async session(params: Record<string, unknown>) {
      const session = params.session as Session
      const token = params.token as JWT
      const updated: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          accessToken: token.accessToken,
        },
      }
      return updated
    },
  },
  /**
   * Eventos do NextAuth para auditoria básica de autenticação.
   *
   * signIn: registra tentativa bem-sucedida de login
   * signOut: registra logout
   */
  events: {
    async signIn(message: {
      user: { id?: string; email?: string | null }
      account: unknown
      isNewUser?: boolean
      profile?: unknown
    }) {
      try {
        const { registrarAuditoria } = await import("@/helpers/auditoria-server")
        await registrarAuditoria({
          tabela: "auth",
          acao: "GET" as unknown as AcaoAuditoria,
          userId: message.user?.id,
          email: typeof message.user?.email === "string" ? message.user.email : undefined,
          contexto: `signIn:${(message as any)?.account?.provider ?? "unknown"}`,
          depois: { isNewUser: message.isNewUser ?? false },
        })
      } catch (e) {
        console.error("signIn audit error", e)
      }
    },
    async signOut(message: {
      token: JWT
      session: { user?: { id?: string; email?: string | null } }
    }) {
      try {
        const { registrarAuditoria } = await import("@/helpers/auditoria-server")
        const emailFromSession = message.session.user?.email
        const email =
          typeof emailFromSession === "string"
            ? emailFromSession
            : typeof (message.token as any)?.email === "string"
              ? (message.token as any).email
              : undefined
        const userId = message.session.user?.id ?? (message.token as any)?.sub
        await registrarAuditoria({
          tabela: "auth",
          acao: "DELETE" as unknown as AcaoAuditoria,
          userId: userId,
          email: email,
          contexto: `signOut`,
        })
      } catch (e) {
        console.error("signOut audit error", e)
      }
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions

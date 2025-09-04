import AzureADProvider from "next-auth/providers/azure-ad"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
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
  session: {
    strategy: "jwt" as const,
    maxAge: 4 * 60 * 60,
  },
  // Remove logger customizado para evitar ruído em logs
  callbacks: {
    async jwt(params: Record<string, unknown>) {
      const token = params.token as JWT
      const account = params.account as
        | { access_token?: string; refresh_token?: string }
        | null
        | undefined
      const user = params.user as { id?: string } | null | undefined
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      if (user?.id) {
        token.id = user.id
      }
      return token
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
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions

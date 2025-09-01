import AzureADProvider from "next-auth/providers/azure-ad"

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
  debug: true as const,
  // Confia no host do proxy/dev ao inferir URLs (útil em portas customizadas)
  trustHost: true as const,
  session: {
    strategy: "jwt" as const,
    maxAge: 4 * 60 * 60,
  },
  // Loga eventos no console para facilitar diagnóstico em dev
  logger: {
    error(code: string, metadata: unknown) {
      console.error("[next-auth:error]", code, metadata)
    },
    warn(code: string) {
      console.warn("[next-auth:warn]", code)
    },
    debug(code: string, metadata: unknown) {
      console.debug("[next-auth:debug]", code, metadata)
    },
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, account }: any) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      if (user) {
        token.id = user.id
      }
      return token
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          accessToken: token.accessToken,
        },
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

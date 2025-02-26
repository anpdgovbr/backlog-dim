import NextAuth, { AuthOptions } from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'

const AZURE_AD_CLIENT_ID =
  process.env.AZURE_AD_CLIENT_ID ??
  (() => {
    throw new Error('AZURE_AD_CLIENT_ID não definido')
  })()
const AZURE_AD_CLIENT_SECRET =
  process.env.AZURE_AD_CLIENT_SECRET ??
  (() => {
    throw new Error('AZURE_AD_CLIENT_SECRET não definido')
  })()
const AZURE_AD_TENANT_ID =
  process.env.AZURE_AD_TENANT_ID ??
  (() => {
    throw new Error('AZURE_AD_TENANT_ID não definido')
  })()

export const authOptions: AuthOptions = {
  providers: [
    AzureADProvider({
      clientId: AZURE_AD_CLIENT_ID,
      clientSecret: AZURE_AD_CLIENT_SECRET,
      tenantId: AZURE_AD_TENANT_ID
    })
  ],
  session: {
    strategy: 'jwt'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

/**
 * @file Rota de autenticação via NextAuth.
 *
 * Esta rota implementa o handler de autenticação utilizando NextAuth, delegando
 * os métodos GET e POST para o adaptador NextAuth com as opções configuradas em
 * `src/config/next-auth.config.ts`.
 *
 * @remarks
 * - Utiliza o App Router do Next.js.
 * - Suporta múltiplos provedores de autenticação conforme configuração.
 * - O handler exporta GET e POST para integração automática com NextAuth.
 *
 * @see {@link https://next-auth.js.org/getting-started/introduction}
 */
import NextAuth from "next-auth/next"

import { authOptions } from "@/config/next-auth.config"

// NextAuth handler — delega GET/POST para o adaptador do NextAuth.
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

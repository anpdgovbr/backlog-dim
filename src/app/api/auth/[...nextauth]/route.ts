/**
 * Rota de autenticação via NextAuth.
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

/**
 * Handler principal retornado por NextAuth configurado com `authOptions`.
 *
 * Este símbolo representa a função roteadora criada pelo NextAuth que lida com
 * requisições de autenticação do App Router (GET e POST). Ela encapsula a
 * lógica dos provedores, callbacks e sessão conforme definido em
 * `src/config/next-auth.config.ts`.
 *
 * Observações:
 * - Não invoca manualmente esta função; o Next.js a utiliza como handler de rota.
 * - A assinatura é compatível com os handlers do App Router (tratamento interno
 *   pelo NextAuth).
 *
 * @constant handler
 * @see {@link /src/config/next-auth.config.ts}
 */
// NextAuth handler — delega GET/POST para o adaptador do NextAuth.
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

/// <reference types="next-auth" />
// next-auth.d.ts
import "next-auth"
import "next-auth/jwt"
import type { DefaultSession } from "next-auth/next"

declare module "next-auth" {
  interface Session {
    expires: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string // Adicionando um campo personalizado
    } & DefaultSession["user"]
    accessToken?: string // Adicionando um token de acesso
  }

  interface User {
    id: string
    name: string
    email: string
    image?: string
    role?: string // Adicionando um campo personalizado
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name?: string
    email?: string
    picture?: string
    role?: string // Adicionando um campo personalizado
    accessToken?: string // Adicionando um token de acesso
    idToken?: string // id_token do OIDC (para SLO)
    refreshToken?: string // refresh_token para renovar o access_token
    expiresAt?: number // timestamp (ms) de expiração do access_token
  }
}

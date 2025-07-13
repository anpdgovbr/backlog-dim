// next-auth.d.ts
import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
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
  }
}

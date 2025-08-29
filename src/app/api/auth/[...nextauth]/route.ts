// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next"

import { authOptions } from "@/config/next-auth.config"

// NextAuth handler — delega GET/POST para o adaptador do NextAuth.
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

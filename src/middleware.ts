import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Bypass total para rotas NextAuth (signin/callback/jwt/etc.)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // 1. Redirecionar usuários autenticados que tentam acessar login
  if (token && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 2. Definir rotas públicas
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/logout",
    "/api/auth",
    "/favicon.ico",
    "/sobre",
  ]

  // 3. Permitir acesso imediato a rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // 4. Verificar se a rota requer autenticação
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/api/processos")

  // 5. Redirecionar não autenticados em rotas protegidas
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // 6. Proteger APIs específicas
  if (pathname.startsWith("/api/processos") && !token) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  return NextResponse.next()
}

export const config = {
  // Não aplicar middleware para _next assets e para os caminhos de favicon comuns
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon-16x16.png|favicon-32x32.png).*)",
  ],
}

/**
 * Middleware de roteamento e autenticação para a aplicação Next.js.
 *
 * Objetivo:
 * - Proteger rotas que exigem autenticação.
 * - Redirecionar usuários autenticados fora da tela de login.
 * - Permitir acesso às rotas públicas e aos endpoints do NextAuth sem interferência.
 *
 * Comportamento principal:
 * - Bypass total para rotas que começam com "/api/auth".
 * - Se o usuário já estiver autenticado (token presente) e acessar "/auth/login",
 *   redireciona para "/dashboard".
 * - Permite acesso imediato a um conjunto de rotas públicas.
 * - Considera protegidas rotas que começam com "/dashboard" ou "/api/processos".
 * - Redireciona usuários não autenticados em rotas protegidas para "/auth/login".
 * - Responde com 401 para requisições diretas a "/api/processos" sem token.
 *
 * Observações:
 * - Usa `next-auth/jwt` para obter o token da sessão (server side).
 * - Projetado para ser aplicado com o `matcher` exportado abaixo.
 */
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Função middleware executada em cada requisição que corresponde ao matcher.
 *
 * @param request - NextRequest fornecida pelo Next.js contendo URL, headers e contexto.
 * @returns NextResponse | Response - Pode retornar NextResponse.next(), redirects ou respostas de erro (ex.: 401).
 *
 * Detalhes:
 * - Busca token via getToken({ req }) para determinar se o usuário está autenticado.
 * - Redireciona usuários autenticados que acessam a rota de login para o dashboard.
 * - Permite passagem para rotas públicas definidas em `publicRoutes`.
 * - Para rotas protegidas, redireciona para "/auth/login" se não houver token.
 * - Para API de processos, retorna explicitamente 401 quando não autenticado.
 */
export async function proxy(request: NextRequest) {
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

/**
 * Configuração do matcher do middleware.
 *
 * Explica quais caminhos são excluídos do middleware (assets _next e favicons comuns).
 * O padrão atual evita aplicar o middleware a:
 * - _next/static
 * - _next/image
 * - favicon.ico e variações de favicon comuns (16x16, 32x32)
 */
export const config = {
  // Não aplicar middleware para _next assets e para os caminhos de favicon comuns
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon-16x16.png|favicon-32x32.png).*)",
  ],
}

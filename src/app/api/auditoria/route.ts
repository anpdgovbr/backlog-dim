/**
 * @file Rota de API para registro e consulta de logs de auditoria.
 *
 * Esta rota implementa endpoints para:
 * - Registrar eventos de auditoria no banco de dados (POST)
 * - Consultar logs de auditoria com filtros e paginação (GET)
 *
 * Utiliza Prisma para persistência e segue convenções do projeto Backlog DIM.
 */

import type { Prisma } from "@prisma/client"

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApiSlim } from "@/lib/withApiSlim"

/**
 * Função handler para o método POST.
 *
 * @remarks
 * Utilizada para registrar uma entrada de auditoria no banco de dados.
 *
 * @param req - Instância de NextRequest contendo os dados da auditoria no corpo da requisição.
 * @returns NextResponse informando sucesso ou erro.
 *
 * @example
 * POST /api/auditoria
 * {
 *   "tabela": "usuarios",
 *   "acao": "CREATE",
 *   "registroId": "123",
 *   "userId": "456",
 *   "email": "usuario@exemplo.com",
 *   "contexto": { ... },
 *   "antes": { ... },
 *   "depois": { ... }
 * }
 */
export async function POST(req: NextRequest) {
  /**
   * Registra uma entrada de auditoria no banco.
   *
   * Corpo esperado: { tabela, acao, registroId?, userId?, email?, contexto?, antes?, depois? }
   * Onde `acao` deve ser um membro de `AcaoAuditoria`.
   */
  try {
    const { tabela, acao, registroId, userId, email, contexto, antes, depois } =
      await req.json()

    if (!tabela || !acao) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes: tabela e acao" },
        { status: 400 }
      )
    }

    if (!Object.values(AcaoAuditoria).includes(acao)) {
      return NextResponse.json({ error: `Ação '${acao}' inválida` }, { status: 400 })
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null

    const userAgent = req.headers.get("user-agent") || null

    await prisma.auditLog.create({
      data: {
        tabela,
        acao,
        registroId,
        userId,
        email,
        contexto,
        antes,
        depois,
        ip,
        userAgent,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao registrar auditoria:", error)
    return NextResponse.json(
      { error: "Erro interno ao registrar auditoria" },
      { status: 500 }
    )
  }
}

/**
 * Endpoint para listar logs de auditoria com paginação e filtros.
 *
 * @param req - Objeto NextRequest contendo os parâmetros de consulta na URL.
 * @param context - Contexto da rota, incluindo parâmetros de rota.
 * @returns NextResponse com os dados paginados dos logs de auditoria.
 *
 * Parâmetros de consulta suportados:
 * - page: número da página (default: 1)
 * - pageSize: quantidade por página (default: 10)
 * - orderBy: campo de ordenação (default: criadoEm)
 * - ascending: ordenação ascendente (default: false)
 * - acao: filtra por ação de auditoria
 * - tabela: filtra por nome da tabela
 * - email: filtra por email do usuário
 * - dataInicial, dataFinal: filtra por intervalo de datas
 * - search: busca textual em tabela, email ou ação
 */
const handleGET = withApiSlim(async ({ req }) => {
  const { searchParams } = new URL(req.url)

  // 🧾 Paginação e ordenação
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")
  const orderBy = searchParams.get("orderBy") || "criadoEm"
  const ascending = searchParams.get("ascending") === "true"

  // 🔍 Filtros
  const acaoParam = searchParams.get("acao")
  const acao =
    acaoParam && Object.values(AcaoAuditoria).includes(acaoParam as AcaoAuditoria)
      ? (acaoParam as AcaoAuditoria)
      : undefined

  const tabela = searchParams.get("tabela") || undefined
  const email = searchParams.get("email") || undefined
  const dataInicial = searchParams.get("dataInicial")
  const dataFinal = searchParams.get("dataFinal")
  const search = searchParams.get("search")?.toLowerCase() || ""

  const where: Prisma.AuditLogWhereInput = {
    ...(acao && { acao }),
    ...(tabela && { tabela: { contains: tabela, mode: "insensitive" } }),
    ...(email && { email: { contains: email, mode: "insensitive" } }),
    ...(dataInicial || dataFinal
      ? {
          criadoEm: {
            ...(dataInicial && { gte: new Date(dataInicial) }),
            ...(dataFinal && { lte: new Date(dataFinal) }),
          },
        }
      : {}),
    ...(search && {
      OR: [
        { tabela: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { acao: { equals: search as AcaoAuditoria } },
      ],
    }),
  }

  const [total, dados] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { [orderBy]: ascending ? "asc" : "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return NextResponse.json({ total, dados })
})

/**
 * Função handler para o método GET.
 *
 * @remarks
 * Utilizada para listar logs de auditoria com suporte a filtros, busca textual e paginação.
 *
 * @param req - Instância de NextRequest contendo os parâmetros de consulta na URL.
 * @param context - Contexto da rota, incluindo parâmetros de rota.
 * @returns NextResponse com os dados paginados dos logs de auditoria.
 *
 * @example
 * GET /api/auditoria?page=1&pageSize=20&acao=CREATE&tabela=usuarios
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleGET(req, { params: await context.params })
}

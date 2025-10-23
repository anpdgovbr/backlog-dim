// app/api/auditoria/route.ts
import type { Prisma } from "@prisma/client"

import { NextResponse } from "next/server"

import { AcaoAuditoria, isAcaoAuditoria } from "@anpdgovbr/shared-types"
import type { AcaoAuditoria as PrismaAcaoAuditoria } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"

/**
 * Registra uma entrada de auditoria no banco.
 *
 * @see {@link withApi}
 * @returns JSON `{ success: true }` em caso de sucesso.
 * @example
 * POST /api/auditoria
 * { "tabela": "processo", "acao": "CREATE", "registroId": 1 }
 * @remarks Protegido por RBAC: {acao: "Registrar", recurso: "Auditoria"}.
 */
export const POST = withApi(
  async ({ req }) => {
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

      const ip =
        req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null
      const userAgent = req.headers.get("user-agent") || null

      const registroIdNormalizado =
        typeof registroId === "string"
          ? registroId || undefined
          : typeof registroId === "number"
            ? String(registroId)
            : undefined

      await prisma.auditLog.create({
        data: {
          tabela,
          acao,
          registroId: registroIdNormalizado,
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
  },
  { permissao: { acao: "Registrar", recurso: "Auditoria" } }
)

/**
 * Lista logs de auditoria com paginação e filtros.
 *
 * @see {@link withApi}
 * @returns JSON com `{ total, dados }`.
 * @example GET /api/auditoria?page=1&pageSize=20&acao=CREATE
 * @remarks Protegido por RBAC: {acao: "Exibir", recurso: "Auditoria"}.
 */
export const GET = withApi(
  async ({ req }) => {
    const { searchParams } = new URL(req.url)

    // 🧾 Paginação e ordenação (normalização + whitelist)
    const rawPage = Number(searchParams.get("page"))
    const rawPageSize = Number(searchParams.get("pageSize"))
    const rawOrderBy = searchParams.get("orderBy") || "criadoEm"
    const ascending = searchParams.get("ascending") === "true"

    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1
    const PAGE_SIZE_DEFAULT = 10
    const PAGE_SIZE_MAX = 100
    const pageSize = Number.isFinite(rawPageSize)
      ? Math.min(Math.max(rawPageSize, 1), PAGE_SIZE_MAX)
      : PAGE_SIZE_DEFAULT

    const ORDERABLE_FIELDS = new Set(["criadoEm", "tabela", "email"]) // campos mais úteis
    const orderField = ORDERABLE_FIELDS.has(rawOrderBy) ? rawOrderBy : "criadoEm"

    // 🔍 Filtros
    const acaoParam = searchParams.get("acao")
    const acaoUpper = acaoParam?.toUpperCase() ?? ""
    const acao = isAcaoAuditoria(acaoUpper)
      ? (acaoUpper as unknown as PrismaAcaoAuditoria)
      : undefined

    const tabela = searchParams.get("tabela") || undefined
    const email = searchParams.get("email") || undefined
    const dataInicial = searchParams.get("dataInicial")
    const dataFinal = searchParams.get("dataFinal")
    const searchRaw = searchParams.get("search") || ""
    const search = searchRaw.toLowerCase()
    const acaoFromSearch = isAcaoAuditoria(searchRaw.toUpperCase())
      ? (searchRaw.toUpperCase() as unknown as PrismaAcaoAuditoria)
      : undefined

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
          ...(acaoFromSearch ? [{ acao: { equals: acaoFromSearch } }] : []),
        ],
      }),
    }

    const [total, rows] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { [orderField]: ascending ? "asc" : "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    // Normaliza datas para ISO string para consumo no client
    const dados = rows.map((r) => ({
      ...r,
      criadoEm: r.criadoEm.toISOString(),
    }))

    return NextResponse.json({ total, dados })
  },
  { permissao: { acao: "Exibir", recurso: "Auditoria" } }
)

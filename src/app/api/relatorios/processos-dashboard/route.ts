import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"

import authOptions from "@/config/next-auth.config"
import { prisma } from "@/lib/prisma"

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD") // separa acento das letras
    .replace(/[\u0300-\u036f]/g, "") // remove os acentos
    .toLowerCase()
}

/**
 * Relatório do dashboard de processos.
 * Retorna estatísticas agregadas para exibição no dashboard do usuário autenticado:
 * { total, noMes, atrasados, atribuidosAoUsuario, porStatusInterno, porTipoRequerimento, topTemas }
 * @example
 * GET /api/relatorios/processos-dashboard
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    // Agora verificamos por email
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  const hoje = new Date()
  const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

  // 1. Primeiro encontre o usuário no banco pelo email
  const usuario = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      responsavel: { select: { id: true } },
    },
  })

  if (!usuario) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  // 2. Agora conte os processos atribuídos
  const atribuidosAoUsuario = usuario.responsavel
    ? await prisma.processo.count({
        where: {
          active: true,
          responsavelId: usuario.responsavel.id,
        },
      })
    : 0

  // 3. Busca todos os processos ativos para outras estatísticas
  const processos = await prisma.processo.findMany({
    where: { active: true },
    select: {
      dataCriacao: true,
      dataVencimento: true,
      responsavel: { select: { userId: true } },
      statusInterno: true,
      tipoRequerimento: true,
      temaRequerimento: true,
    },
  })

  // Cálculos das estatísticas
  const total = processos.length
  const noMes = processos.filter(
    (p: (typeof processos)[number]) => p.dataCriacao >= inicioDoMes
  ).length
  const atrasados = processos.filter(
    (p: (typeof processos)[number]) => p.dataVencimento && p.dataVencimento < hoje
  ).length

  const porStatusInterno: Record<string, number> = {}
  const porTipoRequerimento: Record<string, number> = {}
  const temas: Record<string, number> = {}

  for (const p of processos) {
    if (p.statusInterno) {
      porStatusInterno[p.statusInterno] = (porStatusInterno[p.statusInterno] || 0) + 1
    }
    if (p.tipoRequerimento) {
      const tipo = normalizarTexto(p.tipoRequerimento)
      porTipoRequerimento[tipo] = (porTipoRequerimento[tipo] || 0) + 1
    }
    for (const tema of p.temaRequerimento ?? []) {
      const temaNormalizado = normalizarTexto(tema)
      temas[temaNormalizado] = (temas[temaNormalizado] || 0) + 1
    }
  }

  const topTemas = Object.entries(temas)
    .map(([tema, total]) => ({ tema, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return NextResponse.json({
    total,
    noMes,
    atrasados,
    atribuidosAoUsuario,
    porStatusInterno,
    porTipoRequerimento,
    topTemas,
  })
}

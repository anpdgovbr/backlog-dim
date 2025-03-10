import authOptions from "@/config/next-auth.config"
import { prisma } from "@/lib/prisma"
import { Permissao } from "@/types/Permissao"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// 🔹 Definição da hierarquia de perfis (APENAS ADICIONA permissões)
const HIERARQUIA_PERFIS: Record<string, string[]> = {
  SuperAdmin: ["Administrador", "Supervisor", "Atendente", "Leitor"],
  Administrador: ["Supervisor", "Atendente", "Leitor"],
  Supervisor: ["Atendente", "Leitor"],
  Atendente: ["Leitor"],
  Leitor: [],
}

// ✅ MÉTODO GET → Buscar Permissões por Perfil
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const perfilId = searchParams.get("perfilId")

  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  // Se estiver buscando as permissões de um perfil específico
  if (perfilId) {
    const perfil = await prisma.perfil.findUnique({
      where: { id: Number(perfilId) },
      select: { nome: true },
    })

    if (!perfil) {
      return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 })
    }

    return NextResponse.json(await getPermissoesPorPerfil(perfil.nome))
  }

  // Se não, buscar as permissões do usuário autenticado
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { perfil: true },
  })

  if (!user || !user.perfil) {
    return NextResponse.json({ error: "Perfil não definido" }, { status: 403 })
  }

  return NextResponse.json(await getPermissoesPorPerfil(user.perfil.nome))
}

// ✅ MÉTODO POST → Criar Nova Permissão
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  // 🔹 Buscar usuário autenticado e validar perfil
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { perfil: true },
  })

  if (!user || !user.perfil || user.perfil.nome !== "SuperAdmin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  // 🔹 Capturar dados da requisição
  const { perfilId, acao, recurso, permitido } = await req.json()

  if (!perfilId || !acao || !recurso) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  try {
    // 🔹 Criar permissão, prevenindo duplicatas
    const permissaoCriada = await prisma.permissao.upsert({
      where: {
        perfilId_acao_recurso: { perfilId: Number(perfilId), acao, recurso },
      },
      update: { permitido },
      create: { perfilId: Number(perfilId), acao, recurso, permitido },
    })

    return NextResponse.json(permissaoCriada, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao criar permissão" }, { status: 500 })
  }
}

// 🔹 Função para obter permissões SEM remover superiores
async function getPermissoesPorPerfil(perfilNome: string) {
  // Perfis herdados pelo usuário (apenas adiciona permissões)
  const perfisHerdados = [perfilNome, ...(HIERARQUIA_PERFIS[perfilNome] || [])]

  // Buscar todas as permissões desses perfis
  const permissoes = await prisma.permissao.findMany({
    where: { perfil: { nome: { in: perfisHerdados } } },
  })

  // 🔹 Consolidar permissões corretamente
  const permissoesMap = new Map<
    string,
    { acao: string; recurso: string; permitido: boolean }
  >()

  permissoes.forEach((p: Permissao) => {
    const key = `${p.acao}_${p.recurso}`

    // 🔹 MANTER permissões superiores e ignorar mudanças de perfis inferiores
    if (!permissoesMap.has(key) || p.permitido) {
      permissoesMap.set(key, { acao: p.acao, recurso: p.recurso, permitido: p.permitido })
    }
  })

  return Array.from(permissoesMap.values())
}

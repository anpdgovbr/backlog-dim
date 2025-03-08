import authOptions from "@/config/next-auth.config"
import { Permissao } from "@/types/Permissao"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

// 🔹 Definição da hierarquia de perfis (APENAS ADICIONA permissões)
const HIERARQUIA_PERFIS: Record<string, string[]> = {
  SuperAdmin: ["Administrador", "Supervisor", "Atendente", "Leitor"],
  Administrador: ["Supervisor", "Atendente", "Leitor"],
  Supervisor: ["Atendente", "Leitor"],
  Atendente: ["Leitor"],
  Leitor: []
}

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
      select: { nome: true }
    })

    if (!perfil) {
      return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 })
    }

    return NextResponse.json(await getPermissoesPorPerfil(perfil.nome))
  }

  // Se não, buscar as permissões do usuário autenticado
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { perfil: true }
  })

  if (!user || !user.perfil) {
    return NextResponse.json({ error: "Perfil não definido" }, { status: 403 })
  }

  return NextResponse.json(await getPermissoesPorPerfil(user.perfil.nome))
}

// 🔹 Função para obter permissões SEM remover superiores
async function getPermissoesPorPerfil(perfilNome: string) {
  // Perfis herdados pelo usuário (apenas adiciona permissões)
  const perfisHerdados = [perfilNome, ...(HIERARQUIA_PERFIS[perfilNome] || [])]

  // Buscar todas as permissões desses perfis
  const permissoes = await prisma.permissao.findMany({
    where: { perfil: { nome: { in: perfisHerdados } } }
  })

  // 🔹 Consolidar permissões corretamente
  const permissoesMap = new Map<string, Permissao>()

  permissoes.forEach((p: Permissao) => {
    const key = `${p.acao}_${p.recurso}`

    // 🔹 MANTER permissões superiores e ignorar mudanças de perfis inferiores
    if (!permissoesMap.has(key) || p.permitido) {
      permissoesMap.set(key, p)
    }
  })

  return Array.from(permissoesMap.values())
}

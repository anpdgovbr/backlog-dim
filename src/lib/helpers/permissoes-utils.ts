// lib/helpers/permissoes-utils.ts
import { prisma } from "@/lib/prisma"

// 🔹 Definição da hierarquia de perfis (APENAS ADICIONA permissões)
const HIERARQUIA_PERFIS: Record<string, string[]> = {
  SuperAdmin: ["Administrador", "Supervisor", "Atendente", "Leitor"],
  Administrador: ["Supervisor", "Atendente", "Leitor"],
  Supervisor: ["Atendente", "Leitor"],
  Atendente: ["Leitor"],
  Leitor: [],
}

// 🔹 Função para obter permissões SEM remover superiores
export async function getPermissoesPorPerfil(perfilNome: string) {
  const perfisHerdados = [perfilNome, ...(HIERARQUIA_PERFIS[perfilNome] || [])]

  const permissoes = await prisma.permissao.findMany({
    where: {
      perfil: {
        nome: { in: perfisHerdados },
        active: true, // 🔹 Filtra apenas perfis ativos
      },
    },
    select: {
      id: true,
      acao: true,
      recurso: true,
      permitido: true,
    },
  })

  const permissoesMap = new Map<
    string,
    { id: number; acao: string; recurso: string; permitido: boolean }
  >()

  permissoes.forEach((p) => {
    const key = `${p.acao}_${p.recurso}`
    if (!permissoesMap.has(key) || p.permitido) {
      permissoesMap.set(key, {
        id: p.id,
        acao: p.acao,
        recurso: p.recurso,
        permitido: p.permitido,
      })
    }
  })

  return Array.from(permissoesMap.values())
}

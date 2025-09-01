// lib/helpers/permissoes-utils.ts
import { prisma } from "@/lib/prisma"

/**
 * Resolve os nomes de perfis a considerar para um perfil base, incluindo herança.
 *
 * @remarks
 * A herança é modelada em banco via `PerfilHeranca` (DAG). A resolução percorre
 * recursivamente (via laços iterativos) os pais ativos de um perfil, evitando
 * ciclos com um conjunto visitado.
 *
 * @param perfilNome - Nome do perfil base (ex.: "Administrador").
 * @returns Lista de nomes de perfis: o próprio e todos os pais herdados.
 */
export async function getPerfisHerdadosNomes(perfilNome: string): Promise<string[]> {
  const base = await prisma.perfil.findUnique({
    where: { nome: perfilNome },
    select: { id: true, nome: true, active: true },
  })
  if (!base?.active) return []

  const resultNames = new Set<string>([base.nome])
  const visited = new Set<number>([base.id])
  let frontier: number[] = [base.id]

  while (frontier.length) {
    const edges = await prisma.perfilHeranca.findMany({
      where: { childId: { in: frontier } },
      select: {
        parentId: true,
        parent: { select: { id: true, nome: true, active: true } },
      },
    })

    frontier = []
    for (const e of edges) {
      if (!e.parent.active) continue
      if (visited.has(e.parentId)) continue
      visited.add(e.parentId)
      resultNames.add(e.parent.nome)
      frontier.push(e.parentId)
    }
  }

  return Array.from(resultNames)
}

/**
 * Obtém permissões efetivas para um perfil considerando a herança em banco.
 *
 * @remarks
 * Regras de união: se qualquer perfil herdado conceder (`permitido = true`), o
 * par `{acao,recurso}` é considerado permitido; permissões `false` não removem
 * concessões já obtidas por perfis superiores.
 */
export async function getPermissoesPorPerfil(perfilNome: string) {
  const perfisHerdados = await getPerfisHerdadosNomes(perfilNome)

  const permissoes = await prisma.permissao.findMany({
    where: {
      perfil: {
        nome: { in: perfisHerdados },
        active: true,
      },
    },
    select: {
      id: true,
      perfilId: true,
      perfil: { select: { nome: true } },
      acao: true,
      recurso: true,
      permitido: true,
    },
  })

  const permissoesMap = new Map<
    string,
    {
      id: number
      perfilId: number
      perfilNome?: string
      acao: string
      recurso: string
      permitido: boolean
    }
  >()

  for (const p of permissoes) {
    const key = `${p.acao}_${p.recurso}`
    if (!permissoesMap.has(key) || p.permitido) {
      permissoesMap.set(key, {
        id: p.id,
        perfilId: p.perfilId,
        perfilNome: p.perfil?.nome,
        acao: p.acao,
        recurso: p.recurso,
        permitido: p.permitido,
      })
    }
  }

  return Array.from(permissoesMap.values())
}

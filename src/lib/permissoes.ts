/**
 * @fileoverview
 * Adaptação de permissões por usuário para o formato `PermissionsMap` e helpers
 * para verificação de acesso por par `{ acao, recurso }`.
 *
 * @remarks
 * Este módulo consulta as permissões do perfil do usuário via Prisma e as
 * organiza em `PermissionsMap` (ver `@/lib/permissions`).
 */
import type { AcaoPermissao, RecursoPermissao } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { pode, toPermissionsMap, type PermissionsMap } from "@/lib/permissions"
import { getPermissoesPorPerfil } from "@/helpers/permissoes-utils"

/**
 * Cache em memória para permissões por usuário (chave: email).
 * TTL padrão: 60s. Invalidação total exposta via {@link invalidatePermissionsCache}.
 */
const PERMS_TTL_MS = 60_000
const permsCache = new Map<string, { expires: number; value: PermissionsMap }>()

/**
 * Invalida o cache de permissões em memória.
 *
 * @remarks
 * Estratégia simples e segura: limpa todo o cache. Pode ser evoluída para
 * invalidação por perfil/usuário conforme necessidade.
 */
export function invalidatePermissionsCache() {
  permsCache.clear()
}

/**
 * Busca permissões concedidas ao usuário e as converte para `PermissionsMap`.
 *
 * @param email - Email do usuário autenticado.
 * @returns Mapa de permissões no formato `PermissionsMap`.
 * @example
 * ```ts
 * const perms = await buscarPermissoesConcedidas('user@example.com')
 * if (pode(perms, 'Exibir', 'Processo')) { /* ... *\/ }
 * ```
 */
/**
 * Busca as permissões efetivas de um usuário alinhadas à mesma fonte utilizada no frontend.
 *
 * @remarks
 * Alinha o backend ao frontend utilizando `getPermissoesPorPerfil(perfil.nome)`
 * como fonte única de verdade (inclui herança configurada) e converte o
 * resultado para `PermissionsMap` via `toPermissionsMap`. Evita divergências
 * onde a UI indicava acesso e o servidor negava.
 *
 * @param email - Email do usuário autenticado.
 * @returns `PermissionsMap` com flags por `{acao, recurso}`.
 *
 * @example
 * const perms = await buscarPermissoesConcedidas('user@example.com')
 * if (pode(perms, 'Exibir', 'Processo')) { /* ... *\/ }
 */
export async function buscarPermissoesConcedidas(email: string): Promise<PermissionsMap> {
  // Carrega o usuário com seu perfil
  const usuario = await prisma.user.findUnique({
    where: { email },
    include: { perfil: true },
  })

  // Se não houver perfil ativo, retorna mapa vazio (sem acesso)
  if (!usuario?.perfil?.active) return {}

  // Cache: retorna se existir e não expirou
  const now = Date.now()
  const cached = permsCache.get(email)
  if (cached && cached.expires > now) {
    return cached.value
  }

  // Mesma agregação de permissões usada no endpoint /api/permissoes (UI)
  const permissoesLista = await getPermissoesPorPerfil(usuario.perfil.nome)
  const map = toPermissionsMap(permissoesLista)

  permsCache.set(email, { expires: now + PERMS_TTL_MS, value: map })
  return map
}

/**
 * Verifica se um usuário possui permissão para um par `{ acao, recurso }`.
 *
 * @param email - Email do usuário autenticado.
 * @param acao - Ação requerida.
 * @param recurso - Recurso alvo.
 * @returns `true` quando permitido, `false` caso contrário.
 */
export async function verificarPermissao(
  email: string,
  acao: AcaoPermissao,
  recurso: RecursoPermissao
): Promise<boolean> {
  const permissoes = await buscarPermissoesConcedidas(email)
  return pode(permissoes, acao, recurso)
}

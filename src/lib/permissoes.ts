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
import { pode, type PermissionsMap } from "@/lib/permissions"

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
export async function buscarPermissoesConcedidas(email: string): Promise<PermissionsMap> {
  const usuario = await prisma.user.findUnique({
    where: { email },
    include: {
      perfil: {
        include: {
          permissoes: true,
        },
      },
    },
  })

  const map: PermissionsMap = {}
  if (!usuario?.perfil?.permissoes) return map

  for (const p of usuario.perfil.permissoes) {
    const acao = p.acao as AcaoPermissao
    const recurso = p.recurso as RecursoPermissao
    map[acao] ??= {}
    map[acao]![recurso] = !!p.permitido
  }

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

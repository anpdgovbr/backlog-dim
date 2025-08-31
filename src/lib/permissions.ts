/**
 * @fileoverview
 * Tipos e utilitários para autorização (RBAC) usando `PermissionsMap`,
 * mapeando pares `{ acao, recurso }` para flags booleanas.
 *
 * @remarks
 * Futuro: `AcaoPermissao` e `RecursoPermissao` devem se tornar enums do Prisma
 * (ou FKs) para integridade em nível de banco. Esta camada não deve assumir
 * herança; a agregação deve ocorrer no servidor antes de chegar aqui.
 */
import type {
  AcaoPermissao,
  PermissaoDto,
  RecursoPermissao,
} from "@anpdgovbr/shared-types"

/**
 * Mapa de permissões indexado por `acao` e `recurso`.
 *
 * @example
 * ```ts
 * const perms: PermissionsMap = {
 *   Exibir: { Processo: true },
 *   Editar: { Usuario: false },
 * }
 * ```
 */
/**
 * Estrutura de dados para checagem de acesso por par `{acao,recurso}`.
 */
export type PermissionsMap = Partial<
  Record<AcaoPermissao, Partial<Record<RecursoPermissao, boolean>>>
>

/**
 * Converte uma lista de `PermissaoDto` em `PermissionsMap`.
 *
 * @param list - Lista de permissões vinda do banco/perfil.
 * @returns Mapa de permissões por `{ acao, recurso }`.
 */
/**
 * Converte uma lista de permissões (DTO) para `PermissionsMap`.
 */
export function toPermissionsMap(list?: PermissaoDto[] | null): PermissionsMap {
  const map: PermissionsMap = {}
  if (!Array.isArray(list)) return map
  for (const p of list) {
    const acao = p.acao as AcaoPermissao
    const recurso = p.recurso as RecursoPermissao
    map[acao] ??= {}
    map[acao][recurso] = !!p.permitido
  }
  return map
}

/**
 * Verifica se um par `{ acao, recurso }` está permitido.
 *
 * @param perms - Mapa de permissões.
 * @param acao - Ação requerida.
 * @param recurso - Recurso alvo.
 * @returns `true` quando permitido, `false` caso contrário.
 */
export function pode(
  perms: PermissionsMap,
  acao: AcaoPermissao,
  recurso: RecursoPermissao
): boolean {
  return !!perms?.[acao]?.[recurso]
}

/**
 * Retorna `true` se qualquer par do conjunto estiver permitido.
 *
 * @param perms - Mapa de permissões.
 * @param pairs - Lista de pares `[acao, recurso]` a validar.
 */
export function hasAny(
  perms: PermissionsMap,
  pairs: Array<readonly [AcaoPermissao, RecursoPermissao]>
): boolean {
  for (const [acao, recurso] of pairs) {
    if (pode(perms, acao, recurso)) return true
  }
  return false
}

/**
 * Compatibilidade transitória (opcional): mapa por chave concatenada.
 *
 * @deprecated Prefira `PermissionsMap`. Este formato plano será removido após a
 * migração completa para checagens por `{acao,recurso}`.
 */
export type FlatKey = `${AcaoPermissao}_${RecursoPermissao}`
/**
 * Converte para um mapa plano por chave concatenada `Acao_Recurso`.
 *
 * @param list - Lista de permissões.
 * @returns Mapa plano `{ ["Acao_Recurso"]: boolean }`.
 * @deprecated Utilize `toPermissionsMap` e `pode(...)`. Previsto para remoção.
 */
export function toFlatKeyMap(
  list?: PermissaoDto[] | null
): Partial<Record<FlatKey, boolean>> {
  const out: Partial<Record<FlatKey, boolean>> = {}
  if (!Array.isArray(list)) return out
  for (const p of list) {
    const key = `${p.acao}_${p.recurso}` as FlatKey
    out[key] = !!p.permitido
  }
  return out
}

import type {
  AcaoPermissao,
  PermissaoDto,
  RecursoPermissao,
} from "@anpdgovbr/shared-types"

export type PermissionsMap = Partial<
  Record<AcaoPermissao, Partial<Record<RecursoPermissao, boolean>>>
>

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

export function pode(
  perms: PermissionsMap,
  acao: AcaoPermissao,
  recurso: RecursoPermissao
): boolean {
  return !!perms?.[acao]?.[recurso]
}

export function hasAny(
  perms: PermissionsMap,
  pairs: Array<readonly [AcaoPermissao, RecursoPermissao]>
): boolean {
  for (const [acao, recurso] of pairs) {
    if (pode(perms, acao, recurso)) return true
  }
  return false
}

// Compatibilidade transitória (opcional): mapa por chave concatenada
export type FlatKey = `${AcaoPermissao}_${RecursoPermissao}`
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

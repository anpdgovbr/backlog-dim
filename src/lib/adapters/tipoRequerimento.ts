import type { TipoRequerimento as PrismaTipoRequerimento } from "@prisma/client"
import type { TipoRequerimento } from "@anpdgovbr/shared-types"
import { TIPO_REQUERIMENTO_VALUES, isTipoRequerimento } from "@anpdgovbr/shared-types"

export const SHARED_TIPO_REQUERIMENTO_VALUES = TIPO_REQUERIMENTO_VALUES
export type SharedTipoRequerimentoLiteral = (typeof TIPO_REQUERIMENTO_VALUES)[number]

export function isSharedTipoRequerimento(x: unknown): x is SharedTipoRequerimentoLiteral {
  return isTipoRequerimento(x)
}

export function toPrismaTipoRequerimento(
  s: SharedTipoRequerimentoLiteral | null | undefined
): PrismaTipoRequerimento | null | undefined {
  return s as unknown as PrismaTipoRequerimento | null | undefined
}

export function fromPrismaTipoRequerimento(
  s: PrismaTipoRequerimento | null | undefined
): SharedTipoRequerimentoLiteral | null | undefined {
  return s as unknown as TipoRequerimento | null | undefined
}

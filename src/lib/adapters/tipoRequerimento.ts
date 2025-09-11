import type { TipoRequerimento as PrismaTipoRequerimento } from "@prisma/client"
import type { TipoRequerimento } from "@anpdgovbr/shared-types"
import { TIPO_REQUERIMENTO_VALUES, isTipoRequerimento } from "@anpdgovbr/shared-types"

export const SHARED_TIPO_REQUERIMENTO_VALUES = TIPO_REQUERIMENTO_VALUES
export type SharedTipoRequerimentoLiteral = (typeof TIPO_REQUERIMENTO_VALUES)[number]

export function isSharedTipoRequerimento(x: unknown): x is SharedTipoRequerimentoLiteral {
  return isTipoRequerimento(x)
}

/**
 * Converts a SharedTipoRequerimentoLiteral to PrismaTipoRequerimento.
 * Performs runtime validation to ensure the value is valid for PrismaTipoRequerimento.
 * Assumes that the enums/literals are kept in sync between shared-types and Prisma.
 */
export function toPrismaTipoRequerimento(
  s: SharedTipoRequerimentoLiteral | null | undefined
): PrismaTipoRequerimento | null | undefined {
  if (s == null) return s;
  // @ts-expect-error: We assume the enums are compatible; runtime check for safety.
  if (Object.values<string>(PrismaTipoRequerimento as any).includes(s)) {
    return s as PrismaTipoRequerimento;
  }
  return undefined;
}

/**
 * Converts a PrismaTipoRequerimento to SharedTipoRequerimentoLiteral.
 * Performs runtime validation to ensure the value is valid for SharedTipoRequerimentoLiteral.
 * Assumes that the enums/literals are kept in sync between Prisma and shared-types.
 */
export function fromPrismaTipoRequerimento(
  s: PrismaTipoRequerimento | null | undefined
): SharedTipoRequerimentoLiteral | null | undefined {
  if (s == null) return s;
  if (TIPO_REQUERIMENTO_VALUES.includes(s as any)) {
    return s as SharedTipoRequerimentoLiteral;
  }
  return undefined;
}

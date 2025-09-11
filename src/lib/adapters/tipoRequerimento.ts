import type { TipoRequerimento as PrismaTipoRequerimento } from "@prisma/client"
import type { TipoRequerimento as SharedTipoRequerimento } from "@anpdgovbr/shared-types"
import {
  TIPO_REQUERIMENTO_VALUES,
  isTipoRequerimento as isSharedTipoRequerimento,
} from "@anpdgovbr/shared-types"

/**
 * Valores válidos do TipoRequerimento expostos pelo shared-types (fonte de verdade).
 */
export const SHARED_TIPO_REQUERIMENTO_VALUES = TIPO_REQUERIMENTO_VALUES

/**
 * Type guard para TipoRequerimento do shared-types.
 */
export { isSharedTipoRequerimento }

/**
 * Converte TipoRequerimento do shared-types para o enum do Prisma.
 * Pressupõe que os literais são idênticos entre as definições.
 */
export function toPrismaTipoRequerimento(
  s: SharedTipoRequerimento | null | undefined
): PrismaTipoRequerimento | null | undefined {
  return s as unknown as PrismaTipoRequerimento
}

/**
 * Converte TipoRequerimento do Prisma para o enum do shared-types.
 */
export function fromPrismaTipoRequerimento(
  s: PrismaTipoRequerimento | null | undefined
): SharedTipoRequerimento | null | undefined {
  return s as unknown as SharedTipoRequerimento
}

import type { StatusInterno as SharedStatusInterno } from "@anpdgovbr/shared-types"
import {
  STATUS_INTERNO_VALUES,
  isStatusInterno as isSharedStatusInterno,
} from "@anpdgovbr/shared-types"
import type { StatusInterno as PrismaStatusInterno } from "@prisma/client"

/**
 * Valores válidos do StatusInterno expostos pelo shared-types (fonte de verdade).
 */
export const SHARED_STATUS_INTERNOS = STATUS_INTERNO_VALUES

/**
 * Type guard para StatusInterno do shared-types.
 */
export { isSharedStatusInterno }

/**
 * Converte StatusInterno do shared-types para o enum do Prisma.
 * Pressupõe que os literais são idênticos entre as definições.
 */
export function toPrismaStatus(
  s: SharedStatusInterno | null | undefined
): PrismaStatusInterno | null | undefined {
  return s as unknown as PrismaStatusInterno
}

/**
 * Converte StatusInterno do Prisma para o enum do shared-types.
 * Útil ao mapear registros do BD para DTOs de domínio.
 */
export function fromPrismaStatus(
  s: PrismaStatusInterno | null | undefined
): SharedStatusInterno | null | undefined {
  return s as unknown as SharedStatusInterno
}

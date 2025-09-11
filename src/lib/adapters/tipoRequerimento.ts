import type { TipoRequerimento as PrismaTipoRequerimento } from "@prisma/client"

/**
 * Fonte de verdade de domínio para TipoRequerimento (até shared-types expor helpers).
 * Mantém os mesmos literais persistidos no banco/Prisma.
 */
export const SHARED_TIPO_REQUERIMENTO_VALUES = [
  "PETICAO_TITULAR",
  "DENUNCIA_LGPD",
] as const

export type SharedTipoRequerimentoLiteral =
  (typeof SHARED_TIPO_REQUERIMENTO_VALUES)[number]

export function isSharedTipoRequerimento(x: unknown): x is SharedTipoRequerimentoLiteral {
  return (
    typeof x === "string" &&
    (SHARED_TIPO_REQUERIMENTO_VALUES as readonly string[]).includes(x)
  )
}

/**
 * Converte um valor de domínio para o enum do Prisma.
 * Pressupõe literais idênticos entre domínio e Prisma.
 */
export function toPrismaTipoRequerimento(
  s: SharedTipoRequerimentoLiteral | null | undefined
): PrismaTipoRequerimento | null | undefined {
  return s as unknown as PrismaTipoRequerimento | null | undefined
}

/**
 * Converte do enum Prisma para o literal do domínio.
 */
export function fromPrismaTipoRequerimento(
  s: PrismaTipoRequerimento | null | undefined
): SharedTipoRequerimentoLiteral | null | undefined {
  return s as unknown as SharedTipoRequerimentoLiteral | null | undefined
}

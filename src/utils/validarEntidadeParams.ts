import type { Prisma } from "@prisma/client"

import { NextResponse } from "next/server"

import type { MetaEntidade } from "@/types/MetaEntidades"
import { allowedEntities } from "@/types/MetaEntidades"

/**
 * Representa um delegate simplificado compatível com os métodos usados
 * no código para operar com modelos Prisma.
 *
 * Este tipo descreve apenas os métodos necessários pelos handlers/APIs do
 * repositório: findMany, create, update, findUnique e count.
 *
 * @typeParam T - Tipo da entidade atendida pelo delegate.
 */
export type PrismaDelegate<T> = {
  findMany: (args?: Prisma.Args<T, "findMany">) => Promise<T[]>
  create: (args: Prisma.Args<T, "create">) => Promise<T>
  update: (args: Prisma.Args<T, "update">) => Promise<T>
  findUnique: (args: Prisma.Args<T, "findUnique">) => Promise<T | null>
  count: (args?: Prisma.Args<T, "count">) => Promise<number>
}

/**
 * Resultado da validação dos parâmetros que esperam uma "entidade".
 *
 * - Quando válido: { valid: true; entidade: MetaEntidade; model: PrismaDelegate<unknown> }
 * - Quando inválido: { valid: false; response: Response } onde `response` é uma NextResponse
 *   pronta para ser retornada pela API (ex.: 400 - Entidade ausente/Inválida).
 */
export type ValidarEntidadeResult =
  | { valid: true; entidade: MetaEntidade; model: PrismaDelegate<unknown> }
  | { valid: false; response: Response }

const cache = new Map<string, PrismaDelegate<unknown>>()

/**
 * Valida o parâmetro `entidade` (tipicamente vindo de rota/params) e resolve o model
 * correspondente a partir de allowedEntities. Usa cache interno para evitar resolver
 * o mesmo model repetidamente.
 *
 * Regras:
 * - Se `params.entidade` estiver ausente => retorna NextResponse.json(...) com status 400.
 * - Normaliza `entidade` para lowercase e verifica se existe em allowedEntities.
 * - Se inválida => retorna NextResponse.json(...) com status 400.
 * - Se válida => retorna { valid: true, entidade, model } com o PrismaDelegate associado.
 *
 * @param params - Objeto contendo a propriedade opcional `entidade`.
 * @returns ValidarEntidadeResult indicando sucesso (com entidade e model) ou falha (com Response).
 */
export function validarEntidadeParams(params: {
  entidade?: string
}): ValidarEntidadeResult {
  if (!params?.entidade) {
    return {
      valid: false,
      response: NextResponse.json({ error: "Entidade ausente" }, { status: 400 }),
    }
  }

  const entidade = params.entidade.toLowerCase() as MetaEntidade

  if (!allowedEntities[entidade]) {
    return {
      valid: false,
      response: NextResponse.json({ error: "Entidade inválida" }, { status: 400 }),
    }
  }

  if (cache.has(entidade)) {
    return {
      valid: true,
      entidade,
      model: cache.get(entidade)!,
    }
  }

  const model = allowedEntities[entidade] as unknown as PrismaDelegate<unknown>
  cache.set(entidade, model)

  return { valid: true, entidade, model }
}

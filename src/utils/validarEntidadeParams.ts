import { MetaEntidade, allowedEntities } from "@/types/MetaEntidades"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

type PrismaDelegate<T> = {
  findMany: (args?: Prisma.Args<T, "findMany">) => Promise<T[]>
  create: (args: Prisma.Args<T, "create">) => Promise<T>
  update: (args: Prisma.Args<T, "update">) => Promise<T>
  findUnique: (args: Prisma.Args<T, "findUnique">) => Promise<T | null>
  count: (args?: Prisma.Args<T, "count">) => Promise<number>
}

type ValidarEntidadeResult =
  | { valid: true; entidade: MetaEntidade; model: PrismaDelegate<unknown> }
  | { valid: false; response: Response }

const cache = new Map<string, PrismaDelegate<unknown>>()

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

import type { PrismaClient } from "@prisma/client"

// 🔹 Apenas os delegates de modelo (remove funções utilitárias)
type ModelKeysOnly = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof PrismaClient]: PrismaClient[K] extends { findFirst: any } ? K : never
}[keyof PrismaClient]

export async function getOrRestoreByName<T extends ModelKeysOnly>(
  tx: Pick<PrismaClient, T>,
  modelName: T,
  nome: string
): Promise<{ id: number; active: boolean }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const model = tx[modelName] as any

  let entity = await model.findFirst({ where: { nome } })

  if (entity && !entity.active) {
    entity = await model.update({
      where: { id: entity.id },
      data: { active: true, exclusionDate: null },
    })
  }

  if (!entity) {
    entity = await model.create({ data: { nome } })
  }

  return entity
}

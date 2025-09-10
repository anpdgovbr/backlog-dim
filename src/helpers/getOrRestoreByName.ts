type EntityMinimal = { id: number; active: boolean }

type DelegateForName = {
  findFirst: (args: { where: { nome: string } }) => Promise<EntityMinimal | null>
  update: (args: {
    where: { id: number }
    data: { active: boolean; exclusionDate: Date | null }
  }) => Promise<EntityMinimal>
  create: (args: { data: { nome: string } }) => Promise<EntityMinimal>
}

export async function getOrRestoreByName(
  tx: Record<string, unknown>,
  modelName: string,
  nome: string
): Promise<EntityMinimal> {
  const model = tx[modelName] as unknown as DelegateForName

  let entity = await model.findFirst({ where: { nome } })

  if (entity && !entity.active) {
    entity = await model.update({
      where: { id: entity.id },
      data: { active: true, exclusionDate: null },
    })
  }

  entity ??= await model.create({ data: { nome } })

  return entity
}

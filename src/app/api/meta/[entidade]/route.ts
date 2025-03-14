import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const allowedEntities = {
  setor: prisma.setor,
  situacao: prisma.situacao,
  encaminhamento: prisma.encaminhamento,
  pedidomanifestacao: prisma.pedidoManifestacao,
  contatoprevio: prisma.contatoPrevio,
  evidencia: prisma.evidencia,
  formaentrada: prisma.formaEntrada,
} as const

type EntidadeKey = keyof typeof allowedEntities

type PrismaDelegate<T> = {
  findMany: (args?: Prisma.Args<T, "findMany">) => Promise<T[]>
  create: (args: Prisma.Args<T, "create">) => Promise<T>
  update: (args: Prisma.Args<T, "update">) => Promise<T>
  delete: (args: Prisma.Args<T, "delete">) => Promise<T>
  findUnique: (args: Prisma.Args<T, "findUnique">) => Promise<T>
}

// Converte `allowedEntities[entidade]` para o tipo correto
const getPrismaModel = (entidade: EntidadeKey): PrismaDelegate<any> => {
  return allowedEntities[entidade] as unknown as PrismaDelegate<any>
}

export async function GET(
  req: NextRequest,
  { params }: { params: Readonly<{ entidade: string }> }
) {
  const ent = await params
  const entidade = ent.entidade.toLowerCase() as EntidadeKey

  if (!(entidade in allowedEntities))
    return NextResponse.json({ error: "Entidade inválida" }, { status: 400 })

  try {
    const model = getPrismaModel(entidade)
    const data = await model.findMany()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Readonly<{ entidade: string }> }
) {
  const ent = await params
  const entidade = ent.entidade.toLowerCase() as EntidadeKey
  if (!(entidade in allowedEntities))
    return NextResponse.json({ error: "Entidade inválida" }, { status: 400 })

  try {
    const { nome } = await req.json()
    if (!nome) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })

    const model = getPrismaModel(entidade)
    const newItem = await model.create({ data: { nome } })
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Readonly<{ entidade: string }> }
) {
  const ent = await params
  const entidade = ent.entidade.toLowerCase() as EntidadeKey
  if (!(entidade in allowedEntities))
    return NextResponse.json({ error: "Entidade inválida" }, { status: 400 })

  try {
    const { id, nome } = await req.json()
    if (!id || !nome)
      return NextResponse.json({ error: "ID e Nome são obrigatórios" }, { status: 400 })

    const model = getPrismaModel(entidade)
    const updatedItem = await model.update({
      where: { id },
      data: { nome },
    })
    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Readonly<{ entidade: string }> }
) {
  const ent = await params
  const entidade = ent.entidade.toLowerCase() as EntidadeKey

  if (!(entidade in allowedEntities))
    return NextResponse.json({ error: "Entidade inválida" }, { status: 400 })

  try {
    const { id } = await req.json()
    if (!id || isNaN(Number(id)))
      return NextResponse.json({ error: "ID inválido ou ausente" }, { status: 400 })

    const model = getPrismaModel(entidade)
    const existingItem = await model.findUnique({ where: { id: Number(id) } })

    if (!existingItem) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 })
    }

    await model.delete({ where: { id: Number(id) } })
    return NextResponse.json({ message: "Deletado com sucesso" })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

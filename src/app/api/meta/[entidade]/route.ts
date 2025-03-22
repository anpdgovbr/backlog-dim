import authOptions from "@/config/next-auth.config"
import { buscarPermissoesConcedidas, pode } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

const allowedEntities = {
  setor: prisma.setor,
  situacao: prisma.situacao,
  encaminhamento: prisma.encaminhamento,
  pedidomanifestacao: prisma.pedidoManifestacao,
  contatoprevio: prisma.contatoPrevio,
  evidencia: prisma.evidencia,
  formaentrada: prisma.formaEntrada,
  responsavel: prisma.responsavel,
  tiporeclamacao: prisma.tipoReclamacao,
} as const

type EntidadeKey = keyof typeof allowedEntities

type PrismaDelegate<T> = {
  findMany: (args?: Prisma.Args<T, "findMany">) => Promise<T[]>
  create: (args: Prisma.Args<T, "create">) => Promise<T>
  update: (args: Prisma.Args<T, "update">) => Promise<T>
  findUnique: (args: Prisma.Args<T, "findUnique">) => Promise<T | null>
  count: (args?: Prisma.Args<T, "count">) => Promise<number>
}

const getPrismaModel = (entidade: EntidadeKey): PrismaDelegate<unknown> => {
  return allowedEntities[entidade] as unknown as PrismaDelegate<unknown>
}

async function validarAcesso(
  email: string,
  acao: "Exibir" | "Cadastrar" | "Editar" | "Desabilitar"
) {
  const permissoes = await buscarPermissoesConcedidas(email)
  return pode(permissoes, `${acao}_Metadados`)
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entidade: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email)
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })

  if (!(await validarAcesso(session.user.email, "Exibir")))
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })

  const ent = await params
  const entidade = ent.entidade.toLowerCase() as EntidadeKey

  if (!(entidade in allowedEntities))
    return NextResponse.json({ error: "Entidade inválida" }, { status: 400 })

  try {
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page")) || 1
    const pageSize = Number(searchParams.get("pageSize")) || 10
    const orderBy = searchParams.get("orderBy") || "id"
    const ascending = searchParams.get("ascending") === "true"

    const skip = (page - 1) * pageSize
    const take = pageSize

    const model = getPrismaModel(entidade)

    const [total, data] = await Promise.all([
      model.count({
        where: { active: true },
      }),
      model.findMany({
        where: { active: true },
        skip,
        take,
        orderBy: { [orderBy]: ascending ? "asc" : "desc" },
      }),
    ])

    return NextResponse.json({ data, total })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ entidade: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email)
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  if (!(await validarAcesso(session.user.email, "Cadastrar")))
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })

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
  { params }: { params: Promise<{ entidade: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email)
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  if (!(await validarAcesso(session.user.email, "Editar")))
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })

  const ent = await params
  const entidade = ent.entidade.toLowerCase() as EntidadeKey
  if (!(entidade in allowedEntities))
    return NextResponse.json({ error: "Entidade inválida" }, { status: 400 })

  try {
    const { id, nome } = await req.json()
    if (!id || !nome)
      return NextResponse.json({ error: "ID e Nome são obrigatórios" }, { status: 400 })

    const model = getPrismaModel(entidade)
    const updatedItem = await model.update({ where: { id }, data: { nome } })
    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ entidade: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email)
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  if (!(await validarAcesso(session.user.email, "Desabilitar")))
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })

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
    if (!existingItem)
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 })

    await model.update({
      where: { id: Number(id) },
      data: { active: false, exclusionDate: new Date() }, // ⬅️ Soft delete
    })

    return NextResponse.json({ message: "Desabilitado com sucesso" })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

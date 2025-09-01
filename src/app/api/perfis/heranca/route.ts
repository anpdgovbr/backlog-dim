import { NextResponse } from "next/server"

import { withApi } from "@/lib/withApi"
import { prisma } from "@/lib/prisma"
import { invalidatePermissionsCache } from "@/lib/permissoes"

/**
 * Lista relações de herança entre perfis.
 *
 * @remarks
 * Protegido por `{acao: "Exibir", recurso: "Permissoes"}`.
 */
export const GET = withApi(
  async () => {
    const edges = await prisma.perfilHeranca.findMany({
      select: {
        parentId: true,
        childId: true,
        parent: { select: { id: true, nome: true, active: true } },
        child: { select: { id: true, nome: true, active: true } },
      },
    })

    return NextResponse.json(
      edges.map((e) => ({
        parentId: e.parentId,
        parentNome: e.parent.nome,
        parentAtivo: e.parent.active,
        childId: e.childId,
        childNome: e.child.nome,
        childAtivo: e.child.active,
      }))
    )
  },
  { permissao: { acao: "Exibir", recurso: "Permissoes" } }
)

/**
 * Cria uma relação de herança entre perfis: `child` herda de `parent`.
 *
 * @remarks
 * Protegido por `{acao: "Alterar", recurso: "Permissoes"}`.
 * Impede `parentId === childId` e requer perfis ativos.
 */
export const POST = withApi(
  async ({ req }) => {
    const { parentId, childId } = await req.json()
    const pId = Number(parentId)
    const cId = Number(childId)

    if (!Number.isFinite(pId) || !Number.isFinite(cId) || pId === cId) {
      return NextResponse.json({ error: "Par inválido" }, { status: 400 })
    }

    const [parent, child] = await Promise.all([
      prisma.perfil.findUnique({ where: { id: pId } }),
      prisma.perfil.findUnique({ where: { id: cId } }),
    ])

    if (!parent?.active || !child?.active) {
      return NextResponse.json(
        { error: "Perfis inexistentes ou inativos" },
        { status: 400 }
      )
    }

    // Evita duplicidade
    await prisma.perfilHeranca.create({ data: { parentId: pId, childId: cId } })

    invalidatePermissionsCache()
    return NextResponse.json({ success: true })
  },
  { permissao: { acao: "Alterar", recurso: "Permissoes" } }
)

/**
 * Remove uma relação de herança entre perfis.
 *
 * @remarks
 * Protegido por `{acao: "Alterar", recurso: "Permissoes"}`.
 * Recebe `parentId` e `childId` via querystring.
 */
export const DELETE = withApi(
  async ({ req }) => {
    const { searchParams } = new URL(req.url)
    const pId = Number(searchParams.get("parentId"))
    const cId = Number(searchParams.get("childId"))

    if (!Number.isFinite(pId) || !Number.isFinite(cId)) {
      return NextResponse.json({ error: "Par inválido" }, { status: 400 })
    }

    await prisma.perfilHeranca.delete({
      where: { parentId_childId: { parentId: pId, childId: cId } },
    })
    invalidatePermissionsCache()
    return NextResponse.json({ success: true })
  },
  { permissao: { acao: "Alterar", recurso: "Permissoes" } }
)

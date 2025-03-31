// app/api/requeridos/route.ts
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"
import { AcaoAuditoria } from "@prisma/client"

/**
 * 🔹 GET: Retorna requeridos com paginação e ordenação (sem auditoria)
 */
export const GET = withApiSlimNoParams(async ({ req }) => {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page")) || 1
  const pageSize = Number(searchParams.get("pageSize")) || 10
  const orderBy = searchParams.get("orderBy") || "nome"
  const ascending = searchParams.get("ascending") === "true"

  const skip = (page - 1) * pageSize
  const take = pageSize

  const total = await prisma.requerido.count({
    where: { active: true },
  })

  const requeridos = await prisma.requerido.findMany({
    where: { active: true },
    skip,
    take,
    orderBy: { [orderBy]: ascending ? "asc" : "desc" },
    include: {
      cnae: { select: { id: true, code: true, nome: true } },
      setor: { select: { id: true, nome: true } },
    },
  })

  return Response.json({ data: requeridos, total })
}, "Exibir_Processo")

/**
 * 🔹 POST: Cria um novo Requerido (com auditoria)
 */
export const POST = withApi(
  async ({ req }) => {
    const data = await req.json()

    const novoRequerido = await prisma.requerido.create({
      data: {
        ...data,
        active: true,
        exclusionDate: null,
      },
    })

    return {
      response: Response.json(novoRequerido, { status: 201 }),
      audit: { depois: novoRequerido },
    }
  },
  {
    permissao: "Cadastrar_Responsavel",
    tabela: "requerido",
    acao: AcaoAuditoria.CREATE,
  }
)

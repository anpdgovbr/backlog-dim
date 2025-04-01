import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { AcaoAuditoria } from "@prisma/client"

export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const processo = await prisma.processo.create({
        data,
        include: {
          formaEntrada: true,
          responsavel: true,
          situacao: true,
          encaminhamento: true,
        },
      })

      return {
        response: Response.json(processo, { status: 201 }),
        audit: {
          depois: processo,
        },
      }
    } catch (err) {
      console.error("Erro geral no POST:", err)
      return Response.json({ error: "Erro interno no servidor" }, { status: 500 })
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Processo",
  }
)

export const GET = withApi(
  async ({ req }) => {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const pageSize = Number(searchParams.get("pageSize")) || 10
    const orderBy = searchParams.get("orderBy") || "dataCriacao"
    const ascending = searchParams.get("ascending") === "true"
    const search = searchParams.get("search")?.toLowerCase() || ""
    const responsavelUserId = searchParams.get("responsavelUserId")

    const skip = (page - 1) * pageSize
    const take = pageSize

    const baseWhere = {
      active: true,
      ...(responsavelUserId ? { responsavel: { userId: responsavelUserId } } : {}),
      ...(search
        ? {
            OR: [
              { requerente: { contains: search, mode: "insensitive" as const } },
              { numero: { contains: search } },
              {
                responsavel: {
                  nome: { contains: search, mode: "insensitive" as const },
                },
              },
              {
                situacao: {
                  nome: { contains: search, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {}),
    }

    const [total, processos] = await Promise.all([
      prisma.processo.count({ where: baseWhere }),
      prisma.processo.findMany({
        where: baseWhere,
        skip,
        take,
        orderBy: { [orderBy]: ascending ? "asc" : "desc" },
        include: {
          formaEntrada: { select: { id: true, nome: true } },
          responsavel: { select: { id: true, nome: true, userId: true } },
          situacao: { select: { id: true, nome: true } },
          encaminhamento: { select: { id: true, nome: true } },
          tipoReclamacao: { select: { id: true, nome: true } },
        },
      }),
    ])

    return {
      response: Response.json({ data: processos, total }),
      audit: {
        depois: {
          page,
          search,
          totalResultados: total,
        },
      },
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.GET,
    permissao: "Exibir_Processo",
  }
)

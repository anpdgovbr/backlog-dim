import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"
import { AcaoAuditoria } from "@prisma/client"

export const GET = withApiSlimNoParams(async () => {
  const dados = await prisma.encaminhamento.findMany({
    where: { active: true },
  })

  return Response.json(dados)
}, "Exibir_Metadados")

export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.encaminhamento.create({
        data: {
          ...data,
          active: true,
          exclusionDate: null,
        },
      })

      return {
        response: Response.json(novoDado, { status: 201 }),
        audit: {
          depois: novoDado,
        },
      }
    } catch (error) {
      console.error("Erro ao criar encaminhamento:", error)
      return Response.json({ error: "Erro interno no servidor" }, { status: 500 })
    }
  },
  {
    tabela: "encaminhamento",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Metadados",
  }
)

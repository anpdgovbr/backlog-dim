import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"
import { AcaoAuditoria } from "@prisma/client"

// === GET ===
const handlerGET = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params

    const requerido = await prisma.requerido.findFirst({
      where: {
        id: Number(id),
        active: true,
      },
      include: {
        setor: true,
        cnae: true,
      },
    })

    if (!requerido) {
      return Response.json({ error: "Requerido não encontrado" }, { status: 404 })
    }

    return {
      response: Response.json(requerido),
      audit: {
        depois: { id: requerido.id },
      },
    }
  },
  {
    tabela: "requerido",
    acao: AcaoAuditoria.GET,
    permissao: "Exibir_Processo",
  }
)

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

// === PUT ===
const handlerPUT = withApiForId<{ id: string }>(
  async ({ params, req }) => {
    const { id } = params
    const body = await req.json()

    const existente = await prisma.requerido.findUnique({
      where: { id: Number(id) },
    })

    if (!existente || !existente.active) {
      return Response.json(
        { error: "Requerido não encontrado ou inativo" },
        { status: 404 }
      )
    }

    const atualizado = await prisma.requerido.update({
      where: { id: Number(id) },
      data: body,
    })

    return {
      response: Response.json(atualizado),
      audit: {
        antes: existente,
        depois: atualizado,
      },
    }
  },
  {
    tabela: "requerido",
    acao: AcaoAuditoria.UPDATE,
    permissao: "Editar_Responsavel",
  }
)

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPUT(req, { params: await context.params })
}

// === DELETE ===
const handlerDELETE = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params

    const existente = await prisma.requerido.findUnique({
      where: { id: Number(id) },
    })

    if (!existente || !existente.active) {
      return Response.json(
        { error: "Requerido não encontrado ou já excluído" },
        { status: 404 }
      )
    }

    await prisma.requerido.update({
      where: { id: Number(id) },
      data: {
        active: false,
        exclusionDate: new Date(),
      },
    })

    return {
      response: Response.json(
        { message: "Requerido excluído com sucesso" },
        { status: 200 }
      ),
      audit: {
        antes: existente,
      },
    }
  },
  {
    tabela: "requerido",
    acao: AcaoAuditoria.DELETE,
    permissao: "Desabilitar_Responsavel",
  }
)

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerDELETE(req, { params: await context.params })
}

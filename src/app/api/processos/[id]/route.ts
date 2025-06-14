import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"
import { AcaoAuditoria } from "@prisma/client"

// === GET ===
const handlerGET = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params

    const processo = await prisma.processo.findFirst({
      where: { id: Number(id), active: true },
      include: {
        formaEntrada: true,
        responsavel: true,
        situacao: true,
        encaminhamento: true,
        pedidoManifestacao: true,
        contatoPrevio: true,
        evidencia: true,
        tipoReclamacao: true,
        processoStatus: true,
      },
    })

    if (!processo) {
      return Response.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    return {
      response: Response.json(processo),
      audit: {
        depois: { id: processo.id },
      },
    }
  },
  {
    tabela: "processo",
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

    const processoAtual = await prisma.processo.findUnique({
      where: { id: Number(id) },
    })

    if (!processoAtual || !processoAtual.active) {
      return Response.json(
        { error: "Processo não encontrado ou inativo" },
        { status: 404 }
      )
    }

    const parseDate = (dateStr?: string) =>
      dateStr ? new Date(`${dateStr}T00:00:00.000Z`) : null

    const camposComparaveis: (keyof typeof body)[] = [
      "requerente",
      "formaEntradaId",
      "responsavelId",
      "requeridoId",
      "situacaoId",
      "encaminhamentoId",
      "pedidoManifestacaoId",
      "contatoPrevioId",
      "evidenciaId",
      "anonimo",
      "tipoReclamacaoId",
      "observacoes",
      "temaRequerimento",
      "tipoRequerimento",
      "resumo",
      "dataConclusao",
      "dataEnvioPedido",
      "prazoPedido",
      "requeridoFinalId",
    ]

    const houveAlteracao = camposComparaveis.some((campo) => {
      const valorNovo = JSON.stringify(body[campo] ?? null)
      const valorAntigo = JSON.stringify((processoAtual as any)[campo] ?? null)
      return valorNovo !== valorAntigo
    })

    const novoStatusInterno =
      (processoAtual.statusInterno === "IMPORTADO" ||
        processoAtual.statusInterno === "NOVO") &&
      houveAlteracao
        ? "EM_PROCESSAMENTO"
        : processoAtual.statusInterno

    const processoAtualizado = await prisma.processo.update({
      where: { id: Number(id) },
      data: {
        numero: body.numero,
        dataCriacao: body.dataCriacao ? new Date(body.dataCriacao) : undefined,
        requerente: body.requerente,
        formaEntradaId: body.formaEntradaId ?? null,
        responsavelId: body.responsavelId ?? null,
        requeridoId: body.requeridoId ?? null,
        situacaoId: body.situacaoId ?? null,
        encaminhamentoId: body.encaminhamentoId ?? null,
        pedidoManifestacaoId: body.pedidoManifestacaoId ?? null,
        contatoPrevioId: body.contatoPrevioId ?? null,
        evidenciaId: body.evidenciaId ?? null,
        anonimo: body.anonimo ?? false,
        tipoReclamacaoId: body.tipoReclamacaoId ?? null,
        observacoes: body.observacoes,
        processoStatusId: body.processoStatusId ?? null,
        resumo: body.resumo ?? null,
        dataConclusao: parseDate(body.dataConclusao),
        dataEnvioPedido: parseDate(body.dataEnvioPedido),
        prazoPedido: body.prazoPedido ? Number(body.prazoPedido) : null,
        temaRequerimento: Array.isArray(body.temaRequerimento)
          ? body.temaRequerimento
          : [],
        tipoRequerimento: body.tipoRequerimento !== "" ? body.tipoRequerimento : null,
        requeridoFinalId: body.requeridoFinalId ?? null,
        dataVencimento: body.dataVencimento ? new Date(body.dataVencimento) : null,
        statusInterno: novoStatusInterno,
      },
    })

    return {
      response: Response.json(processoAtualizado),
      audit: {
        antes: processoAtual,
        depois: processoAtualizado,
      },
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.UPDATE,
    permissao: "EditarGeral_Processo",
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

    const processo = await prisma.processo.findUnique({
      where: { id: Number(id) },
    })

    if (!processo || !processo.active) {
      return Response.json(
        { error: "Processo não encontrado ou já excluído" },
        { status: 404 }
      )
    }

    await prisma.processo.update({
      where: { id: Number(id) },
      data: {
        active: false,
        exclusionDate: new Date(),
      },
    })

    return {
      response: Response.json(
        { message: "Processo excluído com sucesso" },
        { status: 200 }
      ),
      audit: {
        antes: processo,
        depois: { ...processo, active: false, exclusionDate: new Date() },
      },
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.DELETE,
    permissao: "Desabilitar_Processo",
  }
)

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerDELETE(req, { params: await context.params })
}

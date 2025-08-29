import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"

// === GET ===
/**
 * Recupera um processo por id (param path `id`).
 *
 * Parâmetros:
 * - id: identificador numérico do processo (string no path, convertido internamente)
 *
 * Respostas:
 * - 200: objeto processo
 * - 404: { error: 'Processo não encontrado' }
 *
 * Exemplo:
 * GET /api/processos/123
 */
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
/**
 * Atualiza parcial/totalmente um processo por id.
 *
 * O corpo deve conter os campos que serão atualizados. Campos de data aceitam string ISO.
 * Retorna 200 com o processo atualizado ou 404 se não encontrado.
 */
const handlerPUT = withApiForId<{ id: string }>(
  async ({ params, req }) => {
    const { id } = params
    const body = await req.json()

    const processoAtual = await prisma.processo.findUnique({
      where: { id: Number(id) },
    })

    if (!processoAtual?.active) {
      return Response.json(
        { error: "Processo não encontrado ou inativo" },
        { status: 404 }
      )
    }

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
      const valorNovo = body[campo]
      const valorAntigo = processoAtual[campo as keyof typeof processoAtual]

      if (campo === "dataConclusao" || campo === "dataEnvioPedido") {
        const dataNova = valorNovo ? new Date(valorNovo as string).getTime() : null

        const dataAntiga = valorAntigo ? new Date(valorAntigo as Date).getTime() : null

        return dataNova !== dataAntiga
      }

      if (Array.isArray(valorNovo) && Array.isArray(valorAntigo)) {
        const novoSorted = [...valorNovo].map(String).sort((a, b) => a.localeCompare(b))
        const antigoSorted = [...valorAntigo]
          .map(String)
          .sort((a, b) => a.localeCompare(b))
        return JSON.stringify(novoSorted) !== JSON.stringify(antigoSorted)
      }

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
        dataConclusao: body.dataConclusao ? new Date(body.dataConclusao) : null,
        dataEnvioPedido: body.dataEnvioPedido ? new Date(body.dataEnvioPedido) : null,
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
/**
 * Remove (marca como inactive) um processo por id.
 *
 * Retorna 200 em sucesso, 404 se não encontrado/inativo.
 */
const handlerDELETE = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params

    const processo = await prisma.processo.findUnique({
      where: { id: Number(id) },
    })

    if (!processo?.active) {
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

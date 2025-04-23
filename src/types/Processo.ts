import type { ProcessoInput, ProcessoOutput } from "@anpd/shared-types"

export function toProcessoInput(processo: ProcessoOutput): ProcessoInput {
  return {
    numero: processo.numero,
    dataCriacao:
      typeof processo.dataCriacao === "string"
        ? processo.dataCriacao
        : processo.dataCriacao.toISOString(),

    requerente: processo.requerente ?? "",

    formaEntradaId:
      processo.formaEntrada?.id != null ? Number(processo.formaEntrada.id) : undefined,
    responsavelId: Number(processo.responsavel?.id ?? 0),
    situacaoId: processo.situacao?.id != null ? Number(processo.situacao.id) : undefined,
    encaminhamentoId:
      processo.encaminhamento?.id != null
        ? Number(processo.encaminhamento.id)
        : undefined,
    pedidoManifestacaoId:
      processo.pedidoManifestacao?.id != null
        ? Number(processo.pedidoManifestacao.id)
        : undefined,
    contatoPrevioId:
      processo.contatoPrevio?.id != null ? Number(processo.contatoPrevio.id) : undefined,
    evidenciaId:
      processo.evidencia?.id != null ? Number(processo.evidencia.id) : undefined,
    tipoReclamacaoId:
      processo.tipoReclamacao?.id != null
        ? Number(processo.tipoReclamacao.id)
        : undefined,
    requeridoId:
      processo.requerido?.id != null ? Number(processo.requerido.id) : undefined,

    anonimo: processo.anonimo ?? false,
    observacoes: processo.observacoes ?? "",

    temaRequerimento: processo.temaRequerimento ?? [],
    tipoRequerimento: processo.tipoRequerimento ?? undefined,
    resumo: processo.resumo ?? "",
    dataEnvioPedido:
      typeof processo.dataEnvioPedido === "string"
        ? (processo.dataEnvioPedido as string).split("T")[0]
        : undefined,

    dataConclusao:
      typeof processo.dataConclusao === "string"
        ? (processo.dataConclusao as string).split("T")[0]
        : undefined,

    prazoPedido: processo.prazoPedido ?? undefined,
    requeridoFinalId:
      processo.requeridoFinal?.id != null
        ? Number(processo.requeridoFinal.id)
        : undefined,
  }
}

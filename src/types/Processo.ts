import type { ProcessoOutput, StatusInterno } from "@anpdgovbr/shared-types"

import type { ProcessoFormData } from "@/schemas/ProcessoSchema"

export function toProcessoInput(
  processo: ProcessoOutput
): ProcessoFormData & { statusInterno?: StatusInterno | null } {
  return {
    numero: processo.numero,

    requerente: processo.requerente ?? "",

    formaEntradaId:
      processo.formaEntrada?.id != null ? Number(processo.formaEntrada.id) : null,
    responsavelId: Number(processo.responsavel?.id ?? 0),
    situacaoId: processo.situacao?.id != null ? Number(processo.situacao.id) : null,
    encaminhamentoId:
      processo.encaminhamento?.id != null ? Number(processo.encaminhamento.id) : null,
    pedidoManifestacaoId:
      processo.pedidoManifestacao?.id != null
        ? Number(processo.pedidoManifestacao.id)
        : null,
    contatoPrevioId:
      processo.contatoPrevio?.id != null ? Number(processo.contatoPrevio.id) : null,
    evidenciaId: processo.evidencia?.id != null ? Number(processo.evidencia.id) : null,
    tipoReclamacaoId:
      processo.tipoReclamacao?.id != null ? Number(processo.tipoReclamacao.id) : null,
    requeridoId: processo.requerido?.id != null ? Number(processo.requerido.id) : null,

    anonimo: processo.anonimo ?? false,
    observacoes: processo.observacoes ?? "",

    temaRequerimento: processo.temaRequerimento ?? [],
    tipoRequerimento: processo.tipoRequerimento ?? "",
    resumo: processo.resumo ?? "",
    dataEnvioPedido:
      typeof processo.dataEnvioPedido === "string"
        ? new Date(processo.dataEnvioPedido)
        : null,

    dataConclusao:
      typeof processo.dataConclusao === "string"
        ? new Date(processo.dataConclusao)
        : null,

    prazoPedido: processo.prazoPedido ?? null,
    requeridoFinalId:
      processo.requeridoFinal?.id != null ? Number(processo.requeridoFinal.id) : null,

    statusInterno: processo.statusInterno ?? null,
  }
}

export interface TemaCount {
  tema: string
  total: number
}

export interface IndicadoresProcesso {
  total: number
  atrasados: number
  noMes: number
  atribuidosAoUsuario: number
  porStatusInterno: Record<string, number>
  porTipoRequerimento: Record<string, number>
  topTemas: TemaCount[]
}

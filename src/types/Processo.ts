import type { ProcessoOutput, StatusInterno } from "@anpdgovbr/shared-types"

import type { ProcessoFormData } from "@/schemas/ProcessoSchema"

/**
 * Converte um objeto ProcessoOutput (do pacote shared-types) para o formato
 * usado pelo formulário de edição/criação (ProcessoFormData).
 *
 * Observações:
 * - Faz a conversão de campos opcionais para valores primitivos esperados pelo formulário
 *   (ex.: ids como number ou null).
 * - Converte strings de datas para objetos Date quando aplicável.
 * - Mantém `statusInterno` como opcional, podendo ser StatusInterno | null.
 *
 * @param processo - Objeto de origem contendo os dados do processo (ProcessoOutput)
 * @returns Um objeto compatível com ProcessoFormData acrescido de `statusInterno` opcional.
 */
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

/**
 * Representa uma contagem de ocorrências por tema.
 *
 * @property tema - Nome do tema
 * @property total - Quantidade total de ocorrências desse tema
 */
export interface TemaCount {
  tema: string
  total: number
}

/**
 * Estrutura de indicadores agregados relacionados a processos.
 *
 * Campos:
 * @param {number} total - total de processos.
 * @param {number} atrasados - quantidade de processos que estão atrasados.
 * @param {number} noMes - quantidade de processos registrados no mês corrente.
 * @param {number} atribuidosAoUsuario - total de processos atribuídos ao usuário atual.
 * @param {Record<string, number>} porStatusInterno - mapa com contagem por status interno (chave: status, valor: quantidade).
 * @param {Record<string, number>} porTipoRequerimento - mapa com contagem por tipo de requerimento.
 * @param {TemaCount[]} topTemas - lista dos principais temas (TemaCount) ordenados por ocorrência.
 */
export interface IndicadoresProcesso {
  total: number
  /**
   * Quantidade de processos que estão atrasados.
   */
  atrasados: number
  /**
   * Quantidade de processos registrados no mês corrente.
   */
  noMes: number
  atribuidosAoUsuario: number
  porStatusInterno: Record<string, number>
  porTipoRequerimento: Record<string, number>
  topTemas: TemaCount[]
}

import type { ProcessoOutput } from "@anpdgovbr/shared-types"

import type { ProcessoFormData } from "@/schemas/ProcessoForm.zod"

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
export function toProcessoInput(processo: ProcessoOutput): ProcessoFormData {
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
 * Cada instância indica quantas vezes um determinado tema foi registrado
 * nos processos, usado em agregações e relatórios.
 */
export interface TemaCount {
  /** Nome do tema. Ex.: "Transporte", "Saúde" */
  tema: string
  /** Quantidade total de ocorrências desse tema. Valor ≥ 0. */
  total: number
}

/**
 * Indicadores agregados relacionados a processos.
 *
 * Uso: representação compacta de métricas para dashboards e sumários.
 * Não pressupõe a origem (pode ser resultado de consulta ao banco ou cálculo em memória).
 */
export interface IndicadoresProcesso {
  /** Total de processos considerados no conjunto (inteiro não-negativo). */
  total: number

  /** Quantidade de processos que estão atrasados (inteiro não-negativo). */
  atrasados: number

  /** Quantidade de processos registrados no mês corrente (inteiro não-negativo). */
  noMes: number

  /** Total de processos atribuídos ao usuário atual (inteiro não-negativo). */
  atribuidosAoUsuario: number

  /**
   * Mapa com contagem por status interno.
   * - Chave: nome do status interno (string).
   * - Valor: quantidade de processos naquele status (number, inteiro).
   *
   * Ex.: { "EmAndamento": 10, "Concluido": 5 }
   */
  porStatusInterno: Record<string, number>

  /**
   * Mapa com contagem por tipo de requerimento.
   * - Chave: tipo de requerimento (string).
   * - Valor: quantidade de ocorrências (number, inteiro).
   *
   * Ex.: { "Recurso": 3, "Reclamação": 7 }
   */
  porTipoRequerimento: Record<string, number>

  /** Lista dos principais temas ordenados por ocorrência (do maior para o menor). */
  topTemas: TemaCount[]
}

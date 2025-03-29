import { EnumData } from "./EnumData"
import { RequeridoOutput } from "./Requerido"
import { Responsavel } from "./Responsavel"

export interface ProcessoInput {
  numero: string
  dataCriacao: string // Mantemos como string para receber no formato correto (ISO 8601)
  requerente?: string
  formaEntradaId?: number
  responsavelId: number
  requeridoId?: number
  situacaoId?: number
  pedidoManifestacaoId?: number
  contatoPrevioId?: number
  evidenciaId?: number
  anonimo?: boolean
  observacoes?: string
  tipoReclamacaoId?: number
  encaminhamentoId?: number
}

export interface ProcessoOutput {
  id: number
  numero: string
  dataCriacao: Date
  requerente?: string
  formaEntrada?: EnumData
  responsavel: Responsavel
  requerido?: RequeridoOutput
  situacao?: EnumData
  encaminhamento?: EnumData
  pedidoManifestacao?: EnumData
  contatoPrevio?: EnumData
  evidencia?: EnumData
  anonimo?: boolean
  observacoes?: string
  tipoReclamacao?: EnumData
}

export interface ProcessoImportacao {
  responsavelNome: string
  numeroProcesso: string
  dataCriacao: string
  situacaoNome: string
  formaEntradaNome: string
  anonimoStr: string
  requerenteNome: string | null
}

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
  }
}

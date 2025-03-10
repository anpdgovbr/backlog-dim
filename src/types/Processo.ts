import { EnumData } from "./EnumData"
import { RequeridoOutput } from "./Requerido"

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
}

export interface ProcessoOutput {
  id: number
  numero: string
  dataCriacao: Date
  requerente?: string
  formaEntrada?: EnumData
  responsavel: EnumData
  requerido?: RequeridoOutput
  situacao?: EnumData
  encaminhamento?: EnumData
  pedidoManifestacao?: EnumData
  contatoPrevio?: EnumData
  evidencia?: EnumData
  anonimo?: boolean
  observacoes?: string
}

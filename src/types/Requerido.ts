import type { CnaeDto, EnumData, TipoControlador } from "@anpd/shared-types"

export interface RequeridoInput {
  nome: string
  cnpj: string
  cnaeId?: number
  site?: string
  email?: string
  setorId?: number | string
  tipo: TipoControlador
}

export interface RequeridoOutput {
  id: number
  nome: string
  cnpj?: string
  cnae?: CnaeDto
  site?: string
  email?: string
  setor?: EnumData
  tipo: TipoControlador
}

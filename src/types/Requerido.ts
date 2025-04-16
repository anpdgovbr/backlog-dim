import { CnaeDto, EnumData } from "@anpd/shared-types"

export interface RequeridoInput {
  nome: string
  cnpj: string
  cnaeId?: number
  site?: string
  email?: string
  setorId?: number | string
}

export interface RequeridoOutput {
  id: number
  nome: string
  cnpj: string
  cnae?: CnaeDto
  site?: string
  email?: string
  setor?: EnumData
}

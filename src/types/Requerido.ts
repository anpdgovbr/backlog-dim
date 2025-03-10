import { CNAE } from "./CNAE"
import { EnumData } from "./EnumData"

export interface RequeridoInput {
  nome: string
  cnpj: string
  cnaeId?: number
  site?: string
  email?: string
  setorId?: number
}

export interface RequeridoOutput {
  id: number
  nome: string
  cnpj: string
  cnae?: CNAE
  site?: string
  email?: string
  setor?: EnumData
}

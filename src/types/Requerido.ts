import { EnumData } from './EnumData'

export interface RequeridoInput {
  nome: string
  cnpj?: string
  cnae?: string
  site?: string
  email?: string
  setorId?: number
}

export interface RequeridoOutput {
  id: number
  nome: string
  cnpj?: string
  cnae?: string
  site?: string
  email?: string
  setor?: EnumData
}

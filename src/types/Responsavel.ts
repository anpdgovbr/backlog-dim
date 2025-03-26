export type Responsavel = {
  id: number
  nome: string
  userId: string
}
export type ResponsavelComUser = {
  id: number
  nome: string
  user?: {
    email?: string
  }
}

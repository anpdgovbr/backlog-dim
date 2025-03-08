export interface Permissao {
  id: number
  acao: string
  recurso: string
  permitido: boolean
  perfilId?: number
}

export interface User {
  id: string
  email: string
  perfilId?: number
  nome?: string
  image?: string
  acessToken?: string
  responsavelId?: number | null
}

export interface UsuarioComResponsavel extends User {
  responsavelNome: string | null
}

export interface Permissao {
  id: number
  acao: string
  recurso: string
  permitido: boolean
  perfilId?: number
}

export interface PermissaoPayload {
  perfilId: number
  acao: AcaoPermissao
  recurso: RecursoPermissao
  permitido: boolean
}

export type AcaoPermissao =
  | "Exibir"
  | "VerHistorico"
  | "EditarProprio"
  | "EditarGeral"
  | "Alterar"
  | "Cadastrar"
  | "Editar"
  | "Desabilitar"
  | "Criar"

export type RecursoPermissao =
  | "Processo"
  | "Responsavel"
  | "Metadados"
  | "Relatorios"
  | "Permissoes"
  | "Usuario"

export type PermissaoConcedida = `${AcaoPermissao}_${RecursoPermissao}`

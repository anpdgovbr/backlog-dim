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
  | "AlterarResponsavel"
  | "Cadastrar"
  | "Editar"
  | "Desabilitar"
  | "Criar"
  | "Gerenciar"

export type RecursoPermissao =
  | "Processo"
  | "Responsavel"
  | "Metadados"
  | "Relatorios"
  | "Permissoes"

export type PermissaoConcedida = `${AcaoPermissao}_${RecursoPermissao}`

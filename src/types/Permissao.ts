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
  | "Inserir"
  | "VerHistorico"
  | "EditarProprio"
  | "EditarGeral"
  | "Excluir"
  | "AlterarResponsavel"
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

export type PermissaoConcedida = `${AcaoPermissao}_${RecursoPermissao}`

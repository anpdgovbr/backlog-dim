/**
 * TopResponsavel
 *
 * Representa um responsável que aparece no ranking/top de responsáveis,
 * com contagem de processos associados.
 *
 * Uso típico: exibição em dashboards ou relatórios que listam os principais
 * responsáveis por número de processos.
 */
export interface TopResponsavel {
  /**
   * Identificador único do responsável.
   *
   * Geralmente corresponde ao id da tabela/entidade no banco de dados.
   */
  id: number

  /**
   * Nome completo ou razão social do responsável.
   */
  nome: string

  /**
   * Identificador do usuário (userId) associado ao responsável.
   *
   * Pode ser null quando não houver vínculo com um usuário do sistema.
   */
  userId: string | null

  /**
   * Total de processos atribuídos a este responsável.
   *
   * Valor inteiro não-negativo representando a contagem agregada.
   */
  totalProcessos: number
}

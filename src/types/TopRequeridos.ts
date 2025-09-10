/**
 * Representa um resumo dos principais "requeridos" (entidades controladoras)
 * ordenados por quantidade de processos associados.
 *
 * Usado em relatórios e dashboards que exibem os maiores responsáveis por
 * volume de processos no sistema.
 */
export interface TopRequerido {
  /**
   * Identificador único do requerido (normalmente correspondente à PK no banco).
   *
   * Valor esperado: inteiro positivo.
   */
  id: number

  /**
   * Nome do requerido (razão social ou nome fantasia conforme disponível).
   *
   * Ex.: "Empresa XYZ Ltda."
   */
  nome: string

  /**
   * CNPJ do requerido no formato sem máscara ou com máscara, conforme convenção
   * do projeto. Deve ser tratado como string para preservar zeros à esquerda.
   *
   * Ex.: "12345678000190" ou "12.345.678/0001-90"
   */
  cnpj: string

  /**
   * Total de processos (inteiro não-negativo) associados a este requerido.
   *
   * Usado para ordenação e métricas agregadas.
   */
  totalProcessos: number
}

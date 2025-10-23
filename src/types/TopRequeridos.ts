/**
 * Representa um resumo dos principais "requeridos" (entidades controladoras)
 * ordenados por quantidade de processos associados.
 *
 * Usado em relatórios e dashboards que exibem os maiores responsáveis por
 * volume de processos no sistema.
 */
export interface TopRequerido {
  /** Identificador único do requerido (UUID v4). */
  id: string
  /** Razão social. */
  nomeEmpresarial?: string
  /** Nome fantasia. */
  nomeFantasia?: string
  /** Documento, conforme disponível. */
  cnpj?: string
  cpf?: string
  /** Total de processos associados. */
  totalProcessos: number
}

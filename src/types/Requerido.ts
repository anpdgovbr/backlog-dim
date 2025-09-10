import type { CnaeDto, ControladorDto, EnumData } from "@anpdgovbr/shared-types"

/**
 * RequeridoOutput
 *
 * DTO de saída que representa um "Requerido" (entidade controladora).
 *
 * @remarks
 * Estende ControladorDto do pacote @anpdgovbr/shared-types adicionando
 * campos opcionais usados no domínio da aplicação (por exemplo, dados de CNAE
 * e setor de atividade). Este tipo é usado em respostas de API e em mapeamentos
 * internos onde se deseja enriquecer o controlador com metadados adicionais.
 *
 * @public
 * @example
 * const req: RequeridoOutput = {
 *   id: 1,
 *   nome: "Empresa X",
 *   cnae: { codigo: "12.34-5", descricao: "Exemplo" },
 *   setor: { key: "saude", label: "Saúde" },
 *   // ...campos de ControladorDto...
 * }
 */
export interface RequeridoOutput extends ControladorDto {
  /**
   * Dados do CNAE associados ao requerido.
   *
   * @remarks
   * Pode ser undefined quando a informação não estiver disponível no momento
   * da construção do DTO (por exemplo, quando a busca do CNAE for opcional).
   *
   * @since 1.0.0
   */
  cnae?: CnaeDto

  /**
   * Setor de atividade do requerido representado como EnumData.
   *
   * @remarks
   * Utilizar quando houver uma classificação do setor disponível. Pode ser
   * undefined quando o setor não estiver definido ou não for aplicável.
   *
   * @since 1.0.0
   */
  setor?: EnumData
}

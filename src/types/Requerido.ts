import type { CnaeDto, ControladorDto, EnumData } from "@anpdgovbr/shared-types"

/**
 * DTO de saída para um "Requerido" (controlador).
 *
 * Estende ControladorDto com campos opcionais específicos do domínio.
 * Utilizado em respostas de API e mapeamentos internos onde se precisa
 * enriquecer os dados do controlador com informações adicionais.
 */
export interface RequeridoOutput extends ControladorDto {
  /**
   * Dados do CNAE associados ao requerido.
   * Pode ser undefined quando a informação não estiver disponível.
   */
  cnae?: CnaeDto

  /**
   * Setor de atividade do requerido representado como EnumData.
   * Pode ser undefined quando o setor não estiver definido.
   */
  setor?: EnumData
}

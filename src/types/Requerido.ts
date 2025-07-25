import type { CnaeDto, ControladorDto, EnumData } from "@anpdgovbr/shared-types"

export interface RequeridoOutput extends ControladorDto {
  cnae?: CnaeDto
  setor?: EnumData
}

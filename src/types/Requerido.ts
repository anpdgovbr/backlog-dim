import type { CnaeDto, ControladorDto, EnumData } from "@anpd/shared-types"

export interface RequeridoOutput extends ControladorDto {
  cnae?: CnaeDto
  setor?: EnumData
}

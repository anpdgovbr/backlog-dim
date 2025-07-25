import type { UserDto } from "@anpdgovbr/shared-types"

export interface UsuarioComResponsavel extends UserDto {
  responsavelNome: string | null
}

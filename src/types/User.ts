import { UserDto } from "@anpd/shared-types"

export interface UsuarioComResponsavel extends UserDto {
  responsavelNome: string | null
}

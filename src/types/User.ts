/**
 * Tipos relacionados a usuários usados pela aplicação.
 *
 * Contém derivações de UserDto do pacote compartilhado com campos
 * adicionais específicos do domínio (por exemplo, nome do responsável).
 */

import type { UserDto } from "@anpdgovbr/shared-types"

/**
 * Usuário enriquecido com o nome do responsável.
 *
 * Extende UserDto preservando todos os campos originais e adiciona:
 * - responsavelNome: string | null — nome do responsável associado ao usuário,
 *   quando aplicável; pode ser null quando não houver responsável ou a
 *   informação não estiver disponível.
 *
 * Uso:
 * - Utilizado em APIs e camadas de apresentação quando é conveniente expor
 *   diretamente o nome do responsável junto dos dados do usuário, evitando
 *   chamadas adicionais para resolver esse nome.
 *
 * Exemplo:
 * const usuario: UsuarioComResponsavel = {
 *   id: 1,
 *   nome: "Fulano",
 *   // ...outros campos de UserDto...
 *   responsavelNome: "Ciclano"
 * }
 */
export interface UsuarioComResponsavel extends UserDto {
  responsavelNome: string | null
}

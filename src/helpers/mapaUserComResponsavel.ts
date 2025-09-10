/**
 * Utilities para mapear usuários juntamente com seus responsáveis.
 *
 * Este módulo expõe funções que consultam o banco via Prisma e constroem
 * uma visão agregada de usuários junto com os responsáveis associados.
 *
 * Observações:
 * - As consultas usam o cliente Prisma importado de "@/lib/prisma".
 * - Campos de responsável podem ser nulos quando não houver vínculo.
 */
import { prisma } from "@/lib/prisma"
import type { UsuarioComResponsavel } from "@/types/User"

/**
 * Recupera todos os usuários e anexa informações do responsável quando existir.
 *
 * Fluxo:
 * 1. Busca todos os usuários (`prisma.user.findMany`).
 * 2. Busca todos os registros de `responsavel` que possuam `userId` associado.
 * 3. Constrói um mapa de userId -> { id, nome } para acesso rápido.
 * 4. Para cada usuário, retorna um objeto que combina os dados do usuário
 *    com os dados do responsável (ou null quando ausente).
 *
 * Retorno:
 * - Promise<UsuarioComResponsavel[]>
 *   Cada item contém:
 *     - id, nome, email, perfilId (do usuário)
 *     - responsavelId: number | null
 *     - responsavelNome: string | null
 *
 * Observações de implementação:
 * - A função assume o contrato do tipo UsuarioComResponsavel definido em "@/types/User".
 * - Não lança exceções explicitamente; erros do Prisma serão repassados ao chamador.
 *
 * Exemplo de uso:
 * const lista = await mapearUsuariosComResponsaveis()
 */
export async function mapearUsuariosComResponsaveis() {
  const usuarios = await prisma.user.findMany()

  const responsaveis = await prisma.responsavel.findMany({
    where: { userId: { not: null } },
    select: { id: true, nome: true, userId: true },
  })

  const mapaResponsaveis = Object.fromEntries(
    responsaveis.map((r) => [r.userId!, { id: r.id, nome: r.nome }])
  )

  return usuarios.map((u) => {
    const responsavel = mapaResponsaveis[u.id]

    return {
      id: u.id,
      nome: u.nome,
      email: u.email,
      perfilId: u.perfilId,
      responsavelId: responsavel?.id ?? null,
      responsavelNome: responsavel?.nome ?? null,
    } as UsuarioComResponsavel
  })
}

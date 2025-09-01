// src/app/api/usuarios/route.ts
import { mapearUsuariosComResponsaveis } from "@/helpers/mapaUserComResponsavel"
import { withApi } from "@/lib/withApi"

/**
 * Lista usuários mapeados com seus responsáveis.
 *
 * @see {@link withApiSlimNoParams}
 * @returns JSON com lista reduzida de usuários e seus responsáveis.
 * @example GET /api/usuarios
 * @remarks Permissão {acao: "Exibir", recurso: "Usuario"}.
 */
/**
 * Migrado para `withApi` (antes `withApiSlimNoParams`).
 */
export const GET = withApi(
  async ({ req: _req }) => {
    const result = await mapearUsuariosComResponsaveis()

    return Response.json(result)
  },
  { permissao: { acao: "Exibir", recurso: "Usuario" } }
)

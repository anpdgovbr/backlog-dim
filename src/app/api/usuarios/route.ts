// src/app/api/usuarios/route.ts
import { mapearUsuariosComResponsaveis } from "@/helpers/mapaUserComResponsavel"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Lista usuários mapeados com seus responsáveis.
 *
 * @see {@link withApiSlimNoParams}
 * @returns JSON com lista reduzida de usuários e seus responsáveis.
 * @example GET /api/usuarios
 * @remarks Permissão {acao: "Exibir", recurso: "Usuario"}.
 */
export const GET = withApiSlimNoParams(
  async ({ req: _req }) => {
    const result = await mapearUsuariosComResponsaveis()

    return Response.json(result)
  },
  { acao: "Exibir", recurso: "Usuario" }
)

// src/app/api/usuarios/route.ts
import { mapearUsuariosComResponsaveis } from "@/helpers/mapaUserComResponsavel"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Lista usuários mapeados com seus responsáveis.
 * Retorna um array com informações reduzidas adequadas para o frontend.
 */
export const GET = withApiSlimNoParams(async ({ req: _req }) => {
  const result = await mapearUsuariosComResponsaveis()

  return Response.json(result)
}, "Exibir_Usuario")

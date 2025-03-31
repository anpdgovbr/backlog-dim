// src/app/api/usuarios/route.ts
import { mapearUsuariosComResponsaveis } from "@/lib/helpers/mapaUserComResponsavel"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = withApiSlimNoParams(async ({ req: _req }) => {
  const result = await mapearUsuariosComResponsaveis()

  return Response.json(result)
}, "Exibir_Usuario")

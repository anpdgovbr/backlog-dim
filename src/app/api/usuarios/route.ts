// src/app/api/usuarios/route.ts
import { mapearUsuariosComResponsaveis } from "@/helpers/mapaUserComResponsavel"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * Handler GET para /api/usuarios
 *
 * Recupera a lista de usuários com seus responsáveis usando o helper `mapearUsuariosComResponsaveis`
 * e retorna o resultado em formato JSON.
 *
 * Observações:
 * - O handler é envolvido por `withApiSlimNoParams`, que aplica validações/autorizações
 *   conforme a implementação do wrapper do projeto.
 * - Não consome corpo de requisição (não espera JSON no body).
 *
 * @returns {Response} Response JSON contendo um array de objetos com os usuários mapeados.
 *                     Normalmente retorna status 200 com o payload; erros são tratados
 *                     pelo wrapper ou pela infra do Next.js/Edge runtime.
 */
export const GET = withApiSlimNoParams(async ({ req: _req }) => {
  const result = await mapearUsuariosComResponsaveis()

  return Response.json(result)
}, "Exibir_Usuario")

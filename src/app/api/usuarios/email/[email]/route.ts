/**
 * API: /api/usuarios/email/[email]
 *
 * Fornece endpoint GET para buscar um usuário pelo email.
 * - Retorna 200 com { id, email } quando o usuário é encontrado.
 * - Retorna 404 quando não há usuário com o email informado.
 *
 * Observações:
 * - Usa prisma para consulta ao banco de dados.
 * - Usa o wrapper `withApiSlim` para aplicar validações/autenticação conforme implementado no projeto.
 */
import { prisma } from "@/lib/prisma"
import { withApiSlim } from "@/lib/withApiSlim"

/**
 * Handler interno que executa a lógica de busca de usuário por email.
 *
 * @remarks
 * Este handler é criado via `withApiSlim` e retorna um objeto Response.
 *
 * @param params.email - Email do usuário a ser buscado.
 * @returns Response contendo o usuário (id e email) ou um erro 404 quando não encontrado.
 */
const handlerGET = withApiSlim<{ email: string }>(async ({ params }) => {
  const { email } = params

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  })

  if (!user) {
    return Response.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  return Response.json(user)
}, undefined)

/**
 * Função exportada esperada pelo Next.js App Router para o método GET.
 *
 * @param req - Objeto Request recebido pelo Next.js.
 * @param context.params - Promise que resolve para { email: string } (parâmetro de rota).
 * @returns Response delegada a `handlerGET`.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ email: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

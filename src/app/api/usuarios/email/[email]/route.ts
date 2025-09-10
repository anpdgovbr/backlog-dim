// app/api/usuarios/email/[email]/route.ts
import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"

/**
 * Rota: GET /api/usuarios/email/{email}
 *
 * Este módulo expõe um handler para recuperar um usuário pelo email.
 * O handler é envolvido por `withApiForId` para aplicar validações/autenticação
 * padronizadas do projeto.
 *
 * Respostas:
 * - 200: objeto { id, email } quando o usuário é encontrado.
 * - 404: { error: "Usuário não encontrado" } quando não há usuário com o email fornecido.
 *
 * Observações:
 * - Não retorna dados sensíveis além do id e email.
 * - O parâmetro `email` é obtido a partir dos params de rota.
 */

/**
 * Handler que busca um usuário pelo email.
 *
 * @remarks
 * - Recebe `params` contendo `{ email: string }`.
 * - Utiliza Prisma (`prisma.user.findUnique`) para localizar o usuário.
 * - Retorna Response JSON com o usuário (id, email) ou erro 404 quando não encontrado.
 *
 * @param context.params.email - Email do usuário a ser buscado.
 * @returns Promise<Response> - Response JSON com o usuário ou mensagem de erro.
 */
const handlerGET = withApiForId<{ email: string }>(async ({ params }) => {
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
 * Adaptador do App Router para o método GET desta rota dinâmica.
 *
 * @remarks
 * - Recebe a Request do Next.js e o contexto contendo `params` como Promise<{ email: string }>.
 * - Aguarda `context.params` e encaminha para `handlerGET`.
 *
 * @param req - Objeto Request recebido pela rota do App Router.
 * @param context.params - Promise que resolve para `{ email: string }`.
 * @returns Promise<Response> - Resposta retornada por `handlerGET`.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ email: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

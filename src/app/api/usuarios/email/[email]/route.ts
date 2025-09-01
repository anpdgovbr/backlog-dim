// app/api/usuarios/email/[email]/route.ts
import { prisma } from "@/lib/prisma"
import { withApiForId } from "@/lib/withApi"

/**
 * Migrado para `withApiForId` (antes `withApiSlim`).
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

export async function GET(
  req: Request,
  context: { params: Promise<{ email: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

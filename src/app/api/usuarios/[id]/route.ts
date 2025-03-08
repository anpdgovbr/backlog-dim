import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { perfilId } = await request.json()
  const { id } = await context.params

  await prisma.user.update({
    where: { id: id },
    data: { perfilId: Number(perfilId) }
  })

  return NextResponse.json({ success: true })
}

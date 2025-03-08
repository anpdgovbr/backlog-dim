import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { perfilId } = await req.json();

  await prisma.user.update({
    where: { id: params.id },
    data: { perfilId: Number(perfilId) },
  });

  return NextResponse.json({ success: true });
}

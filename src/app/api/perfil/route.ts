import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "E-mail é obrigatório" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { perfil: true },
  });

  if (!user || !user.perfil) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ id: user.perfil.id, nome: user.perfil.nome });
}

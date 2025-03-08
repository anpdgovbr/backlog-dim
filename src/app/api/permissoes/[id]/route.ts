import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

// @ts-ignore
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams // Modificação crucial aqui
) {
  try {
    const permissaoId = parseInt(params.id, 10);
    
    if (isNaN(permissaoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { permitido } = body;

    if (typeof permitido !== "boolean") {
      return NextResponse.json(
        { error: "Campo 'permitido' inválido" },
        { status: 400 }
      );
    }

    const permissaoAtualizada = await prisma.permissao.update({
      where: { id: permissaoId },
      data: { permitido },
    });

    return NextResponse.json(permissaoAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar permissão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
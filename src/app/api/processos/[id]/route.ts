import authOptions from "@/config/next-auth.config"
import { verificarPermissao } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  const email = session.user.email

  const temPermissao = await verificarPermissao(email, "Exibir", "Processo")
  if (!temPermissao) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  const { id } = await params

  try {
    const processo = await prisma.processo.findUnique({
      where: { id: Number(id) },
      include: {
        formaEntrada: true,
        responsavel: true,
        requerido: {
          include: { setor: true, cnae: true },
        },
        situacao: true,
        encaminhamento: true,
        pedidoManifestacao: true,
        contatoPrevio: true,
        evidencia: true,
      },
    })

    if (!processo) {
      return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    return NextResponse.json(processo)
  } catch (error) {
    console.error("Erro ao buscar processo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }

  const email = session.user.email

  const temPermissao = await verificarPermissao(email, "Editar Geral", "Processo") //@todo: ajustar permissão
  if (!temPermissao) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await req.json() // Recebe os dados do request
    console.log("🔄 Dados recebidos para atualização:", body)

    // Verifica se o processo existe
    const processoExiste = await prisma.processo.findUnique({
      where: { id: Number(id) },
    })

    if (!processoExiste) {
      return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    // Atualiza o processo no banco de dados
    const processoAtualizado = await prisma.processo.update({
      where: { id: Number(id) },
      data: {
        numero: body.numero,
        dataCriacao: body.dataCriacao ? new Date(body.dataCriacao) : undefined,
        requerente: body.requerente,
        formaEntradaId: body.formaEntradaId ?? null,
        responsavelId: body.responsavelId ?? null,
        requeridoId: body.requeridoId ?? null,
        situacaoId: body.situacaoId ?? null,
        encaminhamentoId: body.encaminhamentoId ?? null,
        pedidoManifestacaoId: body.pedidoManifestacaoId ?? null,
        contatoPrevioId: body.contatoPrevioId ?? null,
        evidenciaId: body.evidenciaId ?? null,
        anonimo: body.anonimo ?? false,
      },
    })

    console.log("✅ Processo atualizado com sucesso:", processoAtualizado)

    return NextResponse.json(processoAtualizado)
  } catch (error) {
    console.error("❌ Erro ao atualizar processo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

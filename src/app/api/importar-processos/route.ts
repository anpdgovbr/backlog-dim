import authOptions from "@/config/next-auth.config"
import { verificarPermissao } from "@/lib/permissoes"
import { prisma } from "@/lib/prisma"
import { ProcessoImportacao } from "@/types/Processo"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

// 🔹 Tipagem dos dados esperados

// 🔹 Função para formatar a data corretamente
const formatarData = (data: string): string => {
  const [dia, mes, ano] = data.split("/")
  return ano ? `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}` : ""
}

// 🔹 API de Importação
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
  }
  const temPermissao = await verificarPermissao(
    session.user.email,
    "Cadastrar",
    "Processo"
  )
  if (!temPermissao) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }
  try {
    const { processos }: { processos: ProcessoImportacao[] } = await req.json()

    if (!Array.isArray(processos)) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 })
    }

    let sucesso = 0
    const falhas: string[] = []

    // 🔹 Transação Prisma garantindo reversibilidade total
    await prisma.$transaction(async (tx) => {
      for (const processo of processos) {
        try {
          const {
            responsavelNome,
            numeroProcesso,
            dataCriacao,
            situacaoNome,
            formaEntradaNome,
            anonimoStr,
            requerenteNome,
          } = processo

          if (!numeroProcesso) throw new Error("Número do processo ausente")

          const anonimo = anonimoStr.toLowerCase() === "sim"

          // 🔹 Buscar ou criar entidades auxiliares dentro da mesma transação
          const [responsavel, situacao, formaEntrada] = await Promise.all([
            tx.responsavel.upsert({
              where: { nome: responsavelNome },
              update: {},
              create: { nome: responsavelNome },
            }),
            tx.situacao.upsert({
              where: { nome: situacaoNome },
              update: {},
              create: { nome: situacaoNome },
            }),
            tx.formaEntrada.upsert({
              where: { nome: formaEntradaNome },
              update: {},
              create: { nome: formaEntradaNome },
            }),
          ])

          // 🔍 Verifica se o processo já existe
          const processoExistente = await tx.processo.findUnique({
            where: { numero: numeroProcesso },
          })

          if (processoExistente) {
            falhas.push(`Processo ${numeroProcesso} já existe e não foi importado.`)
            continue // Pula a inserção e vai para o próximo processo
          }

          // 🔹 Criar processo no Prisma dentro da transação
          await tx.processo.create({
            data: {
              numero: numeroProcesso,
              dataCriacao: new Date(formatarData(dataCriacao)),
              anonimo,
              requerente: anonimo ? numeroProcesso : requerenteNome?.trim() || "",
              responsavelId: responsavel.id,
              situacaoId: situacao.id,
              formaEntradaId: formaEntrada.id,
            },
          })

          sucesso++
        } catch (error) {
          const err = error as Error
          falhas.push(`Erro no processo ${processo.numeroProcesso}: ${err.message}`)
          throw error // 🔥 Faz rollback da transação ao encontrar erro
        }
      }
    })

    return NextResponse.json({ sucesso, falhas })
  } catch (error) {
    const err = error as Error
    console.error(err)
    return NextResponse.json(
      { error: "Erro interno no servidor", detalhe: err.message },
      { status: 500 }
    )
  }
}

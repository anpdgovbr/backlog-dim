import type { Prisma } from "@prisma/client"

import type { ProcessoImportacao } from "@anpdgovbr/shared-types"
import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { getOrRestoreByName } from "@/lib/prisma/getOrRestoreByName"
import { withApi } from "@/lib/withApi"

const formatarData = (data: string): string => {
  const [dia, mes, ano] = data.split("/")
  return ano ? `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}` : ""
}

export const POST = withApi(
  async ({ req }) => {
    try {
      const {
        processos,
        nomeArquivo,
      }: { processos: ProcessoImportacao[]; nomeArquivo?: string } = await req.json()

      if (!Array.isArray(processos)) {
        return Response.json({ error: "Formato inválido" }, { status: 400 })
      }

      const idsCriados: number[] = []
      const idsIgnorados: number[] = []
      const erros: { linha: number; mensagem: string }[] = []

      let sucesso = 0

      for (const [index, processo] of processos.entries()) {
        try {
          await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

            const [responsavel, situacao, formaEntrada] = await Promise.all([
              getOrRestoreByName(tx, "responsavel", responsavelNome),
              getOrRestoreByName(tx, "situacao", situacaoNome),
              getOrRestoreByName(tx, "formaEntrada", formaEntradaNome),
            ])

            const existente = await tx.processo.findFirst({
              where: { numero: numeroProcesso },
            })

            if (existente) {
              idsIgnorados.push(existente.id)
              throw new Error(`Processo ${numeroProcesso} já existe`)
            }

            const novo = await tx.processo.create({
              data: {
                numero: numeroProcesso,
                dataCriacao: new Date(formatarData(dataCriacao)),
                anonimo,
                requerente: anonimo ? numeroProcesso : requerenteNome?.trim() || "",
                responsavelId: responsavel.id,
                situacaoId: situacao.id,
                formaEntradaId: formaEntrada.id,
                statusInterno: processo.statusInterno ?? "IMPORTADO",
              },
            })

            idsCriados.push(novo.id)
            sucesso++
          })
        } catch (error) {
          const err = error as Error
          erros.push({ linha: index + 2, mensagem: err.message }) // +2 por causa do header + índice base 0
        }
      }

      const statusCode = erros.length > 0 ? 400 : 200
      return {
        response: Response.json(
          {
            sucesso,
            falhas: erros.map((e) => `Linha ${e.linha}: ${e.mensagem}`),
          },
          { status: statusCode }
        ),
        audit: {
          depois: {
            nomeArquivo: nomeArquivo ?? "desconhecido.csv",
            totalImportados: sucesso,
            totalFalhas: erros.length,
            idsCriados,
            idsIgnorados,
            erros,
          },
        },
      }
    } catch (error) {
      const err = error as Error
      console.error(err)
      return Response.json(
        { error: "Erro interno no servidor", detalhe: err.message },
        { status: 500 }
      )
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Processo",
  }
)

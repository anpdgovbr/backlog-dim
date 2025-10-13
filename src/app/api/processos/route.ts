import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { readJson, validateOrBadRequest } from "@/lib/validation"
import { processoCreateSchema } from "@/schemas/server/Processo.zod"

/**
 * Gera um número único de processo baseado no ano e mês atuais.
 *
 * O formato retornado é: PYYYYMM-NNNN
 * - P: prefixo fixo
 * - YYYY: ano com 4 dígitos
 * - MM: mês com 2 dígitos (01-12)
 * - NNNN: sequência do mês, com padding de 4 dígitos (0001, 0002, ...)
 *
 * Fluxo:
 * 1. Calcula o ano e mês atuais.
 * 2. Conta quantos processos já existem no intervalo do mês atual (usando prisma.processo.count).
 * 3. Retorna uma string composta pelo prefixo e a sequência incrementada.
 *
 * Observações e limitações:
 * - A sequência é derivada da contagem de registros no mês atual e, portanto, não é totalmente à prova de condições de corrida
 *   em cenários de alta concorrência. Para garantir unicidade em ambientes concorrentes, considere usar mecanismo de sequência
 *   do banco de dados ou uma transação/lock apropriado.
 * - O padrão oficial de numeração da organização ainda será incorporado aqui assim que definido. Até lá, não altere este
 *   comportamento sem alinhar com a equipe responsável e atualizar a documentação.
 *
 * @todo Integrar política de numeração oficial (sequence/lock ou serviço dedicado), quando definida pela organização.
 * @returns Promise<string> número do processo no formato "PYYYYMM-NNNN" (ex.: "P202504-0001").
 */
async function gerarNumeroProcesso(): Promise<string> {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, "0")

  const prefixo = `P${ano}${mes}` // Ex: P202504

  // Conta quantos processos já existem neste mês/ano
  const inicioMes = new Date(ano, agora.getMonth(), 1)
  const fimMes = new Date(ano, agora.getMonth() + 1, 0, 23, 59, 59, 999)

  const totalMes = await prisma.processo.count({
    where: {
      dataCriacao: {
        gte: inicioMes,
        lte: fimMes,
      },
    },
  })

  return `${prefixo}-${String(totalMes + 1).padStart(4, "0")}` // Ex: P202504-0001
}

/**
 * Cria um novo processo.
 *
 * @see {@link withApi}
 * @returns JSON com o processo criado (201) e auditoria de criação.
 * @example
 * POST /api/processos
 * { "requerente": "Empresa X", "formaEntradaId": 1, "responsavelId": 2 }
 * @remarks Auditoria ({@link AcaoAuditoria.CREATE}) e permissão {acao: "Cadastrar", recurso: "Processo"}.
 */
export const POST = withApi(
  /**
   * Cria um novo processo.
   *
   * Expectativa do corpo (JSON): um objeto com os campos do processo conforme o modelo Prisma.
   * - Campos de data aceitam string ISO ou null.
   *
   * Resposta: 201 com o processo recém-criado.
   * @example
   * POST /api/processos
   * {
   *   "requerente": "Empresa X",
   *   "formaEntradaId": 1,
   *   "responsavelId": 2
   * }
   *
   * @remarks
   * Este endpoint também grava entrada de auditoria via middleware `withApi`.
   */
  async ({ req }) => {
    const raw = await readJson(req)
    const valid = validateOrBadRequest(processoCreateSchema, raw, "POST /api/processos")
    if (!valid.ok) return valid.response

    const data = valid.data
    try {
      const numero = await gerarNumeroProcesso()

      const processo = await prisma.processo.create({
        data: {
          ...data,
          numero,
          dataCriacao: new Date(),
          anonimo: data.anonimo ?? false,
          temaRequerimento: Array.isArray(data.temaRequerimento)
            ? data.temaRequerimento
            : [],
        },
        include: {
          formaEntrada: true,
          responsavel: true,
          situacao: true,
          encaminhamento: true,
        },
      })

      return {
        response: Response.json(processo, { status: 201 }),
        audit: { depois: processo },
      }
    } catch (err) {
      console.error("Erro interno ao criar processo:", err)
      return Response.json({ error: "Erro interno no servidor" }, { status: 500 })
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.CREATE,
    permissao: { acao: "Cadastrar", recurso: "Processo" },
  }
)

/**
 * Lista processos com paginação, ordenação e busca.
 *
 * @see {@link withApi}
 * @returns JSON no formato { data: Processo[], total: number }.
 * @example GET /api/processos?page=1&pageSize=20&search=empresa
 * @remarks Permissão {acao: "Exibir", recurso: "Processo"}.
 */
export const GET = withApi(
  /**
   * Lista processos com paginação e busca simples.
   *
   * Query params suportados:
   * - page: número da página (default: 1)
   * - pageSize: itens por página (default: 10)
   * - orderBy: campo para ordenação (default: dataCriacao)
   * - ascending: 'true' para ascendente
   * - search: texto a buscar em requerente, número, responsável, situação
   * - responsavelUserId: filtrar por userId do responsável
   *
   * Retorna um objeto { data: Processo[], total: number }.
   * @example
   * GET /api/processos?page=1&pageSize=20&search=empresa
   */
  async ({ req }) => {
    const { searchParams } = new URL(req.url)
    // Normalização de paginação e ordenação
    const rawPage = Number(searchParams.get("page"))
    const rawPageSize = Number(searchParams.get("pageSize"))
    const rawOrderBy = searchParams.get("orderBy") || "dataCriacao"
    const ascending = searchParams.get("ascending") === "true"

    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1
    const PAGE_SIZE_DEFAULT = 10
    const PAGE_SIZE_MAX = 100
    const pageSize = Number.isFinite(rawPageSize)
      ? Math.min(Math.max(rawPageSize, 1), PAGE_SIZE_MAX)
      : PAGE_SIZE_DEFAULT

    // Whitelist de campos de ordenação válidos
    const ORDERABLE_FIELDS = new Set(["dataCriacao", "numero", "requerente"])
    const orderField = ORDERABLE_FIELDS.has(rawOrderBy) ? rawOrderBy : "dataCriacao"
    const search = searchParams.get("search")?.toLowerCase() || ""
    const responsavelUserId = searchParams.get("responsavelUserId")

    const skip = (page - 1) * pageSize
    const take = pageSize

    const baseWhere = {
      active: true,
      ...(responsavelUserId ? { responsavel: { userId: responsavelUserId } } : {}),
      ...(search
        ? {
            OR: [
              { requerente: { contains: search, mode: "insensitive" as const } },
              { numero: { contains: search } },
              {
                responsavel: {
                  nome: { contains: search, mode: "insensitive" as const },
                },
              },
              {
                situacao: {
                  nome: { contains: search, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {}),
    }

    const [total, processos] = await Promise.all([
      prisma.processo.count({ where: baseWhere }),
      prisma.processo.findMany({
        where: baseWhere,
        skip,
        take,
        orderBy: { [orderField]: ascending ? "asc" : "desc" },
        include: {
          formaEntrada: { select: { id: true, nome: true } },
          responsavel: { select: { id: true, nome: true, userId: true } },
          situacao: { select: { id: true, nome: true } },
          encaminhamento: { select: { id: true, nome: true } },
          tipoReclamacao: { select: { id: true, nome: true } },
        },
      }),
    ])

    return {
      response: Response.json({ data: processos, total }),
      audit: {
        depois: {
          page,
          search,
          totalResultados: total,
        },
      },
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.GET,
    permissao: { acao: "Exibir", recurso: "Processo" },
  }
)

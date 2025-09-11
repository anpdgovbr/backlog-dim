import type { StatusInterno as SharedStatusInterno } from "@anpdgovbr/shared-types"
import { AcaoAuditoria } from "@anpdgovbr/shared-types"
import { toPrismaStatus } from "@/lib/adapters/statusInterno"

import { prisma } from "@/lib/prisma"
import { verificarPermissao } from "@/lib/permissoes"
import { withApiForId } from "@/lib/withApi"
import { readJson, validateOrBadRequest } from "@/lib/validation"
import {
  processoUpdateSchema,
  type ProcessoUpdateInput,
} from "@/schemas/server/Processo.zod"

// -- Helpers de comparação e autorização (nível de módulo) ------------------
/**
 * Converte um valor (string | Date | null | undefined) para timestamp em milissegundos.
 * Retorna null quando o valor é nulo, indefinido ou não representa uma data válida.
 *
 * @param value - Valor a ser convertido em timestamp.
 * @returns timestamp em ms ou null se inválido.
 */
function toTime(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const d = new Date(value as string | Date)
  const t = Number(d.getTime())
  return Number.isNaN(t) ? null : t
}

/**
 * Compara dois arrays ignorando a ordem dos elementos.
 * A comparação é feita convertendo elementos para string e ordenando.
 *
 * @param a - Primeiro array.
 * @param b - Segundo array.
 * @returns true se os arrays tiverem os mesmos elementos (independentemente da ordem).
 */
function arraysEqual(a: unknown, b: unknown): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  const sortedA = [...a].map(String).sort((x, y) => x.localeCompare(y))
  const sortedB = [...b].map(String).sort((x, y) => x.localeCompare(y))
  return JSON.stringify(sortedA) === JSON.stringify(sortedB)
}

/**
 * Compara um campo específico entre o objeto enviado no body e o objeto do processo.
 * Trata campos de data (dataConclusao, dataEnvioPedido) e arrays de forma apropriada.
 *
 * @param bodyObj - Objeto recebido no body da requisição.
 * @param processoObj - Objeto do processo atual (do banco).
 * @param campo - Nome do campo a ser comparado.
 * @returns true se o campo for considerado diferente.
 */
function isFieldDifferent(
  bodyObj: Readonly<Record<string, unknown>>,
  processoObj: Readonly<Record<string, unknown>>,
  campo: string
): boolean {
  const novo = bodyObj[campo]
  const antigo = processoObj[campo]

  if (campo === "dataConclusao" || campo === "dataEnvioPedido") {
    return toTime(novo) !== toTime(antigo)
  }

  if (Array.isArray(novo) && Array.isArray(antigo)) {
    return !arraysEqual(novo, antigo)
  }

  return novo !== antigo
}

/**
 * Verifica se houve alteração em qualquer dos campos fornecidos comparando body com o processo.
 *
 * @param campos - Lista de nomes de campos a serem verificados.
 * @param bodyObj - Objeto recebido no body.
 * @param procObj - Objeto do processo atual.
 * @returns true se houver pelo menos uma alteração detectada.
 */
function detectarAlteracao(
  campos: readonly string[],
  bodyObj: Readonly<Record<string, unknown>>,
  procObj: Readonly<Record<string, unknown>>
): boolean {
  return campos.some((campo) => isFieldDifferent(bodyObj, procObj, campo))
}

/**
 * Autorização híbrida para editar um processo (RBAC + ABAC).
 * - Se o usuário possuir permissão "EditarGeral" retorna undefined (permitido).
 * - Senão, verifica permissão "EditarProprio" e se o processo pertence ao usuário.
 * - Caso contrário, retorna um Response com 403.
 *
 * @param emailArg - Email do usuário em sessão.
 * @param userIdArg - ID do usuário em sessão.
 * @param procAtual - Processo atual (contendo opcionalmente responsavel.userId).
 * @returns Promise que resolve para undefined quando autorizado ou um Response quando negado.
 */
async function authorizeEdit(
  emailArg: string,
  userIdArg: string,
  procAtual: { responsavel?: { userId?: string | null } | null }
): Promise<Response | undefined> {
  const podeEditarGeral = await verificarPermissao(emailArg, "EditarGeral", "Processo")
  if (podeEditarGeral) return undefined

  const podeEditarProprio = await verificarPermissao(
    emailArg,
    "EditarProprio",
    "Processo"
  )
  const ehProprio =
    procAtual.responsavel?.userId && userIdArg
      ? procAtual.responsavel.userId === userIdArg
      : false

  if (!(podeEditarProprio && ehProprio)) {
    return Response.json({ error: "Acesso negado" }, { status: 403 })
  }

  return undefined
}

/**
 * Campos que participam da detecção de alteração entre body e entidade.
 */
const CAMPOS_COMPARAVEIS: string[] = [
  "requerente",
  "formaEntradaId",
  "responsavelId",
  "requeridoId",
  "situacaoId",
  "encaminhamentoId",
  "pedidoManifestacaoId",
  "contatoPrevioId",
  "evidenciaId",
  "anonimo",
  "tipoReclamacaoId",
  "observacoes",
  "temaRequerimento",
  "tipoRequerimento",
  "resumo",
  "dataConclusao",
  "dataEnvioPedido",
  "prazoPedido",
  "requeridoFinalId",
]

/**
 * Constrói o objeto de dados para o update no Prisma a partir do body validado.
 * Campos com valor `undefined` serão omitidos pelo Prisma, já campos explicitamente
 * enviados como null serão aplicados conforme intenção do cliente.
 *
 * @param body - Body validado como ProcessoUpdateInput.
 * @param has - Função que indica se a chave foi enviada no body.
 * @param prazoPedidoValue - Valor calculado para prazoPedido (number | null | undefined).
 * @param dataCriacaoValue - Valor calculado para dataCriacao (Date | undefined).
 * @param novoStatusInterno - Novo statusInterno calculado, quando aplicável.
 * @returns Objeto pronto para ser utilizado no campo `data` do update do Prisma.
 */
function buildUpdateData(
  body: Readonly<ProcessoUpdateInput>,
  has: (k: string) => boolean,
  prazoPedidoValue: number | null | undefined,
  dataCriacaoValue: Date | undefined,
  novoStatusInterno: SharedStatusInterno | null | undefined
) {
  return {
    numero: has("numero") ? body.numero : undefined,
    dataCriacao: dataCriacaoValue,
    requerente: body.requerente,
    formaEntradaId: body.formaEntradaId ?? undefined,
    responsavelId: body.responsavelId ?? undefined,
    situacaoId: body.situacaoId ?? undefined,
    requeridoId: has("requeridoId") ? (body.requeridoId ?? null) : undefined,
    encaminhamentoId: has("encaminhamentoId")
      ? (body.encaminhamentoId ?? null)
      : undefined,
    pedidoManifestacaoId: has("pedidoManifestacaoId")
      ? (body.pedidoManifestacaoId ?? null)
      : undefined,
    contatoPrevioId: has("contatoPrevioId") ? (body.contatoPrevioId ?? null) : undefined,
    evidenciaId: has("evidenciaId") ? (body.evidenciaId ?? null) : undefined,
    anonimo: body.anonimo ?? false,
    tipoReclamacaoId: has("tipoReclamacaoId")
      ? (body.tipoReclamacaoId ?? null)
      : undefined,
    observacoes: body.observacoes,
    processoStatusId: has("processoStatusId")
      ? (body.processoStatusId ?? null)
      : undefined,
    resumo: body.resumo ?? null,
    dataConclusao: has("dataConclusao") ? (body.dataConclusao ?? null) : undefined,
    dataEnvioPedido: has("dataEnvioPedido") ? (body.dataEnvioPedido ?? null) : undefined,
    prazoPedido: prazoPedidoValue,
    temaRequerimento: Array.isArray(body.temaRequerimento) ? body.temaRequerimento : [],
    tipoRequerimento: has("tipoRequerimento")
      ? (body.tipoRequerimento ?? null)
      : undefined,
    requeridoFinalId: has("requeridoFinalId")
      ? (body.requeridoFinalId ?? null)
      : undefined,
    dataVencimento: has("dataVencimento") ? (body.dataVencimento ?? null) : undefined,
    statusInterno: toPrismaStatus(novoStatusInterno ?? undefined),
  }
}

/**
 * Calcula valores derivados do body (ex.: prazoPedido como number|null e dataCriacao como Date|undefined)
 * levando em conta se a propriedade foi enviada explicitamente.
 *
 * @param body - Body recebido da requisição.
 * @param has - Função que indica se a chave foi enviada no body.
 * @returns Objeto contendo prazoPedidoValue e dataCriacaoValue.
 */
function computeValues(
  body: Readonly<Record<string, unknown>>,
  has: (k: string) => boolean
) {
  let prazoPedidoValue: number | null | undefined
  if (has("prazoPedido")) {
    prazoPedidoValue = body.prazoPedido === null ? null : Number(body.prazoPedido)
  } else {
    prazoPedidoValue = undefined
  }

  let dataCriacaoValue: Date | undefined
  if (has("dataCriacao")) {
    dataCriacaoValue = body.dataCriacao
      ? new Date(body.dataCriacao as unknown as string)
      : undefined
  } else {
    dataCriacaoValue = undefined
  }

  return { prazoPedidoValue, dataCriacaoValue }
}

// === GET ===
/**
 * Recupera um processo por `id`.
 *
 * @see {@link withApiForId}
 * @returns JSON com o processo (200) ou erro 404.
 * @example GET /api/processos/123
 * @remarks Permissão {acao: "Exibir", recurso: "Processo"} e auditoria ({@link AcaoAuditoria.GET}).
 */
const handlerGET = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params

    const processo = await prisma.processo.findUnique({
      where: { id: Number(id) },
      include: {
        formaEntrada: true,
        responsavel: true,
        situacao: true,
        encaminhamento: true,
        pedidoManifestacao: true,
        contatoPrevio: true,
        evidencia: true,
        tipoReclamacao: true,
        processoStatus: true,
      },
    })

    if (!processo || !processo.active) {
      return Response.json({ error: "Processo não encontrado" }, { status: 404 })
    }

    return {
      response: Response.json(processo),
      audit: {
        depois: { id: processo.id },
      },
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.GET,
    permissao: { acao: "Exibir", recurso: "Processo" },
  }
)

/**
 * Handler Next.js de GET (resolve `context.params` e delega ao handler tipado).
 *
 * @param req - Requisição HTTP.
 * @param context - Contexto com `params` assíncrono.
 * @returns Resposta do handler GET.
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerGET(req, { params: await context.params })
}

// === PUT ===
/**
 * Atualiza parcial/totalmente um processo por `id`.
 *
 * @see {@link withApiForId}
 * @returns JSON com o processo atualizado (200) ou erro (404/400).
 * @example PUT /api/processos/123 { "requerente": "Empresa Y" }
 * @remarks
 * Auditoria ({@link AcaoAuditoria.UPDATE}). Autorização híbrida (RBAC + ABAC):
 * - Se o usuário possuir `{acao: "EditarGeral", recurso: "Processo"}`, pode editar qualquer registro.
 * - Caso contrário, se possuir `{acao: "EditarProprio", recurso: "Processo"}` e o processo pertencer a si
 *   (via `responsavel.userId === session.user.id`), pode editar apenas o próprio.
 * - Caso nenhum dos critérios seja satisfeito, retorna 403.
 * - Campos opcionais enviados explicitamente como `null` são limpos (setados para `null`).
 *   Quando omitidos do payload, não são alterados.
 * - Atualização de `numero` e `dataCriacao` está habilitada, mas poderá ser restringida no futuro
 *   para perfis específicos (regra a ser definida por RBAC/ABAC).
 */
const handlerPUT = withApiForId<{ id: string }>(
  async ({ params, req, email, userId }) => {
    const { id } = params
    // valida e parseia body
    const raw = await readJson(req)
    const parsed = validateOrBadRequest<ProcessoUpdateInput>(
      processoUpdateSchema,
      raw,
      `PUT /api/processos/${id}`
    )
    if (!parsed.ok) return parsed.response
    const body = parsed.data

    // Carrega processo atual com o vínculo do responsável (para ABAC)
    const processoAtual = await prisma.processo.findUnique({
      where: { id: Number(id) },
      include: { responsavel: { select: { userId: true } } },
    })

    if (!processoAtual?.active) {
      return Response.json(
        { error: "Processo não encontrado ou inativo" },
        { status: 404 }
      )
    }

    // autorização (RBAC + ABAC)
    const authEarly = await authorizeEdit(email ?? "", userId ?? "", processoAtual)
    if (authEarly) return authEarly

    // detectar alteração
    const houveAlteracao = detectarAlteracao(
      CAMPOS_COMPARAVEIS,
      body as Readonly<Record<string, unknown>>,
      processoAtual as Readonly<Record<string, unknown>>
    )

    // calcula novo status interno
    const novoStatusInterno: SharedStatusInterno | null =
      (processoAtual.statusInterno === ("IMPORTADO" as SharedStatusInterno) ||
        processoAtual.statusInterno === ("NOVO" as SharedStatusInterno)) &&
      houveAlteracao
        ? ("EM_PROCESSAMENTO" as SharedStatusInterno)
        : (processoAtual.statusInterno as SharedStatusInterno | null)

    const has = (k: string) => Object.hasOwn(body as object, k)
    const { prazoPedidoValue, dataCriacaoValue } = computeValues(
      body as Readonly<Record<string, unknown>>,
      has
    )
    const updateData = buildUpdateData(
      body as Readonly<Record<string, unknown>>,
      has,
      prazoPedidoValue,
      dataCriacaoValue,
      novoStatusInterno
    )

    const processoAtualizado = await prisma.processo.update({
      where: { id: Number(id) },
      data: updateData,
    })

    return {
      response: Response.json(processoAtualizado),
      audit: {
        antes: processoAtual,
        depois: processoAtualizado,
      },
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.UPDATE,
    // Permissão tratada dentro do handler (RBAC + ABAC)
  }
)

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerPUT(req, { params: await context.params })
}

// === DELETE ===
/**
 * Desativa (soft delete) um processo por `id`.
 *
 * @see {@link withApiForId}
 * @returns JSON com mensagem de sucesso (200) ou erro 404.
 * @example DELETE /api/processos/123
 * @remarks Auditoria ({@link AcaoAuditoria.DELETE}) e permissão {acao: "Desabilitar", recurso: "Processo"}.
 */
const handlerDELETE = withApiForId<{ id: string }>(
  async ({ params }) => {
    const { id } = params

    const processo = await prisma.processo.findUnique({
      where: { id: Number(id) },
    })

    if (!processo?.active) {
      return Response.json(
        { error: "Processo não encontrado ou já excluído" },
        { status: 404 }
      )
    }

    await prisma.processo.update({
      where: { id: Number(id) },
      data: {
        active: false,
        exclusionDate: new Date(),
      },
    })

    return {
      response: Response.json(
        { message: "Processo excluído com sucesso" },
        { status: 200 }
      ),
      audit: {
        antes: processo,
        depois: { ...processo, active: false, exclusionDate: new Date() },
      },
    }
  },
  {
    tabela: "processo",
    acao: AcaoAuditoria.DELETE,
    permissao: { acao: "Desabilitar", recurso: "Processo" },
  }
)

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  return handlerDELETE(req, { params: await context.params })
}

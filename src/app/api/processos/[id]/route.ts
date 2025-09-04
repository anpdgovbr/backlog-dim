import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { verificarPermissao } from "@/lib/permissoes"
import { withApiForId } from "@/lib/withApi"
import { readJson, validateOrBadRequest } from "@/lib/validation"
import {
  processoUpdateSchema,
  type ProcessoUpdateInput,
} from "@/schemas/server/Processo.zod"

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

    const processo = await prisma.processo.findFirst({
      where: { id: Number(id), active: true },
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

    if (!processo) {
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

    // Autorização RBAC + ABAC
    const podeEditarGeral = await verificarPermissao(email, "EditarGeral", "Processo")
    if (!podeEditarGeral) {
      const podeEditarProprio = await verificarPermissao(
        email,
        "EditarProprio",
        "Processo"
      )
      const ehProprio =
        processoAtual.responsavel?.userId && userId
          ? processoAtual.responsavel.userId === userId
          : false

      if (!(podeEditarProprio && ehProprio)) {
        return Response.json({ error: "Acesso negado" }, { status: 403 })
      }
    }

    const camposComparaveis: (keyof typeof body)[] = [
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

    const houveAlteracao = camposComparaveis.some((campo) => {
      const valorNovo = body[campo]
      const valorAntigo = processoAtual[campo as keyof typeof processoAtual]

      if (campo === "dataConclusao" || campo === "dataEnvioPedido") {
        const dataNova = valorNovo ? new Date(valorNovo as Date).getTime() : null

        const dataAntiga = valorAntigo ? new Date(valorAntigo as Date).getTime() : null

        return dataNova !== dataAntiga
      }

      if (Array.isArray(valorNovo) && Array.isArray(valorAntigo)) {
        const novoSorted = [...valorNovo].map(String).sort((a, b) => a.localeCompare(b))
        const antigoSorted = [...valorAntigo]
          .map(String)
          .sort((a, b) => a.localeCompare(b))
        return JSON.stringify(novoSorted) !== JSON.stringify(antigoSorted)
      }

      return valorNovo !== valorAntigo
    })

    const novoStatusInterno =
      (processoAtual.statusInterno === "IMPORTADO" ||
        processoAtual.statusInterno === "NOVO") &&
      houveAlteracao
        ? "EM_PROCESSAMENTO"
        : processoAtual.statusInterno

    // Observação importante sobre atualização de número e dataCriacao:
    // - Mantemos a possibilidade de alteração destes campos para futura regra de negócio.
    // - Futuro: considerar restringir quem pode atualizar via RBAC (e.g., perfis específicos).
    const has = (k: string) => Object.prototype.hasOwnProperty.call(body as object, k)

    const processoAtualizado = await prisma.processo.update({
      where: { id: Number(id) },
      data: {
        numero: has("numero") ? body.numero : undefined,
        dataCriacao: has("dataCriacao")
          ? body.dataCriacao
            ? new Date(body.dataCriacao as unknown as string)
            : undefined
          : undefined,
        requerente: body.requerente,
        formaEntradaId: body.formaEntradaId ?? undefined, // campo obrigatório no modelo (não permite null)
        responsavelId: body.responsavelId ?? undefined, // campo obrigatório no modelo (não permite null)
        situacaoId: body.situacaoId ?? undefined, // campo obrigatório no modelo (não permite null)
        requeridoId: has("requeridoId") ? (body.requeridoId ?? null) : undefined,
        encaminhamentoId: has("encaminhamentoId")
          ? (body.encaminhamentoId ?? null)
          : undefined,
        pedidoManifestacaoId: has("pedidoManifestacaoId")
          ? (body.pedidoManifestacaoId ?? null)
          : undefined,
        contatoPrevioId: has("contatoPrevioId")
          ? (body.contatoPrevioId ?? null)
          : undefined,
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
        dataEnvioPedido: has("dataEnvioPedido")
          ? (body.dataEnvioPedido ?? null)
          : undefined,
        prazoPedido: has("prazoPedido")
          ? body.prazoPedido === null
            ? null
            : Number(body.prazoPedido)
          : undefined,
        temaRequerimento: Array.isArray(body.temaRequerimento)
          ? body.temaRequerimento
          : [],
        tipoRequerimento: has("tipoRequerimento")
          ? (body.tipoRequerimento ?? null)
          : undefined,
        requeridoFinalId: has("requeridoFinalId")
          ? (body.requeridoFinalId ?? null)
          : undefined,
        dataVencimento: has("dataVencimento") ? (body.dataVencimento ?? null) : undefined,
        statusInterno: novoStatusInterno,
      },
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

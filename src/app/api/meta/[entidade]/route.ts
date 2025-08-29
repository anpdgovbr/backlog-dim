import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApiForId } from "@/lib/withApi"
import { withApiSlim } from "@/lib/withApiSlim"
import { validarEntidadeParams } from "@/utils/validarEntidadeParams"

/**
 * Lista metadados de uma entidade dinâmica (e.g., situacoes, encaminhamentos).
 *
 * @see {@link withApiSlim}
 * @returns JSON com `{ data, total }`.
 * @example GET /api/meta/situacoes?page=1&pageSize=10
 * @remarks Permissão {acao: "Exibir", recurso: "Metadados"}.
 */
const handlerGET = withApiSlim<{ entidade: string }>(
  async ({ req, params }) => {
    const validacao = validarEntidadeParams(params)
    if (!validacao.valid) return validacao.response

    const { model } = validacao
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page")) || 1
    const pageSize = Number(searchParams.get("pageSize")) || 10
    const orderBy = searchParams.get("orderBy") || "nome"
    const ascending = searchParams.get("ascending") === "true"

    const [total, data] = await Promise.all([
      model.count({ where: { active: true } }),
      model.findMany({
        where: { active: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [orderBy]: ascending ? "asc" : "desc" },
      }),
    ])

    return NextResponse.json({ data, total })
  },
  { acao: "Exibir", recurso: "Metadados" }
)

export async function GET(
  req: Request,
  context: { params: Promise<{ entidade: string }> }
) {
  return handlerGET(req, { params: await context.params })
}

// POST
/**
 * Cria um item de metadado para a entidade dinâmica.
 *
 * @see {@link withApiForId}
 * @returns JSON com o item criado (201).
 * @example POST /api/meta/situacoes { "nome": "Novo" }
 * @remarks Auditoria ({@link AcaoAuditoria.CREATE}) e permissão {acao: "Cadastrar", recurso: "Metadados"}.
 */
const handlerPOST = withApiForId<{ entidade: string }>(
  async ({ req, params }) => {
    const validacao = validarEntidadeParams(params)
    if (!validacao.valid) return validacao.response

    const { model } = validacao
    const { nome } = await req.json()
    if (!nome) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    const novo = await model.create({ data: { nome } })

    return {
      response: NextResponse.json(novo, { status: 201 }),
      audit: { depois: novo as object },
    }
  },
  {
    permissao: { acao: "Cadastrar", recurso: "Metadados" },
    acao: AcaoAuditoria.CREATE,
    tabela: (params) => params.entidade,
  }
)

export async function POST(
  req: Request,
  context: { params: Promise<{ entidade: string }> }
) {
  return handlerPOST(req, { params: await context.params })
}

// PUT
/**
 * Atualiza o nome de um metadado por `id` da entidade dinâmica.
 *
 * @see {@link withApiForId}
 * @returns JSON com o registro atualizado.
 * @example PUT /api/meta/situacoes { "id": 1, "nome": "Atualizado" }
 * @remarks Auditoria ({@link AcaoAuditoria.UPDATE}) e permissão {acao: "Editar", recurso: "Metadados"}.
 */
const handlerPUT = withApiForId<{ entidade: string }>(
  async ({ req, params }) => {
    const validacao = validarEntidadeParams(params)
    if (!validacao.valid) return validacao.response

    const { model } = validacao
    const { id, nome } = await req.json()
    if (!id || !nome) {
      return NextResponse.json({ error: "ID e Nome são obrigatórios" }, { status: 400 })
    }

    const antes = await model.findUnique({ where: { id } })
    const depois = await model.update({ where: { id }, data: { nome } })

    return {
      response: NextResponse.json(depois),
      audit: { antes: antes as object, depois: depois as object },
    }
  },
  {
    permissao: { acao: "Editar", recurso: "Metadados" },
    acao: AcaoAuditoria.UPDATE,
    tabela: (params) => params.entidade,
  }
)

export async function PUT(
  req: Request,
  context: { params: Promise<{ entidade: string }> }
) {
  return handlerPUT(req, { params: await context.params })
}

// DELETE
/**
 * Desativa (soft delete) um metadado por `id` da entidade dinâmica.
 *
 * @see {@link withApiForId}
 * @returns JSON com mensagem de sucesso.
 * @example DELETE /api/meta/situacoes { "id": 1 }
 * @remarks Auditoria ({@link AcaoAuditoria.DELETE}) e permissão {acao: "Desabilitar", recurso: "Metadados"}.
 */
const handlerDELETE = withApiForId<{ entidade: string }>(
  async ({ req, params }) => {
    const validacao = validarEntidadeParams(params)
    if (!validacao.valid) return validacao.response

    const { model } = validacao
    const { id } = await req.json()
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID inválido ou ausente" }, { status: 400 })
    }

    const antes = await model.findUnique({ where: { id: Number(id) } })
    if (!antes) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 })
    }

    const depois = await model.update({
      where: { id: Number(id) },
      data: { active: false, exclusionDate: new Date() },
    })

    return {
      response: NextResponse.json({ message: "Desabilitado com sucesso" }),
      audit: { antes: antes as object, depois: depois as object },
    }
  },
  {
    permissao: { acao: "Desabilitar", recurso: "Metadados" },
    acao: AcaoAuditoria.DELETE,
    tabela: (params) => params.entidade,
  }
)

export async function DELETE(
  req: Request,
  context: { params: Promise<{ entidade: string }> }
) {
  return handlerDELETE(req, { params: await context.params })
}

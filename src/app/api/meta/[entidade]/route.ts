import { NextResponse } from "next/server"

import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { withApiForId } from "@/lib/withApi"
import { validarEntidadeParams } from "@/utils/validarEntidadeParams"
import { readJson, validateOrBadRequest } from "@/lib/validation"
import {
  metaCreateSchema,
  metaDeleteSchema,
  metaUpdateSchema,
} from "@/schemas/server/Meta.zod"

/**
 * Lista metadados de uma entidade dinâmica (e.g., situacoes, encaminhamentos).
 *
 * @see {@link withApiForId}
 * @returns JSON com `{ data, total }`.
 * @example GET /api/meta/situacoes?page=1&pageSize=10
 * @remarks Permissão {acao: "Exibir", recurso: "Metadados"}.
 */
const handlerGET = withApiForId<{ entidade: string }>(
  async ({ req, params }) => {
    const validacao = validarEntidadeParams(params)
    if (!validacao.valid) return validacao.response

    const { model } = validacao
    const { searchParams } = new URL(req.url)

    const rawPage = Number(searchParams.get("page"))
    const rawPageSize = Number(searchParams.get("pageSize"))
    const rawOrderBy = searchParams.get("orderBy") || "nome"
    const ascending = searchParams.get("ascending") === "true"

    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1
    const PAGE_SIZE_DEFAULT = 10
    const PAGE_SIZE_MAX = 100
    const pageSize = Number.isFinite(rawPageSize)
      ? Math.min(Math.max(rawPageSize, 1), PAGE_SIZE_MAX)
      : PAGE_SIZE_DEFAULT

    const ORDERABLE_FIELDS = new Set(["nome", "id"]) // ordenação segura nas entidades meta
    const orderField = ORDERABLE_FIELDS.has(rawOrderBy) ? rawOrderBy : "nome"

    const [total, data] = await Promise.all([
      model.count({ where: { active: true } }),
      model.findMany({
        where: { active: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [orderField]: ascending ? "asc" : "desc" },
      }),
    ])

    return NextResponse.json({ data, total })
  },
  { permissao: { acao: "Exibir", recurso: "Metadados" } }
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
    const raw = await readJson(req)
    const valid = validateOrBadRequest(
      metaCreateSchema,
      raw,
      `POST /api/meta/${params.entidade}`
    )
    if (!valid.ok) return valid.response

    const novo = await model.create({ data: { nome: valid.data.nome } })

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
    const raw = await readJson(req)
    const valid = validateOrBadRequest(
      metaUpdateSchema,
      raw,
      `PUT /api/meta/${params.entidade}`
    )
    if (!valid.ok) return valid.response

    const { id, nome } = valid.data
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
    const raw = await readJson(req)
    const valid = validateOrBadRequest(
      metaDeleteSchema,
      raw,
      `DELETE /api/meta/${params.entidade}`
    )
    if (!valid.ok) return valid.response

    const { id } = valid.data
    const antes = await model.findUnique({ where: { id } })
    if (!antes) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 })
    }

    const depois = await model.update({
      where: { id },
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

/**
 * Módulo de API para gerenciamento de tipos de reclamação.
 *
 * Fornece endpoints para:
 * - Listar os tipos de reclamação ativos (GET)
 * - Criar um novo tipo de reclamação (POST)
 *
 * Observações:
 * - Utiliza Prisma para acesso ao banco de dados.
 * - O POST retorna também informações para auditoria via o wrapper `withApi`.
 */
import { AcaoAuditoria } from "@anpdgovbr/shared-types"

import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/withApi"
import { withApiSlimNoParams } from "@/lib/withApiSlim"

/**
 * GET /api/tiposReclamacao
 *
 * Retorna a lista de tipos de reclamação ativos.
 *
 * Response:
 * - 200: JSON[] contendo os registros de `tipoReclamacao` com `active: true`.
 *
 * Uso:
 * Este handler é registrado via `withApiSlimNoParams`, que aplica validações/autorizações
 * conforme a implementação do wrapper. Não espera corpo de requisição.
 */
export const GET = withApiSlimNoParams(async () => {
  const dados = await prisma.tipoReclamacao.findMany({
    where: { active: true },
  })

  return Response.json(dados)
}, "Exibir_Metadados")

/**
 * POST /api/tiposReclamacao
 *
 * Cria um novo registro de tipo de reclamação.
 *
 * Request:
 * - Body (JSON): objeto com os campos necessários para criar `tipoReclamacao`.
 *
 * Behavior:
 * - Define `active: true` e `exclusionDate: null` no registro criado.
 * - Retorna 201 com o objeto criado em caso de sucesso.
 * - Em caso de erro, retorna 500 com uma mensagem genérica e registra o erro no console.
 *
 * Auditoria:
 * - O wrapper `withApi` espera que o handler retorne um objeto contendo `response`
 *   e `audit` (aqui: `depois` com o novo objeto), que será tratado pelo middleware
 *   de auditoria para persistir logs conforme `tabela` e `acao`.
 */
export const POST = withApi(
  async ({ req }) => {
    try {
      const data = await req.json()

      const novoDado = await prisma.tipoReclamacao.create({
        data: {
          ...data,
          active: true,
          exclusionDate: null,
        },
      })

      return {
        response: Response.json(novoDado, { status: 201 }),
        audit: {
          depois: novoDado,
        },
      }
    } catch (error) {
      console.error("Erro ao criar tipo de reclamação:", error)
      return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
  },
  {
    tabela: "tiporeclamacao",
    acao: AcaoAuditoria.CREATE,
    permissao: "Cadastrar_Metadados",
  }
)

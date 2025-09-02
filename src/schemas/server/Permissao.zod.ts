/**
 * Schemas Zod para validação de Permissões (RBAC).
 */
import { z } from "zod"

const acaoEnum = z.enum([
  "Exibir",
  "Cadastrar",
  "Editar",
  "Desabilitar",
  "VerHistorico",
  "EditarProprio",
  "EditarGeral",
  "Alterar",
  "Registrar",
  "Acessar",
  "Criar",
])

const recursoEnum = z.enum([
  "Processo",
  "Responsavel",
  "Metadados",
  "Relatorios",
  "Usuario",
  "Permissoes",
  "Auditoria",
  "Admin",
])

/**
 * Schema para criação explícita de permissão (POST /api/permissoes).
 *
 * Aceita `perfilId` OU `perfilNome`, além de `acao`, `recurso` e `permitido`.
 */
export const permissaoCreateSchema = z
  .object({
    perfilId: z.coerce.number().int().positive().optional(),
    perfilNome: z.string().min(1).optional(),
    acao: acaoEnum,
    recurso: recursoEnum,
    permitido: z.boolean(),
  })
  .refine((data) => !!(data.perfilId || data.perfilNome), {
    message: "perfilId ou perfilNome é obrigatório",
    path: ["perfilId"],
  })

/**
 * Schema para atualização de flag `permitido` (PATCH /api/permissoes/[id]).
 */
export const permissaoPatchSchema = z.object({
  permitido: z.boolean({ message: "permitido deve ser booleano" }),
})

export type PermissaoCreateInput = z.infer<typeof permissaoCreateSchema>
export type PermissaoPatchInput = z.infer<typeof permissaoPatchSchema>

/**
 * Schemas Zod para validação dos endpoints dinâmicos de Metadados.
 */
import { z } from "zod"

/**
 * Schema para criação de metadado: exige `nome` não vazio.
 */
export const metaCreateSchema = z.object({
  nome: z.string().min(1, { message: "nome é obrigatório" }),
})

/**
 * Schema para atualização: exige `id` numérico positivo e `nome` não vazio.
 */
export const metaUpdateSchema = z.object({
  id: z.coerce.number().int().positive({ message: "id inválido" }),
  nome: z.string().min(1, { message: "nome é obrigatório" }),
})

/**
 * Schema para exclusão (soft delete): exige `id` numérico positivo.
 */
export const metaDeleteSchema = z.object({
  id: z.coerce.number().int().positive({ message: "id inválido" }),
})

export type MetaCreateInput = z.infer<typeof metaCreateSchema>
export type MetaUpdateInput = z.infer<typeof metaUpdateSchema>
export type MetaDeleteInput = z.infer<typeof metaDeleteSchema>
